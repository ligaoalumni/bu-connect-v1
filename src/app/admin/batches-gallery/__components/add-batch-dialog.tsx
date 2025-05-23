"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { createBatchAction, readUsersAction } from "@/actions";
import { toast } from "sonner";
import { Dispatch, SetStateAction } from "react";
import { Batch } from "@/types";

const formSchema = z.object({
	batch: z.preprocess(
		(val) => {
			if (typeof val === "string") {
				return parseInt(val, 10);
			}
			return val;
		},
		z
			.number()
			.int()
			.min(1980, {
				message: "Batch year is invalid.",
			})
			.max(new Date().getFullYear(), {
				message: "Batch year is invalid.",
			})
	),
});

interface AddBatchDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	setBatches: Dispatch<SetStateAction<Batch[]>>;
}

export function AddBatchDialog({
	open,
	onOpenChange,
	setBatches,
}: AddBatchDialogProps) {
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			batch: undefined,
		},
	});

	async function onSubmit(values: z.infer<typeof formSchema>) {
		// In a real app, you would send this data to your API

		try {
			const batch = await createBatchAction(values.batch);
			const users = await readUsersAction({ batch: batch.batch });

			setBatches((prev) => [
				...prev,
				{
					...batch,
					students: users.count,
				},
			]);

			toast.success("Batch created successfully!", {
				description: `Batch ${values.batch} has been created.`,
				richColors: true,
				position: "top-center",
			});
			form.reset();
			onOpenChange(false);
		} catch (error) {
			toast.error("Failed to create batch. Please try again.", {
				description:
					error instanceof Error ? error.message : "Something went wrong",
				richColors: true,
				position: "top-center",
			});
		}
	}

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>Add New Batch</DialogTitle>
					<DialogDescription>
						Create a new batch by entering the batch number and student count.
					</DialogDescription>
				</DialogHeader>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
						<FormField
							control={form.control}
							name="batch"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Batch Number</FormLabel>
									<FormControl>
										<Input
											readOnly={form.formState.isSubmitting}
											type="number"
											placeholder="Enter batch number"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<DialogFooter>
							<Button type="submit">
								{form.formState.isSubmitting
									? "Creating batch..."
									: "Create Batch"}
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}
