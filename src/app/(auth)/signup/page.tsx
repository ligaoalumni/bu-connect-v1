"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { SignupFormSchema } from "@/lib/definitions";
import {
	Button,
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
	Input,
	InputWithIcon,
} from "@/components";
import { signUpAction } from "@/actions";
import { Eye, EyeOff, GraduationCap, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function SignupForm() {
	const form = useForm<z.infer<typeof SignupFormSchema>>({
		resolver: zodResolver(SignupFormSchema),
		defaultValues: {
			email: "",
			firstName: "",
			lastName: "",
			password: "",
		},
	});
	const router = useRouter();
	const [showPassword, setShowPassword] = useState(false);

	const handleSignUp = async (values: z.infer<typeof SignupFormSchema>) => {
		try {
			const data = await signUpAction(values);

			toast.success("Successfully signed up", {
				richColors: true,
				position: "top-center",
				duration: 10000,
			});

			if (data && data.role !== "ALUMNI") {
				return router.replace("/admin");
			} else router.replace("/set-up-account");
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
			<form
				onSubmit={form.handleSubmit(handleSignUp)}
				className="max-w-sm lg:min-w-[24rem]  w-full border border-black/5 p-5 rounded-lg shadow-sm pb-10 flex flex-col justify-between">
				<div className="flex flex-col items-center mb-5">
					<GraduationCap className="h-20 w-20" />
					<h1 className="text-2xl font-medium">Sign in</h1>
					<h5 className="text-sm text-gray-600">LNHS - Alumni Tracker</h5>
				</div>
				<div className="space-y-4">
					<FormField
						control={form.control}
						name="firstName"
						render={({ field }) => (
							<FormItem>
								<FormLabel>First Name</FormLabel>
								<FormControl>
									<Input
										readOnly={form.formState.isSubmitting}
										placeholder="Your first name"
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="lastName"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Last Name</FormLabel>
								<FormControl>
									<Input
										readOnly={form.formState.isSubmitting}
										placeholder="Your last name"
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
								<FormLabel>Email</FormLabel>
								<FormControl>
									<Input
										readOnly={form.formState.isSubmitting}
										placeholder="Your email"
										{...field}
									/>
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
									<InputWithIcon
										className=""
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
										{getPasswordValidationState().map((validation, index) => (
											<div key={index} className="flex items-center gap-2">
												<span
													className={
														validation.test ? "text-green-500" : "text-red-500"
													}>
													{validation.test ? "✓" : "×"}
												</span>
												<span className="text-sm text-gray-600">
													{validation.message}
												</span>
											</div>
										))}
									</div>
								)}
							</FormItem>
						)}
					/>
				</div>
				<Button
					disabled={form.formState.isSubmitting}
					type="submit"
					className={`w-full mt-5 ${
						form.formState.isSubmitting && "cursor-wait"
					}`}>
					{form.formState.isSubmitting && <Loader2 className="animate-spin" />}
					{form.formState.isSubmitting ? "Signing up..." : "Sign up"}
				</Button>
			</form>
		</Form>
	);
}
