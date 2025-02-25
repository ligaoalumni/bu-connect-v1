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
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
	Alert,
	AlertDescription,
} from "@/components";
import { Lock, Mail } from "lucide-react";
import { LoginFormSchema } from "@/lib/definitions";
import { LoginFormData } from "@/types";
import { loginAction } from "@/actions";

const LoginForm = () => {
	const [serverError, setServerError] = React.useState<string | null>(null);

	const form = useForm<LoginFormData>({
		resolver: zodResolver(LoginFormSchema),
		defaultValues: {
			email: "",
			password: "",
		},
	});

	const onSubmit = async (data: LoginFormData) => {
		try {
			const response = await loginAction(data.email, data.password);

			console.log(response, " qqq");

			if (response.error.message) {
				throw new Error(response.error.message);
			}
		} catch (err) {
			setServerError((err as Error).message);
		}
	};

	return (
		<Card className="w-full max-w-md mx-auto">
			<CardHeader className="space-y-1">
				<CardTitle className="text-2xl font-bold">Login</CardTitle>
				<CardDescription>
					Enter your email and password to access your account
				</CardDescription>
			</CardHeader>

			<CardContent>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
						{serverError && (
							<Alert variant="destructive">
								<AlertDescription>{serverError}</AlertDescription>
							</Alert>
						)}

						<FormField
							control={form.control}
							name="email"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Email</FormLabel>
									<FormControl>
										<div className="relative">
											<Mail className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
											<Input
												placeholder="Enter your email"
												className="pl-8"
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
									<FormLabel>Password</FormLabel>
									<FormControl>
										<div className="relative">
											<Lock className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
											<Input
												type="password"
												placeholder="Enter your password"
												className="pl-8"
												{...field}
											/>
										</div>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<div className="flex items-center justify-end">
							<Button variant="link" className="px-0 font-normal" type="button">
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
				<p className="text-sm text-gray-600">
					Don&apos;t have an account?{" "}
					<Button variant="link" className="px-0 font-normal" type="button">
						Sign up
					</Button>
				</p>
			</CardFooter>
		</Card>
	);
};

export default LoginForm;
