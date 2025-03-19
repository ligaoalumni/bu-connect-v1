"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { SignupFormSchema } from "@/lib/definitions";
import {
	Button,
	Checkbox,
	Form,
	FormControl,
	FormField,
	FormItem,
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

// Define the form's type
const currentYear = new Date().getFullYear(); // Get the current year
const years = Array.from({ length: 50 }, (_, i) => currentYear - i); // Create a range of years for the last 50 years

export default function SignupForm() {
	const form = useForm<z.infer<typeof SignupFormSchema>>({
		resolver: zodResolver(SignupFormSchema),
		defaultValues: {
			email: "",
			firstName: "",
			middleName: "",
			lastName: "",
			password: "",
			batchYear: "",
		},
	});
	const [showPassword, setShowPassword] = useState(false);
	const [acceptTermsAndConditions, setAcceptTermsAndConditions] =
		useState(false);

	const [success, setSuccess] = useState(false);

	const handleSignUp = async (values: z.infer<typeof SignupFormSchema>) => {
		try {
			await signUpAction(values);

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
			<form
				onSubmit={form.handleSubmit(handleSignUp)}
				className="max-w-xl lg:min-w-[24rem] bg-[url('/images/auth-form-bg.png')] bg-cover bg-center rounded-[2rem] ring-4 ring-[#949494] bg-opacity-65 pt-14  w-full border border-black/5 p-5   shadow-sm pb-10 flex flex-col justify-between">
				<Image
					src="/icon.svg"
					height={120}
					width={120}
					alt="LNHS Logo"
					className="absolute -translate-y-[105%] -translate-x-[50%] left-[50%]"
				/>
				{!success ? (
					<>
						{/* <div className="flex flex-col items-center mb-6">
							<div className="rounded-full bg-green-200 p-4 shadow-lg">
								<CheckCircle2 className="h-16 w-16 text-green-700" />
							</div>
						</div> */}
						<h1 className="text-2xl mt-4 font-bold text-center text-white">
							Registration Successful
						</h1>
						<p className="text-lg text-center text-white">
							Your account is pending approval
						</p>
						<p className="text-white text-center mt-2">
							Thank you for registering! Your account is currently under review
							by our administrators.
						</p>
						<div className="bg-gray-100 rounded-lg p-6 shadow-md mt-4">
							<h3 className="font-semibold text-lg text-gray-800">
								What happens next?
							</h3>
							<ul className="text-sm text-gray-600 list-disc list-inside space-y-1 mt-2">
								<li>Our admin team will review your registration</li>
								<li>You will receive an email once your account is approved</li>
								<li>After approval, you can log in to your account</li>
							</ul>
						</div>
						<p className="text-sm text-white text-center mt-4">
							This process typically takes 1-2 business days. Please check your
							email for updates.
						</p>
						<Button asChild variant="link" className="mt-3">
							<Link href="/login">Back to log in</Link>
						</Button>
					</>
				) : (
					<>
						<div className="flex flex-col mt-8 px-5 md:flex-row gap-5 justify-between">
							<div className="space-y-4">
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
									name="lrn"
									render={({ field }) => (
										<FormItem>
											<FormControl>
												<Input
													readOnly={form.formState.isSubmitting}
													placeholder="Enter LRN"
													className="bg-white border-none h-12 rounded-md"
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>
							<div className="space-y-4">
								<FormField
									control={form.control}
									name="batchYear"
									render={({ field }) => (
										<FormItem>
											<FormControl>
												{/* <Input
											readOnly={form.formState.isSubmitting}
											placeholder="Batch Year"
											className="bg-white border-none h-12 rounded-md"
											{...field}
										/> */}
												<Select
													onValueChange={(value: string) =>
														field.onChange(String(value))
													}
													value={field.value.toString()}>
													{/* Option to prompt user */}
													<SelectTrigger className="w-full bg-white h-12">
														<SelectValue placeholder="Select a year" />
													</SelectTrigger>
													<SelectContent>
														<SelectGroup>
															<SelectLabel>Year</SelectLabel>
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
																className="flex items-center gap-2">
																<span
																	className={
																		validation.test
																			? "text-green-500"
																			: "text-red-500"
																	}>
																	{validation.test ? "✓" : "×"}
																</span>
																<span className="text-sm text-gray-600">
																	{validation.message}
																</span>
															</div>
														)
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
							</div>
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
						<Button
							disabled={
								form.formState.isSubmitting || !acceptTermsAndConditions
							}
							type="submit"
							size="lg"
							className={`max-w-fit mx-auto  mt-5 ${
								form.formState.isSubmitting && "cursor-wait"
							}`}>
							{form.formState.isSubmitting && (
								<Loader2 className="animate-spin" />
							)}
							{form.formState.isSubmitting ? "Signing up..." : "Sign up"}
						</Button>
						<div className="flex gap-2 items-center justify-center text-xs mt-5">
							<p className="text-white">Already have an account?</p>
							<Link href="/login" className="text-primary hover:underline">
								Log in here
							</Link>
						</div>
					</>
				)}
			</form>
		</Form>
	);
}
