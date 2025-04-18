"use client";

import { updatePasswordAction } from "@/actions";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
	Button,
	Input,
	Form,
	FormField,
	FormItem,
	FormControl,
	FormLabel,
	FormMessage,
} from "@/components";
import { useAuth } from "@/contexts/auth-context";
import { ChangePasswordSchema } from "@/lib/definitions";
import { ChangePasswordFormData } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export function ChangePassword() {
	const [showModal, setShowModal] = useState(false);
	const { user } = useAuth();
	const [showPassword, setShowPassword] = useState(false);

	const form = useForm<ChangePasswordFormData>({
		resolver: zodResolver(ChangePasswordSchema),
		defaultValues: {
			confirmPassword: "",
			currentPassword: "",
			password: "",
		},
	});

	const handleSubmit = async (values: ChangePasswordFormData) => {
		// Simulate API call
		try {
			// This would be your actual API call
			await updatePasswordAction({
				currentPassword: values.currentPassword,
				newPassword: values.confirmPassword,
				id: Number(user?.id),
			});

			form.reset();
			setShowModal(false);
			toast.success("Password updated successfully", {
				description: "Your password has been updated successfully.",
				richColors: true,
				position: "top-center",
			});
		} catch (err) {
			toast.error("Failed to update password", {
				description:
					err instanceof Error
						? err.message
						: "An unknown error occurred, Please contact the support.",
				richColors: true,
				position: "top-center",
			});
		}
	};

	const handleShowPassword = () => setShowPassword((prev) => !prev);

	return (
		<Dialog modal open={showModal}>
			<DialogTrigger asChild onClick={() => setShowModal(true)}>
				<Button>Change Password</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-[425px]">
				<Form {...form}>
					<form onSubmit={form.handleSubmit(handleSubmit)}>
						<DialogHeader>
							<DialogTitle>Change Password</DialogTitle>
							<DialogDescription>
								Update your password to keep your account secure
							</DialogDescription>
						</DialogHeader>
						<div className="space-y-4 mb-5">
							<FormField
								control={form.control}
								name="currentPassword"
								render={({ field }) => (
									<FormItem className="space-y-2">
										<FormLabel>Current Password</FormLabel>
										<FormControl>
											<div className="relative">
												<Input
													type={showPassword ? "text" : "password"}
													readOnly={form.formState.isSubmitting}
													className="bg-white pr-8 dark:text-black  dark:selection:bg-black/15 "
													{...field}
												/>
												<Button
													onClick={handleShowPassword}
													type="button"
													className="absolute hover:bg-transparent right-0 top-0"
													size="icon"
													variant="ghost">
													{showPassword ? <Eye /> : <EyeOff />}
												</Button>
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
									<FormItem className="space-y-2">
										<FormLabel>New Password</FormLabel>
										<FormControl>
											<div className="relative">
												<Input
													type={showPassword ? "text" : "password"}
													readOnly={form.formState.isSubmitting}
													className="bg-white dark:text-black  dark:selection:bg-black/15 "
													{...field}
												/>
												<Button
													onClick={handleShowPassword}
													type="button"
													className="absolute hover:bg-transparent right-0 top-0"
													size="icon"
													variant="ghost">
													{showPassword ? <Eye /> : <EyeOff />}
												</Button>
											</div>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="confirmPassword"
								render={({ field }) => (
									<FormItem className="space-y-2">
										<FormLabel>Confirm New Password</FormLabel>
										<FormControl>
											<div className="relative">
												<Input
													type={showPassword ? "text" : "password"}
													readOnly={form.formState.isSubmitting}
													className="bg-white dark:text-black  dark:selection:bg-black/15 "
													{...field}
												/>
												<Button
													onClick={handleShowPassword}
													type="button"
													className="absolute hover:bg-transparent right-0 top-0"
													size="icon"
													variant="ghost">
													{showPassword ? <Eye /> : <EyeOff />}
												</Button>
											</div>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>
						<DialogFooter>
							<Button
								type="button"
								variant="destructive"
								disabled={form.formState.isSubmitting}
								onClick={() => setShowModal(false)}>
								Close
							</Button>
							<Button type="submit" disabled={form.formState.isSubmitting}>
								{form.formState.isSubmitting
									? "Updating..."
									: "Update Password"}
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}
