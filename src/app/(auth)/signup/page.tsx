"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { SignupFormSchema } from "@/lib";
import {
  Button,
  Checkbox,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  InputWithIcon,
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components";
import { signUpAction } from "@/actions";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import Image from "next/image";
import Link from "next/link";
import Approval from "../__components/approval";
import { useRouter, useSearchParams } from "next/navigation";
import { programs } from "@/constant";
import { DatePicker } from "@/app/admin/alumni/__components/date-picker";

// Define the form's type
const currentYear = new Date().getFullYear() - 1; // Get the current year
const years = Array.from({ length: 50 }, (_, i) => currentYear - i); // Create a range of years for the last 50 years

export default function SignupForm() {
  const router = useRouter();
  const params = useSearchParams();
  const emailParam = params.get("email");
  const firstNameParam = params.get("firstName");
  const lastNameParam = params.get("lastName");
  const photo = params.get("photo");

  const form = useForm<z.infer<typeof SignupFormSchema>>({
    resolver: zodResolver(SignupFormSchema),
    defaultValues: {
      email: emailParam || "",
      firstName: firstNameParam || "",
      middleName: "",
      lastName: lastNameParam || "",
      password: "",
      batchYear: "",
      program: "",
    },
  });
  const [showPassword, setShowPassword] = useState(false);
  const [acceptTermsAndConditions, setAcceptTermsAndConditions] =
    useState(false);

  const [success, setSuccess] = useState(false);

  const handleSignUp = async (values: z.infer<typeof SignupFormSchema>) => {
    try {
      await signUpAction({ ...values, photo: photo || "" });

      setSuccess(true);
      toast.success("Successfully signed up", {
        richColors: true,
        position: "top-center",
        duration: 10000,
      });

      // if (data && data.role !== "ALUMNI") {
      // 	return router.replace("/admin");
      // } else router.replace("/set-up-account");
    } catch (error) {
      toast.error(`Failed to sign up`, {
        description: (error as Error).message,
        richColors: true,
        position: "top-center",
        duration: 10000,
      });
    }
  };

  // Show all current password validation errors
  const getPasswordValidationState = () => {
    const password = form.watch("password");
    const validations = [
      { test: password.length >= 8, message: "At least 8 characters" },
      { test: /[A-Z]/.test(password), message: "Contains uppercase letter" },
      { test: /[a-z]/.test(password), message: "Contains lowercase letter" },
      { test: /[0-9]/.test(password), message: "Contains number" },
      {
        test: /[^A-Za-z0-9]/.test(password),
        message: "Contains special character",
      },
    ];

    return validations;
  };

  const handleShowPassword = () => setShowPassword(!showPassword);

  return (
    <Form {...form}>
      <div className=" z-50 bg-[#94949440]  bg-cover bg-center rounded-[0.7rem] ring-0 ring-[#949494] bg-opacity-20  px-10">
        <form
          onSubmit={form.handleSubmit(handleSignUp)}
          className="w-full md:min-w-[24rem] pt-[4.15rem] max-w-md mx-auto border-none bg-transparent relative"
          // className="z-50 max-w-xl mt-20 md:mt-0 lg:min-w-[24rem] bg-[url('/images/auth-form-bg.png')] bg-cover bg-center rounded-[2rem] ring-4 ring-[#949494] bg-opacity-65 pt-14  w-full border border-black/5 p-5   shadow-sm pb-10 flex flex-col justify-between"
        >
          <Image
            src="/images/bup-logo.png"
            height={120}
            width={120}
            alt="LNHS Logo"
            className="absolute -translate-y-[105%] -translate-x-[50%] left-[50%]"
          />
          {success ? (
            <Approval handleClick={() => router.replace("/login")} />
          ) : (
            <>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 lg:gap-5  mt-8 ">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          readOnly={form.formState.isSubmitting}
                          placeholder="Enter first name"
                          className="bg-white border-none h-12 rounded-md"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />{" "}
                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          readOnly={form.formState.isSubmitting}
                          placeholder="Enter last name"
                          className="bg-white border-none h-12 rounded-md"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="middleName"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          readOnly={form.formState.isSubmitting}
                          placeholder="Enter middle name"
                          className="bg-white border-none h-12 rounded-md"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          readOnly={form.formState.isSubmitting}
                          placeholder="Your email"
                          className="bg-white border-none h-12 rounded-md"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="birthDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        {/*<DatePicker value={field.value} onChange={field.onChange} />*/}
                        {/*<Input type="date" {...field} />*/}
                        <DatePicker
                          label="Birth Date *"
                          className="h-12"
                          onChange={(v) => {
                            if (!v) return;
                            field.onChange(v.toISOString());
                          }}
                          value={
                            field.value ? new Date(field.value) : undefined
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="batchYear"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Select
                          onValueChange={(value: string) =>
                            field.onChange(String(value))
                          }
                          value={field.value.toString()}
                        >
                          {/* Option to prompt user */}
                          <SelectTrigger className="bg-white border-none h-12 rounded-md w-full  ">
                            <SelectValue placeholder="Select a year" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectLabel>Batch Year</SelectLabel>
                              {years.map((year) => (
                                <SelectItem value={year.toString()} key={year}>
                                  {year}
                                </SelectItem>
                              ))}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
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
                        <InputWithIcon
                          className="bg-white border-none h-12 rounded-md"
                          inputProps={{
                            readOnly: form.formState.isSubmitting,
                            placeholder: "Your password",
                            type: !showPassword ? "password" : "text",
                            ...field,
                          }}
                          endIcon={
                            showPassword ? (
                              <Eye
                                className="h-5 w-5 cursor-pointer"
                                onClick={handleShowPassword}
                              />
                            ) : (
                              <EyeOff
                                className="h-5 w-5 cursor-pointer"
                                onClick={handleShowPassword}
                              />
                            )
                          }
                        />
                      </FormControl>
                      {form.formState.errors.password && (
                        <div className="space-y-2">
                          <p className="text-sm font-medium">
                            Password requirements:
                          </p>
                          {getPasswordValidationState().map(
                            (validation, index) => (
                              <div
                                key={index}
                                className="flex items-center gap-2"
                              >
                                <span
                                  className={
                                    validation.test
                                      ? "text-green-500"
                                      : "text-red-500"
                                  }
                                >
                                  {validation.test ? "✓" : "×"}
                                </span>
                                <span className="text-sm text-gray-600">
                                  {validation.message}
                                </span>
                              </div>
                            ),
                          )}
                        </div>
                      )}
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <InputWithIcon
                          className="bg-white border-none h-12 rounded-md"
                          inputProps={{
                            readOnly: form.formState.isSubmitting,
                            placeholder: "Confirm password",
                            type: !showPassword ? "password" : "text",
                            ...field,
                          }}
                          endIcon={
                            showPassword ? (
                              <Eye
                                className="h-5 w-5 cursor-pointer"
                                onClick={handleShowPassword}
                              />
                            ) : (
                              <EyeOff
                                className="h-5 w-5 cursor-pointer"
                                onClick={handleShowPassword}
                              />
                            )
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="program"
                  render={({ field }) => (
                    <FormItem className="lg:col-span-2">
                      <FormLabel>Program *</FormLabel>
                      <Select
                        onValueChange={(v) => {
                          field.onChange(v);
                          form.clearErrors("program");
                        }}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="bg-white border-none h-12 rounded-md w-full  ">
                            <SelectValue placeholder="Select student's program" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Program</SelectLabel>
                            {programs.map((program) => (
                              <SelectItem value={program} key={program}>
                                {program}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex items-center mt-5 gap-2 justify-center">
                <Checkbox
                  onCheckedChange={(check) =>
                    setAcceptTermsAndConditions(!!check)
                  }
                  className="rounded-none data-[state=checked]:bg-black border-black data-[state=checked]:text-white"
                />
                <p className="text-white text-xs">
                  Agree to our terms and have read and acknowledge our privacy
                  policy
                </p>
              </div>
              <center>
                <Button
                  disabled={
                    form.formState.isSubmitting || !acceptTermsAndConditions
                  }
                  type="submit"
                  size="lg"
                  className={`max-w-fit mx-auto  mt-5 ${
                    form.formState.isSubmitting && "cursor-wait"
                  }`}
                >
                  {form.formState.isSubmitting && (
                    <Loader2 className="animate-spin" />
                  )}
                  {form.formState.isSubmitting ? "Signing up..." : "Sign up"}
                </Button>
              </center>
              <div className="flex mb-5 gap-2 items-center justify-center text-xs mt-5">
                <p className="text-white">Already have an account?</p>
                <Link href="/login" className="text-blue-300 hover:underline">
                  Log in here
                </Link>
              </div>
            </>
          )}
        </form>
      </div>
    </Form>
  );
}
