"use client";
import React from "react";
import { useForm } from "react-hook-form";
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
	CardFooter,
	Checkbox,
} from "@/components";
import { Lock, Mail } from "lucide-react";
import { LoginFormSchema } from "@/lib/definitions";
import { LoginFormData } from "@/types";
import { loginAction, revalidatePathAction } from "@/actions";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Image from "next/image";
import Link from "next/link";

const LoginForm = () => {
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
		try {
			const response = await loginAction(data.email, data.password);

			if (response?.error.message) {
				throw new Error(response.error.message);
			}

			await revalidatePathAction("/");
			toast.success("Success", {
				description: "Welcome back!",
				position: "top-center",
				richColors: true,
				duration: 5000,
			});
		} catch (err) {
			toast.error("Log in Error", {
				description: (err as Error).message,
				position: "top-center",
				richColors: true,
				duration: 5000,
			});
		}
	};

	return (
		<div className=" bg-[url('/images/auth-form-bg.png')] bg-cover bg-center rounded-[2rem] ring-4 ring-[#949494] bg-opacity-65  ">
			<Card className="w-full md:min-w-[400px] pt-16 max-w-md mx-auto border-none bg-transparent relative">
				<Image
					src="/icon.svg"
					height={120}
					width={120}
					alt="LNHS Logo"
					className="absolute -translate-y-[105%] -translate-x-[50%] left-[50%]"
				/>
				<CardContent>
					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
							<FormField
								control={form.control}
								name="email"
								render={({ field }) => (
									<FormItem>
										<FormControl>
											<div className="relative mt-8">
												<Mail className="absolute left-2 top-[50%] translate-y-[-50%] h-4 w-4 text-muted-foreground" />
												<Input
													readOnly={form.formState.isSubmitting}
													placeholder="Enter email address"
													className="pl-8 bg-white border-none h-10 rounded-none"
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
													className="pl-8 rounded-none bg-white border-none h-10"
													{...field}
												/>
											</div>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<div className="flex items-center justify-between">
								<div>
									<FormField
										control={form.control}
										name="rememberMe"
										render={({ field }) => (
											<FormItem>
												<FormControl>
													<div className="flex gap-2">
														<Checkbox
															className="rounded-none data-[state=checked]:text-white  border-black data-[state=checked]:bg-black"
															onCheckedChange={field.onChange}
															type="button"
														/>
														<FormLabel className="text-white ">
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
									className="px-0 font-normal text-white italic"
									type="button">
									Forgot password?
								</Button>
							</div>

							<Button
								type="submit"
								className="w-full"
								disabled={form.formState.isSubmitting}>
								{form.formState.isSubmitting ? "Logging in..." : "Login"}
							</Button>
						</form>
					</Form>
				</CardContent>

				<CardFooter className="flex justify-center">
					<p className="text-sm text-white">
						Don&apos;t have an account?{" "}
						<Button
							variant="link"
							className="px-0 font-normal text-primary hover:underline"
							type="button"
							asChild>
							<Link href="signup">Sign up </Link>
						</Button>
					</p>
				</CardFooter>
			</Card>
		</div>
	);
};

export default LoginForm;
