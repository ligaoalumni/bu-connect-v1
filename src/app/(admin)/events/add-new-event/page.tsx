"use client";

import { createEventAction } from "@/actions";
import {
	Button,
	DatePickerWithRange,
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
	ImageUpload,
	Input,
	RichTextEditor,
	TimePicker,
} from "@/components";
import { EventFormSchema } from "@/lib/definitions";
import { EventFormData } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export default function CreateEventPage() {
	const router = useRouter();
	const form = useForm<EventFormData>({
		resolver: zodResolver(EventFormSchema),
		defaultValues: {
			content: "",
			coverImg: "",
			location: "",
			name: "",
			startTime: new Date(new Date().setMinutes(0, 0, 0)),
			endTime: new Date(new Date().setMinutes(0, 0, 0)),
			startDate: undefined,
			endDate: undefined,
		},
	});

	const handleCreateEvent = async (values: EventFormData) => {
		if (
			`{"type":"doc","content":[{"type":"paragraph"}]}` ===
			form.getValues("content")
		) {
			form.setError("content", {
				type: "manual",
				message: "Content is required",
			});
			return;
		}

		try {
			const event = await createEventAction(values);

			toast.success("Success", {
				description: "Event created successfully",
				position: "top-center",
				richColors: true,
				duration: 5000,
			});
			router.push(`/events/${event.slug}/info`);
		} catch (error) {
			toast.error("Failed to create event", {
				description: (error as Error).message,
				richColors: true,
				position: "top-center",
				duration: 5000,
			});
		}
	};

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(handleCreateEvent)}
				className="gap-2 flex flex-col">
				<h1 className="text-2xl md:text-3xl font-medium ">Create New Event</h1>
				<div className="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-5">
					<div className="md:col-span-6 space-y-4">
						<FormField
							control={form.control}
							name="name"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Event Name</FormLabel>
									<FormControl>
										<Input placeholder="" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="content"
							render={() => (
								<FormItem>
									<FormLabel>Content</FormLabel>
									<FormControl>
										<RichTextEditor
											editable
											handleValue={(editor) => {
												form.setValue(
													"content",
													JSON.stringify(editor.getJSON())
												);
												form.clearErrors("content");
											}}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>
					<div className="md:col-span-6  space-y-4">
						<FormField
							control={form.control}
							name="coverImg"
							render={() => (
								<FormItem className="w-full">
									<FormLabel>Event Name</FormLabel>
									<FormControl>
										<ImageUpload
											defaultValue={form.getValues().coverImg}
											handleValueChange={(img) =>
												form.setValue("coverImg", img)
											}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="startDate"
							render={() => (
								<FormItem className="w-full">
									<FormLabel>Date</FormLabel>
									<FormControl>
										<DatePickerWithRange
											handleValue={(value) => {
												if (value.from) {
													form.setValue("startDate", value.from);
													form.setValue("endDate", value?.to || value.from);
													form.clearErrors("startDate");
												}
											}}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<div className="flex flex-col gap-5 md:flex-row ">
							<FormField
								control={form.control}
								name="startTime"
								render={() => (
									<FormItem className="w-full">
										<FormLabel>Start Time</FormLabel>
										<FormControl>
											<TimePicker
												date={form.getValues("startTime")}
												setDate={(value) => {
													if (value) {
														form.setValue("startTime", value);
														form.clearErrors("startTime");
													}
												}}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="endTime"
								render={() => (
									<FormItem className="w-full">
										<FormLabel>End Time</FormLabel>
										<FormControl>
											<TimePicker
												date={form.getValues("endTime")}
												setDate={(value) => {
													if (value) {
														form.setValue("endTime", value);
														form.clearErrors("endTime");
													}
												}}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>

						<FormField
							control={form.control}
							name="location"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Location</FormLabel>
									<FormControl>
										<Input placeholder="" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<div className="flex items-center justify-end">
							<Button
								className="min-w-[200px]"
								disabled={form.formState.isSubmitting}>
								{form.formState.isSubmitting ? (
									<Loader2 className="animate-spin" />
								) : (
									"Create Event"
								)}
							</Button>
						</div>
					</div>
				</div>
			</form>
		</Form>
	);
}
