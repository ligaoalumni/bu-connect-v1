"use client";

import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import {
	Button,
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
	Input,
	Tabs,
	TabsContent,
	TabsList,
	TabsTrigger,
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
	Select,
	SelectTrigger,
	SelectValue,
	SelectContent,
	SelectGroup,
	SelectLabel,
	SelectItem,
} from "@/components";
import { Users } from "lucide-react";
import CSVUploader from "@/app/admin/_components/csv-uploader";
import { AlumniSchema } from "@/lib/definitions";
import { AlumniFormData } from "@/types";
import { addAlumniData } from "@/actions";

// Define the form's type
const currentYear = new Date().getFullYear(); // Get the current year
const years = Array.from({ length: 50 }, (_, i) => currentYear - i); // Create a range of years for the last 50 years

export default function StudentDataUpload() {
	const [activeTab, setActiveTab] = useState("single");
	const [isSaving, setIsSaving] = useState(false);

	// Initialize the form
	const form = useForm<AlumniFormData>({
		resolver: zodResolver(AlumniSchema),
		defaultValues: {
			studentId: "",
			firstName: "",
			lastName: "",
			middleName: "",
			birthDate: "",
			graduationYear: new Date().getFullYear(),
			lrn: "",
		},
	});

	// Handle single student form submission
	const onSubmit = async (data: AlumniFormData) => {
		setIsSaving(true);

		try {
			// For demo purposes, simulate an API call
			const student = await addAlumniData({
				...data,
				middleName: data.middleName || "",
				birthDate: new Date(data.birthDate),
			});

			// Show success message with Sonner toast
			toast.success("Student Added", {
				description: `Successfully added ${data.firstName} ${data.lastName}`,
				richColors: true,
				position: "top-center",
			});

			console.log(student, "qq");

			// Reset form
			form.reset({
				studentId: "",
				firstName: "",
				lastName: "",
				middleName: "",
				birthDate: "",
				graduationYear: new Date().getFullYear(),
				lrn: "",
			});
		} catch (error) {
			toast.error("Error", {
				description:
					error instanceof Error ? error.message : "Failed to save student",
				richColors: true,
				position: "top-center",
			});
		} finally {
			setIsSaving(false);
		}
	};

	return (
		<Tabs value={activeTab} onValueChange={setActiveTab} className="w-full  ">
			<TabsList className="grid w-full grid-cols-2">
				<TabsTrigger value="single" disabled={isSaving}>
					Single Student
				</TabsTrigger>
				<TabsTrigger value="batch" disabled={isSaving}>
					Batch Upload
				</TabsTrigger>
			</TabsList>

			<TabsContent value="single">
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<Users className="h-5 w-5" />
							Add Student
						</CardTitle>
						<CardDescription>
							Enter student information to add a single student to the system.
						</CardDescription>
					</CardHeader>
					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)}>
							<CardContent className="space-y-4">
								<div className="grid grid-cols-2 gap-4">
									<FormField
										control={form.control}
										name="studentId"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Student ID</FormLabel>
												<FormControl>
													<Input className="h-12 text-lg" {...field} />
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
												<FormLabel>LRN (12 digits)</FormLabel>
												<FormControl>
													<Input className="h-12 text-lg" {...field} />
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
								</div>

								<div className="grid grid-cols-3 gap-4">
									<FormField
										control={form.control}
										name="firstName"
										render={({ field }) => (
											<FormItem>
												<FormLabel>First Name</FormLabel>
												<FormControl>
													<Input className="h-12 text-lg" {...field} />
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
													<Input className="h-12 text-lg" {...field} />
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
													<Input className="h-12 text-lg" {...field} />
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
								</div>

								<div className="grid grid-cols-2 gap-4">
									<FormField
										control={form.control}
										name="birthDate"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Birth Date</FormLabel>
												<FormControl>
													<Input
														className="h-12 text-lg"
														type="date"
														{...field}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>

									<FormField
										control={form.control}
										name="graduationYear"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Graduation Year</FormLabel>
												<FormControl>
													<Select
														onValueChange={(value: string) =>
															field.onChange(Number(value))
														}
														value={field.value.toString()}>
														{/* Option to prompt user */}
														<SelectTrigger className="w-full h-12">
															<SelectValue placeholder="Select a year" />
														</SelectTrigger>
														<SelectContent>
															<SelectGroup>
																<SelectLabel>Year</SelectLabel>
																{years.map((year) => (
																	<SelectItem
																		value={year.toString()}
																		key={year}>
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
								</div>
							</CardContent>
							<CardFooter>
								<Button type="submit" disabled={isSaving} className="w-full">
									{isSaving ? "Saving..." : "Save Student"}
								</Button>
							</CardFooter>
						</form>
					</Form>
				</Card>
			</TabsContent>

			<TabsContent
				value="batch"
				className=" flex items-center justify-center min-h-[calc(100dvh-40dvh)] md:min-h-[600px]">
				<CSVUploader />
			</TabsContent>
		</Tabs>
	);
}
