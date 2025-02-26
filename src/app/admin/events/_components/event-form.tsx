"use client";

import { createEventAction, updateEventAction } from "@/actions";
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
import { EventFormData, EventFormProps } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export default function EventForm({
	edit = false,
	event,
	events,
}: EventFormProps) {
	const router = useRouter();
	const form = useForm<EventFormData>({
		resolver: zodResolver(EventFormSchema),
		defaultValues: {
			content: event?.content || "",
			coverImg: event?.coverImg || "",
			location: event?.location || "",
			name: event?.name || "",
			startTime: new Date((event?.startTime || new Date()).setMinutes(0, 0, 0)),
			endTime: new Date((event?.endTime || new Date()).setMinutes(0, 0, 0)),
			startDate: event?.startDate || undefined,
			endDate: event?.endDate || undefined,
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
			let slug = "";
			if (edit) {
				const updatedEvent = await updateEventAction(
					values,
					event?.id as number
				);
				slug = updatedEvent.slug;
			} else {
				const newEvent = await createEventAction(values);
				slug = newEvent.slug;
			}

			toast.success("Success", {
				description: `Event ${edit ? "updated" : "created"} successfully`,
				position: "top-center",
				richColors: true,
				duration: 5000,
			});

			router.push(`/events/${slug}/info`);
		} catch (error) {
			toast.error(`Failed to ${edit ? "update" : "create"} event`, {
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
				<div className="flex items-center justify-between">
					<h1 className="text-2xl md:text-3xl font-medium ">
						{edit ? "Edit" : "Create New"} Event
					</h1>
					<div className="flex gap-2">
						{edit && (
							<Link href={`/admin/events/${event?.slug}/info`}>
								<Button variant="destructive">Cancel</Button>
							</Link>
						)}
						<Button
							className="min-w-[200px]"
							disabled={form.formState.isSubmitting}>
							{form.formState.isSubmitting ? (
								<Loader2 className="animate-spin" />
							) : edit ? (
								"Update Event"
							) : (
								"Create Event"
							)}
						</Button>
					</div>
				</div>
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
											content={edit ? event?.content : undefined}
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
											events={events}
											fromDefault={edit ? event?.startDate : undefined}
											toDefault={edit ? event?.endDate || undefined : undefined}
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
					</div>
				</div>
			</form>
		</Form>
	);
}
