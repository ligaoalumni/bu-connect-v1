"use client";

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
import React from "react";
import { useForm } from "react-hook-form";

export default function CreateEventPage() {
	const form = useForm<EventFormData>({
		resolver: zodResolver(EventFormSchema),
		defaultValues: {
			content: "",
			coverImg: "",
			location: "",
			name: "",
			startDate: undefined,
			endDate: undefined,
		},
	});

	const handleCreateEvent = () => {};

	console.log(form.getValues(), "qq");

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
										<RichTextEditor editable handleValue={() => {}} />
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
										<ImageUpload />
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
							<Button>Create Event</Button>
						</div>
					</div>
				</div>
			</form>
		</Form>
	);
}
