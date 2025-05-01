"use client";

import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { X } from "lucide-react";

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

const formSchema = z.object({
	id: z.string().optional(),
	question: z.string().min(1, {
		message: "Question is required.",
	}),
	options: z.array(z.string()).min(1, {
		message: "At least one option is required.",
	}),
});

export type PollFormValues = z.infer<typeof formSchema>;

interface PollFormProps {
	initialData?: PollFormValues;
	isEditing?: boolean;
}

export function PollForm({ initialData, isEditing = false }: PollFormProps) {
	const [optionInput, setOptionInput] = useState("");

	const form = useForm<PollFormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: initialData || {
			question: "",
			options: [],
		},
	});

	// Update form values when initialData changes (useful when switching between polls to edit)
	useEffect(() => {
		if (initialData) {
			form.reset(initialData);
		}
	}, [form, initialData]);

	const options = form.watch("options");
	const maxOptionsReached = options.length >= 5;

	function handleSubmit(values: PollFormValues) {
		try {
			//
			if (isEditing) {
				// Edit the existing poll
			} else {
				// Create a new poll
			}

			console.log(values, "qqqqq");

			toast.success("Poll saved successfully!", {
				richColors: true,
				position: "top-center",
				duration: 5000,
				description: isEditing
					? "Poll updated successfully."
					: "Poll created successfully.",
			});
		} catch {
			//
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
			form.setValue("options", [...currentOptions, optionInput.trim()]);
			setOptionInput("");
		}
	}

	function removeOption(index: number) {
		const currentOptions = form.getValues("options");
		const newOptions = [...currentOptions];
		newOptions.splice(index, 1);
		form.setValue("options", newOptions);
	}

	return (
		<Card className=" md:min-w-[30dvw]   ">
			<CardHeader>
				<CardTitle>{!isEditing ? "Create a Poll" : "Edit Poll"}</CardTitle>
			</CardHeader>
			<CardContent>
				<Form {...form}>
					<form
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
											/>
											<Button
												type="button"
												onClick={addOption}
												disabled={!optionInput.trim() || maxOptionsReached}>
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
													<span>{option}</span>
													<Button
														type="button"
														variant="ghost"
														size="sm"
														onClick={() => removeOption(index)}
														className="h-8 w-8 p-0">
														<X className="h-4 w-4" />
														<span className="sr-only">Remove option</span>
													</Button>
												</div>
											))}
										</div>
										<FormMessage />
									</div>
								</FormItem>
							)}
						/>

						<Button type="submit" className="w-full">
							{!isEditing ? "Create Poll" : "Update Poll"}
						</Button>
					</form>
				</Form>
			</CardContent>
		</Card>
	);
}
