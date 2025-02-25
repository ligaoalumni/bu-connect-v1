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
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

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
	const [showPassword, setShowPassword] = useState(false);

	const handleSignUp = async (values: z.infer<typeof SignupFormSchema>) => {
		try {
			const data = await signUpAction(values);
		} catch (error) {
			console.error(error);
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
			<form onSubmit={form.handleSubmit(handleSignUp)} className="w-full">
				<FormField
					control={form.control}
					name="firstName"
					render={({ field }) => (
						<FormItem>
							<FormLabel>First Name</FormLabel>
							<FormControl>
								<Input placeholder="Your first name" {...field} />
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
								<Input placeholder="Your last name" {...field} />
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
								<Input placeholder="Your email" {...field} />
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
									<p className="text-sm font-medium">Password requirements:</p>
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

				<Button type="submit" className="mt-5 w-full">
					Submit
				</Button>
			</form>
		</Form>
	);
}
