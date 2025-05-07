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
import { createBatchAction } from "@/actions";
import { toast } from "sonner";

const formSchema = z.object({
	batch: z.preprocess(
		(val) => {
			if (typeof val === "string") {
				// Ensure the input has exactly 4 digits
				if (val.length !== 4) return NaN;
				return parseInt(val, 10);
			}
			return val;
		},
		z
			.number()
			.int()
			.min(1980, {
				message: "Batch number must be exactly 4 digits.",
			})
			.max(new Date().getFullYear(), {
				message: "Batch number must be exactly 4 digits.",
			})
	),
});

interface AddBatchDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

export function AddBatchDialog({ open, onOpenChange }: AddBatchDialogProps) {
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			batch: undefined,
		},
	});

	async function onSubmit(values: z.infer<typeof formSchema>) {
		// In a real app, you would send this data to your API

		try {
			await createBatchAction(values.batch);

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
							<Button type="submit">Create Batch</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}
