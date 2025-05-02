"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { X, Edit2, Check, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { createPollAction, updatePollAction } from "@/actions";
import { useRouter } from "next/navigation";

// Define enum to match Prisma schema
const PollStatus = z.enum(["OPEN", "CLOSED"]);
type PollStatus = z.infer<typeof PollStatus>;

// Option schema to match the Option model
const optionSchema = z.object({
	id: z.number().optional(), // Optional for new options
	content: z.string().min(1, "Option content is required"),
});

// Poll form schema to match the Poll model
const formSchema = z.object({
	id: z.number().optional(), // Optional for new polls
	question: z.string().min(1, {
		message: "Question is required.",
	}),
	status: PollStatus.optional().default("OPEN"),
	options: z
		.array(optionSchema)
		.min(2, {
			message: "At least two options are required.",
		})
		.max(5, {
			message: "Maximum of 5 options allowed.",
		}),
});

// Type for the structured data that matches the database schema
export type PollFormStructured = z.infer<typeof formSchema>;

interface PollFormProps {
	poll?: {
		id: number;
		question: string;
		options?: { id: number; content: string }[];
	};
	isEditing?: boolean;
}

export function PollForm({ poll, isEditing = false }: PollFormProps) {
	const [optionInput, setOptionInput] = useState("");
	const [editingOptionIndex, setEditingOptionIndex] = useState<number | null>(
		null
	);
	const router = useRouter();
	const [editingOptionValue, setEditingOptionValue] = useState("");

	const form = useForm<PollFormStructured>({
		resolver: zodResolver(formSchema),
		defaultValues: isEditing
			? {
					question: poll?.question || "",
					options:
						poll?.options?.map((opt) => ({
							content: opt.content,
							id: opt.id,
						})) || [],
			  }
			: {
					question: "",
					status: "OPEN",
					options: [],
			  },
	});

	// Update form values when poll changes
	useEffect(() => {
		if (poll) {
			form.reset(poll);
		}
	}, [form, poll]);

	const options = form.watch("options");
	const maxOptionsReached = options.length >= 5;

	async function handleSubmit(values: PollFormStructured) {
		try {
			let pollId = 0;

			if (isEditing && values.id) {
				// Edit the existing poll
				// await updatePollAction(structuredData);
				console.log("Updating poll with data:", values);

				await updatePollAction(values.id, {
					options: values.options.map((opt) => ({
						content: opt.content,
						id: Number(opt.id),
					})),
					question: values.question,
				});

				pollId = values.id;
			} else {
				// Create a new poll
				const poll = await createPollAction({
					options: values.options.map((option) => option.content),
					question: values.question,
				});

				pollId = poll.id;
			}

			router.push(`/admin/polls/${pollId}`);
			toast.success("Poll saved successfully!", {
				richColors: true,
				position: "top-center",
				duration: 5000,
				description: isEditing
					? "Poll updated successfully."
					: "Poll created successfully.",
			});
		} catch {
			toast.error("An error occurred while saving the poll.", {
				description: isEditing
					? "Failed to update poll."
					: "Failed to create poll.",
				richColors: true,
				position: "top-center",
			});
		}
	}

	function addOption() {
		if (optionInput.trim() && !maxOptionsReached) {
			const currentOptions = form.getValues("options");

			const newOption = {
				content: optionInput.trim(),
				id: isEditing ? -1 : currentOptions.length + 1, // Use timestamp as temporary ID for new options
			};

			form.setValue("options", [...currentOptions, newOption]);
			setOptionInput("");
		}
	}

	function removeOption(index: number) {
		const currentOptions = form.getValues("options");
		const newOptions = [...currentOptions];
		newOptions.splice(index, 1);
		form.setValue("options", newOptions);
	}

	function startEditingOption(index: number) {
		setEditingOptionIndex(index);
		setEditingOptionValue(options[index].content);
	}

	function saveEditedOption() {
		if (editingOptionIndex !== null && editingOptionValue.trim()) {
			const currentOptions = [...options];
			currentOptions[editingOptionIndex] = {
				...currentOptions[editingOptionIndex],
				content: editingOptionValue.trim(),
			};
			form.setValue("options", currentOptions);
			cancelEditingOption();
		}
	}

	function cancelEditingOption() {
		setEditingOptionIndex(null);
		setEditingOptionValue("");
	}

	function handleKeyDown(e: React.KeyboardEvent) {
		if (e.key === "Enter") {
			e.preventDefault();
			saveEditedOption();
		} else if (e.key === "Escape") {
			cancelEditingOption();
		}
	}

	return (
		<Card className="md:min-w-[30dvw]">
			<CardHeader>
				<CardTitle>{!isEditing ? "Create a Poll" : "Edit Poll"}</CardTitle>
			</CardHeader>
			<CardContent>
				<Form {...form}>
					<form
						onReset={() => form.reset()}
						onSubmit={form.handleSubmit(handleSubmit)}
						className="space-y-6">
						<FormField
							control={form.control}
							name="question"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Question</FormLabel>
									<FormControl>
										<Input placeholder="Enter your question" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="options"
							render={() => (
								<FormItem>
									<FormLabel>Options</FormLabel>
									<div className="space-y-4">
										<div className="flex space-x-2">
											<Input
												placeholder="Enter an option"
												value={optionInput}
												onChange={(e) => setOptionInput(e.target.value)}
												disabled={maxOptionsReached}
												readOnly={form.formState.isSubmitting}
											/>
											<Button
												type="button"
												onClick={addOption}
												disabled={
													!optionInput.trim() ||
													maxOptionsReached ||
													form.formState.isSubmitting
												}>
												Add
											</Button>
										</div>
										{maxOptionsReached && (
											<p className="text-xs text-amber-500">
												Maximum of 5 options reached
											</p>
										)}

										<div className="space-y-2 mt-2">
											{options.map((option, index) => (
												<div
													key={index}
													className="flex items-center justify-between p-2 bg-muted rounded-md">
													{editingOptionIndex === index ? (
														<div className="flex-1 flex items-center space-x-2">
															<Input
																value={editingOptionValue}
																onChange={(e) =>
																	setEditingOptionValue(e.target.value)
																}
																onKeyDown={handleKeyDown}
																autoFocus
																className="flex-1"
															/>
															<div className="flex space-x-1">
																<Button
																	type="button"
																	variant="ghost"
																	size="sm"
																	onClick={saveEditedOption}
																	disabled={!editingOptionValue.trim()}
																	className="h-8 w-8 p-0">
																	<Check className="h-4 w-4" />
																	<span className="sr-only">Save</span>
																</Button>
																<Button
																	type="button"
																	variant="ghost"
																	size="sm"
																	onClick={cancelEditingOption}
																	className="h-8 w-8 p-0">
																	<X className="h-4 w-4" />
																	<span className="sr-only">Cancel</span>
																</Button>
															</div>
														</div>
													) : (
														<>
															<span className="flex-1">{option.content}</span>

															{!form.formState.isSubmitting && (
																<div className="flex space-x-1">
																	<Button
																		type="button"
																		variant="ghost"
																		size="sm"
																		onClick={() => startEditingOption(index)}
																		className="h-8 w-8 p-0">
																		<Edit2 className="h-4 w-4" />
																		<span className="sr-only">Edit option</span>
																	</Button>
																	<Button
																		type="button"
																		variant="ghost"
																		size="sm"
																		onClick={() => removeOption(index)}
																		className="h-8 w-8 p-0">
																		<Trash2 className="h-4 w-4" />
																		<span className="sr-only">
																			Remove option
																		</span>
																	</Button>
																</div>
															)}
														</>
													)}
												</div>
											))}
										</div>
										<FormMessage />
									</div>
								</FormItem>
							)}
						/>

						<Button
							type="submit"
							className="w-full"
							disabled={form.formState.isSubmitting}>
							{form.formState.isSubmitting
								? isEditing
									? "Updating..."
									: "Creating..."
								: !isEditing
								? "Create Poll"
								: "Update Poll"}
						</Button>
					</form>
				</Form>
			</CardContent>
		</Card>
	);
}
