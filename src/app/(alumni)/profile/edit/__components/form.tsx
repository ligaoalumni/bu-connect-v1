"use client";

import { updateProfileActions } from "@/actions";
import { AlumniData } from "@/app/admin/alumni/__components";
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
	Alert,
	AlertTitle,
	AlertDescription,
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue,
	Button,
} from "@/components";
import AvatarUpload from "@/components/custom/avatar-upload";
import { alumniLabel } from "@/constant";
import { ProfileSchema } from "@/lib/definitions";
import { ProfileFormData } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircleIcon, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

interface EditProfileFormProps {
	user: {
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
	};
	postInfo: {
		furtherEducation: string;
		course: string;
		company: string;
		schoolName: string;
		occupation: string;
		jobTitle: string;
	};
	alumniSystemRecord: {
		lrn: string;
		batch: string;
		educationLevel: string;
		strand: string;
	};
}

export default function EditProfileForm({
	alumniSystemRecord,
	user,
	postInfo,
}: EditProfileFormProps) {
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

		company: postInfo.company,
		course: postInfo.course,
		furtherEducation: postInfo.furtherEducation,
		schoolName: postInfo.schoolName,
		jobTitle: postInfo.jobTitle,
		occupation: postInfo.occupation,
	};

	const form = useForm<ProfileFormData>({
		resolver: zodResolver(ProfileSchema),
		defaultValues,
	});

	const handleSignUp = async (values: ProfileFormData) => {
		try {
			await updateProfileActions(user.id, alumniSystemRecord.lrn, values);

			toast.success("Profile updated successfully", {
				richColors: true,
				description: "Your profile has been updated successfully",
				position: "top-center",
			});
			router.push("/profile");
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Error uploading file", {
				richColors: true,
				description: "Please try again",
				position: "top-center",
			});
		}
	};

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

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(handleSignUp)}
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

					<Card className="bg-transparent text-white">
						<Alert variant="warning" className="rounded-b-none border-none">
							<AlertCircleIcon className="h-4 w-4" />
							<AlertTitle>Important Notice</AlertTitle>
							<AlertDescription>
								Academic information cannot be edited as these records are saved
								in the system.
							</AlertDescription>
						</Alert>
						<CardHeader className="px-5 pb-2 pt-5 font-medium">
							<CardTitle>Academic Information</CardTitle>
						</CardHeader>
						<CardContent className="px-5 pt-2 pb-4 grid grid-cols-2 gap-3 sms:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
							<AlumniData label="LRN" data={alumniSystemRecord.lrn} />
							<AlumniData label="Batch" data={alumniSystemRecord.batch} />
							<AlumniData
								label="Education Level"
								data={alumniSystemRecord.educationLevel}
							/>
							<AlumniData label="Strand" data={alumniSystemRecord.strand} />
						</CardContent>
					</Card>

					<Card className="bg-transparent text-white">
						<CardHeader className="px-5 pb-2 pt-5 font-medium">
							<CardTitle>Post - Graduation Information</CardTitle>
						</CardHeader>
						<CardContent className="px-5 pt-2 pb-4 grid grid-cols-1 gap-3  md:grid-cols-3  md:col-span-2">
							<FormField
								control={form.control}
								name="occupation"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Occupation</FormLabel>
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
								name="course"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Course</FormLabel>
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
								name="schoolName"
								render={({ field }) => (
									<FormItem>
										<FormLabel>School Name</FormLabel>
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
								name="furtherEducation"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Further Education</FormLabel>
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
								name="company"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Company</FormLabel>
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
								name="jobTitle"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Job title</FormLabel>
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
						</CardContent>
					</Card>

					<Actions />
				</div>
			</form>
		</Form>
	);
}
