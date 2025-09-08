"use client";
import { jwtDecode } from "jwt-decode";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { CredentialResponse, GoogleLogin } from "@react-oauth/google";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Button,
  Card,
  CardContent,
  Checkbox,
  OverlayLoading,
} from "@/components";
import { Lock, Mail } from "lucide-react";
import { LoginFormSchema } from "@/lib";
import { LoginFormData } from "@/types";
import {
  loginAction,
  loginWithGoogleAction,
  revalidatePathAction,
} from "@/actions";
import { toast } from "sonner";
import Image from "next/image";
import Link from "next/link";
import Approval from "../__components/approval";
import { useRouter } from "next/navigation";

const LoginForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const router = useRouter();
  const form = useForm<LoginFormData>({
    resolver: zodResolver(LoginFormSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    let success = false;
    let isAdmin = false;
    try {
      const response = await loginAction(data.email, data.password);

      if (response?.error && response?.error.message) {
        if (response.error.isPending) {
          setIsPending(true);
        }

        throw new Error(response.error.message);
      }

      success = true;
      if (response.role && response.role !== "ALUMNI") {
        isAdmin = true;
      }
    } catch (err) {
      // success = false;

      toast.error("Log in Error", {
        description: (err as Error).message,
        position: "top-center",
        richColors: true,
        duration: 5000,
      });
    } finally {
      if (success) {
        toast.success("Success", {
          description: "Welcome back!",
          position: "top-center",
          richColors: true,
          duration: 5000,
        });

        setTimeout(() => {
          router.push(isAdmin ? "/admin" : "/");
        }, 2000);
      } else setIsLoading(false);
    }
  };

  const handleApprovalClick = () => {
    setIsPending(false);
    form.reset();
  };

  const handleLoginWithGoogle = async (credential: CredentialResponse) => {
    if (credential.credential) {
      setIsLoading(true);
      const data: {
        email: string;
        family_name: string;
        given_name: string;
        picture?: string;
      } = jwtDecode(credential.credential);

      let success = false;
      let isAdmin = false;
      let redirectToRegister = "";

      try {
        const response = await loginWithGoogleAction({
          email: data.email,
          firstName: data.given_name,
          lastName: data.family_name,
          photo: data.picture || "",
        });

        if (
          response.error &&
          response?.error.message === "User is not registered"
        ) {
          redirectToRegister =
            "/signup?email=" +
            data.email +
            "&firstName=" +
            data.given_name +
            "&lastName=" +
            data.family_name +
            (data.picture ? "&photo=" + data.picture : "");
        } else if (response.error && response?.error.message) {
          if (response.error.isPending) {
            setIsPending(true);
          }

          throw new Error(response.error.message);
        }
        if (response.role && response.role !== "ALUMNI") {
          isAdmin = true;
        }
        success = true;
      } catch (err) {
        success = false;

        toast.error("Log in Error", {
          description: (err as Error).message,
          position: "top-center",
          richColors: true,
          duration: 5000,
        });
      } finally {
        if (redirectToRegister) {
          await revalidatePathAction(redirectToRegister, redirectToRegister);
        } else if (success) {
          toast.success("Success", {
            description: "Welcome back!",
            position: "top-center",
            richColors: true,
            duration: 5000,
          });
          await revalidatePathAction("/", isAdmin ? "/admin" : "/");
        }
        setIsLoading(false);
      }
    } else {
      toast.error("Google Sign In failed. Try again later.", {
        richColors: true,
        duration: 5000,
        description: "If the problem persists, contact the administrator.",
        position: "top-center",
      });
    }
  };

  return (
    <div className="z-50 bg-[#94949440]  bg-cover bg-center rounded-[0.7rem] ring-0 ring-[#949494] bg-opacity-20   ">
      <Card className="w-full md:min-w-[400px] pt-[4.15rem] max-w-md mx-auto border-none bg-transparent relative">
        <Image
          src="/images/bup-logo.png"
          height={120}
          width={120}
          alt="BUP Logo"
          className="absolute -translate-y-[105%] -translate-x-[50%] left-[50%]"
        />

        {isPending ? (
          <div className="p-5">
            <Approval handleClick={handleApprovalClick} />
          </div>
        ) : (
          <>
            <CardContent>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-4"
                >
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <div className="relative mt-6">
                            <Mail className="absolute left-2 top-[50%] translate-y-[-50%] h-4 w-4 text-muted-foreground" />
                            <Input
                              readOnly={form.formState.isSubmitting}
                              placeholder="Enter email address"
                              className="pl-8 bg-white dark:text-black  dark:selection:bg-black/15 border-none h-10 rounded-none"
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <div className="relative ">
                            <Lock className="absolute left-2 top-[50%] translate-y-[-50%] h-4 w-4 text-muted-foreground" />
                            <Input
                              readOnly={form.formState.isSubmitting}
                              type="password"
                              placeholder="Enter password"
                              className="pl-8 rounded-none dark:text-black dark:selection:bg-black/15 bg-white border-none h-10"
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex items-center justify-between mt-2">
                    <div>
                      <FormField
                        control={form.control}
                        name="rememberMe"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <div className="flex gap-2">
                                <Checkbox
                                  className="rounded-none data-[state=checked]:text-white dark:text-black  border-black data-[state=checked]:bg-black"
                                  onCheckedChange={field.onChange}
                                  type="button"
                                />
                                <FormLabel className="text-white dark:text-black ">
                                  Remember me
                                </FormLabel>
                              </div>
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                    <Button
                      variant="link"
                      className="px-0 font-normal text-white    italic"
                      type="button"
                      asChild
                    >
                      <Link href="/forgot-password">Forgot password?</Link>
                    </Button>
                  </div>

                  <Button
                    type="submit"
                    className="w-full mt-2 bg-[#FF9500] hover:bg-[#FF9500]"
                    disabled={form.formState.isSubmitting}
                  >
                    {form.formState.isSubmitting ? "Logging in..." : "Login"}
                  </Button>
                </form>
              </Form>

              <div className="flex flex-row my-3 items-center gap-2">
                <div className="w-full bg-[#FF950060] h-0.5" />
                <p className="text-white  text-nowrap">Sign in with</p>
                <div className="w-full bg-[#FF950060] h-0.5" />
              </div>
              <div className="max-w-11 rounded relative overflow-hidden mx-auto">
                <GoogleLogin
                  theme="outline"
                  locale="en-PH"
                  shape="circle"
                  onSuccess={handleLoginWithGoogle}
                  onError={() => {
                    toast.error(
                      "Google Sign In was unsuccessful. Try again later.",
                      {
                        richColors: true,
                        duration: 5000,
                        description:
                          "If the problem persists, contact the administrator.",
                        position: "top-center",
                      },
                    );
                  }}
                />
              </div>
            </CardContent>
          </>
        )}
      </Card>

      <OverlayLoading
        isLoading={isLoading}
        message="Processing your request..."
        backdrop="blur"
        spinnerSize="md"
      />
    </div>
  );
};

export default LoginForm;
