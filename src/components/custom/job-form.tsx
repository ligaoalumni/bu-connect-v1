"use client";

import { createJobAction, updateJobAction } from "@/actions";
import {
	Input,
	Form,
	FormControl,
	FormItem,
	FormLabel,
	FormMessage,
	FormField,
	Select,
	SelectTrigger,
	SelectValue,
	SelectContent,
	SelectGroup,
	SelectLabel,
	SelectItem,
	RichTextEditor,
	Button,
} from "@/components";
import { jobTypes } from "@/constant";
import { JobSchema } from "@/lib/definitions";
import { JobFormData } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Job, JobType } from "@prisma/client";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

interface JobFormProps {
	job?: Job;
}

export default function JobForm({ job }: JobFormProps) {
	const form = useForm<JobFormData>({
		resolver: zodResolver(JobSchema),
		defaultValues: {
			title: job?.title || "",
			companyName: job?.company || "",
			employmentType: job?.type || "",
			jobDescription: job?.description || "",
			jobTitle: job?.jobTitle || "",
			location: job?.location || "",
		},
	});

	const handleSubmit = async (values: JobFormData) => {
		try {
			const data = {
				company: values.companyName,
				description: values.jobDescription,
				location: values.location,
				type: values.employmentType as JobType,
				jobTitle: values.jobTitle,
				title: values.title,
			};
			if (job) {
				await updateJobAction(job.id, data);
			} else {
				await createJobAction(data);
			}

			toast.success(
				job ? "Job updated successfully" : "Job created successfully",
				{
					description: job
						? "Your job has been updated successfully"
						: "Your job has been created successfully",
					richColors: true,
					position: "top-center",
				}
			);
		} catch (error) {
			toast.error(job ? "Failed to update job" : "Failed to create job", {
				description:
					error instanceof Error
						? error.message
						: "Something went wrong, Please try again later",
				richColors: true,
				position: "top-center",
			});
		}
	};

	return (
		<Form {...form}>
			<form
				className="p-5 max-w-screen-lg md:p-10 shadow-lg space-y-5 rounded-lg mx-auto"
				onSubmit={form.handleSubmit(handleSubmit)}
				onReset={() => form.reset()}>
				<FormField
					control={form.control}
					name="title"
					render={({ field }) => (
						<FormItem className="col-span-3 md:col-span-1">
							<FormLabel>Title</FormLabel>
							<FormControl>
								<Input className="h-12 text-lg" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="jobTitle"
					render={({ field }) => (
						<FormItem className="col-span-3 md:col-span-1">
							<FormLabel>Job Title</FormLabel>
							<FormControl>
								<Input className="h-12 text-lg" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="companyName"
					render={({ field }) => (
						<FormItem className="col-span-3 md:col-span-1">
							<FormLabel>Company Name</FormLabel>
							<FormControl>
								<Input className="h-12 text-lg" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="employmentType"
					render={({ field }) => (
						<FormItem className="col-span-3 md:col-span-1">
							<FormLabel>Employment Type</FormLabel>
							<FormControl>
								<Select
									onValueChange={(value: string) => field.onChange(value)}
									value={field.value.toString()}>
									{/* Option to prompt user */}
									<SelectTrigger className="w-full h-12">
										<SelectValue placeholder="Select a year text-red-400" />
									</SelectTrigger>
									<SelectContent>
										<SelectGroup>
											<SelectLabel>Employment Type</SelectLabel>
											{jobTypes.map((job) => (
												<SelectItem
													value={job}
													key={job}
													className="capitalize">
													{job === "FULL_TIME"
														? "Full Time"
														: job.replace("_", "-").toLowerCase()}
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
					name="location"
					render={({ field }) => (
						<FormItem className="col-span-3 md:col-span-1">
							<FormLabel>Location</FormLabel>
							<FormControl>
								<Input className="h-12 text-lg" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="jobDescription"
					render={() => (
						<FormItem>
							<FormLabel>Job Description</FormLabel>
							<FormControl>
								<RichTextEditor
									editable
									handleValue={(editor) => {
										form.setValue(
											"jobDescription",
											JSON.stringify(editor.getJSON())
										);
										form.clearErrors("jobDescription");
									}}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<div className="flex justify-end gap-2">
					<Button
						disabled={form.formState.isSubmitting}
						className="min-w-[130px] text-lg"
						size="lg"
						type="submit">
						{form.formState.isSubmitting ? "Posting job..." : "Post Job"}
					</Button>
					<Button
						disabled={form.formState.isSubmitting}
						className="min-w-[130px] text-lg"
						size="lg"
						type="reset"
						variant="destructive">
						Reset
					</Button>
				</div>
			</form>
		</Form>
	);
}
