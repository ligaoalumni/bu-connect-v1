"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
	Button,
	Input,
	Checkbox,
	Slider,
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components";
import { toast } from "sonner";
import { RefreshCw, Mail, Eye, EyeOff } from "lucide-react";
import { AdminFormData } from "@/types";
import { generatePassword, AdminSchema } from "@/lib";
import { createAdmin } from "@/actions/user";

// Form schema

export function AdminCredentialsGenerator() {
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [showPassword, setShowPassword] = useState(false);

	// Initialize form with default values
	const form = useForm<AdminFormData>({
		resolver: zodResolver(AdminSchema),
		defaultValues: {
			firstName: "",
			lastName: "",
			email: "",
			role: "ADMIN",
			password: generatePassword({
				length: 16,
				uppercase: true,
				lowercase: true,
				numbers: true,
				symbols: true,
			}),
			passwordLength: 16,
			includeUppercase: true,
			includeLowercase: true,
			includeNumbers: true,
			includeSymbols: true,
		},
	});

	// Generate a new password based on current options
	const handleGeneratePassword = () => {
		const {
			passwordLength,
			includeUppercase,
			includeLowercase,
			includeNumbers,
			includeSymbols,
		} = form.getValues();

		const newPassword = generatePassword({
			length: passwordLength,
			uppercase: includeUppercase,
			lowercase: includeLowercase,
			numbers: includeNumbers,
			symbols: includeSymbols,
		});

		form.setValue("password", newPassword);
	};

	// Handle form submission
	const onSubmit = async (data: AdminFormData) => {
		setIsSubmitting(true);

		try {
			// Send credentials via email
			await createAdmin(data);

			toast.success("Credentials sent successfully", {
				description: `Login details have been sent to ${data.email}`,
				richColors: true,
				position: "top-center",
			});

			// Reset form
			form.reset();
			generatePassword({
				length: form.getValues().passwordLength,
				uppercase: form.getValues().includeUppercase,
				lowercase: form.getValues().includeLowercase,
				numbers: form.getValues().includeNumbers,
				symbols: form.getValues().includeSymbols,
			});
		} catch (error) {
			toast.error("An error occurred", {
				description:
					(error as Error).message ||
					"There was an error sending the login details. Please try again.",
				richColors: true,
				position: "top-center",
			});
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<Card>
			<CardHeader>
				<CardTitle>Admin Credentials</CardTitle>
				<CardDescription>
					Generate a secure password and send login details to the new
					administrator.
				</CardDescription>
			</CardHeader>

			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)}>
					<CardContent className="space-y-6">
						{/* Admin Information */}
						<div className="space-y-4">
							<h3 className="text-lg font-medium">Admin Information</h3>

							<div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
								<FormField
									control={form.control}
									name="firstName"
									render={({ field }) => (
										<FormItem>
											<FormLabel>First Name</FormLabel>
											<FormControl>
												<Input placeholder="John" {...field} />
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
											<FormLabel>Middle Name</FormLabel>
											<FormControl>
												<Input placeholder="" {...field} />
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
												<Input placeholder="Doe" {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>
							<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
								<FormField
									control={form.control}
									name="email"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Email</FormLabel>
											<FormControl>
												<Input
													type="email"
													placeholder="admin@example.com"
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								<FormField
									control={form.control}
									name="role"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Admin Role</FormLabel>
											<Select
												onValueChange={field.onChange}
												defaultValue={field.value}>
												<FormControl>
													<SelectTrigger>
														<SelectValue placeholder="Select a role" />
													</SelectTrigger>
												</FormControl>
												<SelectContent>
													<SelectItem value="ADMIN">Admin</SelectItem>
													<SelectItem value="SUPER_ADMIN">
														Super Admin
													</SelectItem>
												</SelectContent>
											</Select>
											<FormDescription>
												Determines the level of access and permissions.
											</FormDescription>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>
						</div>

						{/* Password Generation */}
						<div className="space-y-4">
							<div className="flex items-center justify-between">
								<h3 className="text-lg font-medium">Password Generation</h3>
								<Button
									type="button"
									variant="outline"
									size="sm"
									onClick={handleGeneratePassword}
									className="h-8">
									<RefreshCw className="mr-2 h-3.5 w-3.5" />
									Regenerate
								</Button>
							</div>

							<div className="grid grid-cols-1 md:grid-cols-2">
								<div className="space-y-6">
									<FormField
										control={form.control}
										name="password"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Generated Password</FormLabel>
												<div className="flex">
													<FormControl>
														<div className="relative w-full">
															<Input
																readOnly
																type={showPassword ? "text" : "password"}
																{...field}
																className="pr-10"
															/>
															<Button
																type="button"
																variant="ghost"
																size="sm"
																className="absolute right-0 top-0 h-full px-3"
																onClick={() => setShowPassword(!showPassword)}>
																{showPassword ? (
																	<EyeOff className="h-4 w-4" />
																) : (
																	<Eye className="h-4 w-4" />
																)}
															</Button>
														</div>
													</FormControl>
												</div>
												<FormMessage />
											</FormItem>
										)}
									/>

									<FormField
										control={form.control}
										name="passwordLength"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Password Length: {field.value}</FormLabel>
												<FormControl>
													<Slider
														min={8}
														max={32}
														step={1}
														value={[field.value]}
														onValueChange={(value) => {
															field.onChange(value[0]);
														}}
														className="py-4"
													/>
												</FormControl>
												<FormDescription>
													Choose a length between 8 and 32 characters.
												</FormDescription>
												<FormMessage />
											</FormItem>
										)}
									/>
								</div>

								<div className="grid grid-cols-1 gap-3 p-5 sm:grid-cols-2  ">
									<FormField
										control={form.control}
										name="includeUppercase"
										render={({ field }) => (
											<FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
												<FormControl>
													<Checkbox
														checked={field.value}
														onCheckedChange={field.onChange}
													/>
												</FormControl>
												<div className="space-y-1 leading-none">
													<FormLabel>Uppercase Letters</FormLabel>
													<FormDescription>Include A-Z</FormDescription>
												</div>
											</FormItem>
										)}
									/>

									<FormField
										control={form.control}
										name="includeLowercase"
										render={({ field }) => (
											<FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
												<FormControl>
													<Checkbox
														checked={field.value}
														onCheckedChange={field.onChange}
													/>
												</FormControl>
												<div className="space-y-1 leading-none">
													<FormLabel>Lowercase Letters</FormLabel>
													<FormDescription>Include a-z</FormDescription>
												</div>
											</FormItem>
										)}
									/>

									<FormField
										control={form.control}
										name="includeNumbers"
										render={({ field }) => (
											<FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
												<FormControl>
													<Checkbox
														checked={field.value}
														onCheckedChange={field.onChange}
													/>
												</FormControl>
												<div className="space-y-1 leading-none">
													<FormLabel>Numbers</FormLabel>
													<FormDescription>Include 0-9</FormDescription>
												</div>
											</FormItem>
										)}
									/>

									<FormField
										control={form.control}
										name="includeSymbols"
										render={({ field }) => (
											<FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
												<FormControl>
													<Checkbox
														checked={field.value}
														onCheckedChange={field.onChange}
													/>
												</FormControl>
												<div className="space-y-1 leading-none">
													<FormLabel>Special Characters</FormLabel>
													<FormDescription>Include !@#$%^&*</FormDescription>
												</div>
											</FormItem>
										)}
									/>
								</div>
							</div>
						</div>
					</CardContent>

					<CardFooter>
						<Button type="submit" className="w-full" disabled={isSubmitting}>
							{isSubmitting ? (
								<>
									<RefreshCw className="mr-2 h-4 w-4 animate-spin" />
									Sending...
								</>
							) : (
								<>
									<Mail className="mr-2 h-4 w-4" />
									Send Credentials
								</>
							)}
						</Button>
					</CardFooter>
				</form>
			</Form>
		</Card>
	);
}
