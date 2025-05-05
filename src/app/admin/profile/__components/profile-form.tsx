"use client";

import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { AdminProfileFormData } from "@/types";
import { AdminProfileSchema } from "@/lib/definitions";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
	FormControl,
	FormField,
	FormItem,
	FormMessage,
	Input,
	Form,
	FormLabel,
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue,
	Button,
} from "@/components";
import { alumniLabel } from "@/constant";
import AvatarUpload from "@/components/custom/avatar-upload";
import { updateProfileActions } from "@/actions";
import { Gender } from "@prisma/client";

interface ProfileFormProps {
	id: number;
	firstName: string;
	middleName: string;
	lastName: string;
	birthDate: string;
	gender: string;
	address: string;
	contactNumber: string;
	nationality: string;
	religion: string;
	avatar: string;
}

export default function ProfileForm(user: ProfileFormProps) {
	const router = useRouter();
	const defaultValues = {
		firstName: user.firstName,
		lastName: user.lastName,
		middleName: user.middleName,
		birthDate: user.birthDate,
		contactNumber: user.contactNumber,
		religion: user.religion,
		nationality: user.nationality,
		address: user.address,
		avatar: user.avatar,
		gender: user.gender,
	};

	const form = useForm<AdminProfileFormData>({
		resolver: zodResolver(AdminProfileSchema),
		defaultValues,
	});

	const Actions = () => (
		<div className="flex gap-2 justify-end">
			<Button
				type="reset"
				variant="destructive"
				// onClick={() => form.reset(defaultValues)}>
			>
				Reset
			</Button>
			<Button type="submit" variant="secondary">
				{form.formState.isSubmitting ? "Saving..." : "Save"}
			</Button>
		</div>
	);

	const handleUpdateProfile = async (values: AdminProfileFormData) => {
		try {
			await updateProfileActions(user.id, {
				...values,
				gender: values.gender as Gender,
			});

			toast.success("Profile updated successfully", {
				richColors: true,
				description: "Your profile has been updated successfully",
				position: "top-center",
			});
			router.push("/admin/profile");
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Error uploading file", {
				richColors: true,
				description: "Please try again",
				position: "top-center",
			});
		}
	};

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(handleUpdateProfile)}
				onReset={() => form.reset()}>
				<div className="rounded-3xl space-y-5 px-5 bg-[#2F61A0] py-10 dark:bg-[#5473a8]">
					<div className="flex items-center justify-between">
						<div className="flex gap-1">
							<Button asChild size="icon" variant="ghost">
								<Link href="/profile" className="text-white">
									<ArrowLeft className="" />
								</Link>
							</Button>
							<h1 className="text-2xl text-white">Edit Profile</h1>
						</div>
						<Actions />
					</div>

					<AvatarUpload
						avatarFallback={`${user.firstName[0]}${user.lastName[0]}`}
						isDisabled={form.formState.isSubmitting}
						handleSetValue={(value) => {
							form.setValue("avatar", value || "");
						}}
						avatarImage={form.getValues("avatar")}
					/>

					<Card className="bg-transparent text-white">
						<CardHeader className="px-5 pb-2 pt-5 font-medium">
							<CardTitle>Personal Information</CardTitle>
						</CardHeader>
						<CardContent className="px-5 pt-2 pb-4 grid grid-cols-1 gap-3  md:grid-cols-3  md:col-span-2">
							<FormField
								control={form.control}
								name="firstName"
								render={({ field }) => (
									<FormItem>
										<FormLabel>First Name</FormLabel>
										<FormControl>
											<Input
												readOnly={form.formState.isSubmitting}
												className="  dark:text-white  dark:selection:bg-black/15 border-x-0 border-t-0 border-b-2 h-10 rounded-none"
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
										<FormLabel>Middle Name</FormLabel>
										<FormControl>
											<Input
												readOnly={form.formState.isSubmitting}
												className="  dark:text-white  dark:selection:bg-black/15 border-x-0 border-t-0 border-b-2 h-10 rounded-none"
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
												className="  dark:text-white  dark:selection:bg-black/15 border-x-0 border-t-0 border-b-2 h-10 rounded-none"
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
										<FormLabel>Birth Date</FormLabel>
										<FormControl>
											<Input
												type="date"
												readOnly={form.formState.isSubmitting}
												className="  dark:text-white  dark:selection:bg-black/15 border-x-0 border-t-0 border-b-2 h-10 rounded-none"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="gender"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Gender</FormLabel>
										<FormControl>
											<Select
												value={field.value}
												onValueChange={field.onChange}>
												<SelectTrigger className="text-white data-[placeholder]:text-white/80 first-letter:uppercase">
													<SelectValue
														placeholder="Select gender"
														className="text-white  "
													/>
												</SelectTrigger>
												<SelectContent className="bg-[#2F61A0] shadow-lg border-none dark:bg-[#5473a8]">
													<SelectGroup>
														<SelectLabel className="text-white">
															Gender
														</SelectLabel>
														{Object.keys(alumniLabel).map((item) => (
															<SelectItem
																key={item}
																value={item}
																className="first-letter:capitalize text-white">
																{item.replaceAll(/_/g, " ").toLowerCase()}
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
								name="address"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Address</FormLabel>
										<FormControl>
											<Input
												readOnly={form.formState.isSubmitting}
												className="  dark:text-white  dark:selection:bg-black/15 border-x-0 border-t-0 border-b-2 h-10 rounded-none"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="contactNumber"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Contact Number</FormLabel>
										<FormControl>
											<Input
												readOnly={form.formState.isSubmitting}
												className="  dark:text-white  dark:selection:bg-black/15 border-x-0 border-t-0 border-b-2 h-10 rounded-none"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="nationality"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Nationality</FormLabel>
										<FormControl>
											<Input
												readOnly={form.formState.isSubmitting}
												className="  dark:text-white  dark:selection:bg-black/15 border-x-0 border-t-0 border-b-2 h-10 rounded-none"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="religion"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Religion</FormLabel>
										<FormControl>
											<Input
												readOnly={form.formState.isSubmitting}
												className="  dark:text-white  dark:selection:bg-black/15 border-x-0 border-t-0 border-b-2 h-10 rounded-none"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							{/* <AlumniData label="Contact Number" data={alumni.user./} /> */}
						</CardContent>
					</Card>

					<Actions />
				</div>
			</form>
		</Form>
	);
}
