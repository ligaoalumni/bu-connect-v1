"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Trash2, Upload } from "lucide-react";
import Image from "next/image";
import {
	Button,
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
	Iconify,
	Input,
	Textarea,
} from "@/components";
import { cn } from "@/lib";
import { toast } from "sonner";
import {
	createPostAction,
	updatePostAction,
	uploadImageAction,
} from "@/actions";

// Define the form schema with Zod
const formSchema = z.object({
	title: z.string().min(1, {
		message: "Title is required",
	}),
	content: z.string().min(1, {
		message: "Content is required",
	}),
	images: z.array(z.string()).optional(),
});

// Define the form props
export type PostFormValues = z.infer<typeof formSchema>;

interface PostFormProps {
	post?: PostFormValues & {
		slug: string;
	};
	id?: number;
}

export function PostForm({ post }: PostFormProps) {
	const [imageUrls, setImageUrls] = useState<string[]>(post?.images || []);
	const [isUploading, setIsUploading] = useState(false);

	// Initialize the form with react-hook-form
	const form = useForm<PostFormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: post || {
			title: "",
			content: "",
			images: [],
		},
	});

	// Set up image URLs from initialData if provided
	useEffect(() => {
		if (post?.images && post.images.length > 0) {
			setImageUrls(post.images);
		}
	}, [post]);

	// Handle image upload
	const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files && e.target.files.length > 0) {
			try {
				setIsUploading(true);

				const newImageUrl = await uploadImageAction(
					e.target.files[0],
					"post-images"
				);

				if (!newImageUrl) throw new Error("Error uploading image!");

				setImageUrls((prev) => [...prev, newImageUrl]);
				const currentImages = form.getValues("images") || [];
				form.setValue("images", [...currentImages, newImageUrl], {
					shouldValidate: true,
					shouldDirty: true,
				});
			} catch (err) {
				//
				console.log(err);
				toast.error("Error uploading image", {
					description: "Please try again",
					position: "top-center",
					duration: 5000,
					richColors: true,
				});
			} finally {
				setIsUploading(false);
			}
		}
	};

	// Handle image removal
	const handleRemoveImage = (index: number) => {
		// Create new arrays without the removed image
		const newImageUrls = [...imageUrls];
		newImageUrls.splice(index, 1);
		setImageUrls(newImageUrls);

		// Update form value
		form.setValue("images", newImageUrls, {
			shouldValidate: true,
			shouldDirty: true,
		});
	};

	// Handle form submission
	const handleSubmit = async (data: PostFormValues) => {
		// In a real application, you would upload the images to a storage service
		// and replace the object URLs with the actual URLs before submitting

		try {
			const values = { ...data, images: data.images || [] };
			if (post) {
				await updatePostAction(post.slug, values);
			} else {
				await createPostAction(values);
			}

			toast.success(post ? "Post updated!" : "Post created!", {
				description: `Your post has been successfully  ${
					post ? "updated" : "created"
				}.`,
				position: "top-center",
				duration: 5000,
				richColors: true,
			});
		} catch (error) {
			toast.error("Something went wrong!", {
				description:
					error instanceof Error ? error.message : "Please try again",
				position: "top-center",
				duration: 5000,
				richColors: true,
			});
			console.error("Error submitting form:", error);
		}
	};

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
				<FormField
					control={form.control}
					name="title"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Title</FormLabel>
							<FormControl>
								<Input
									readOnly={form.formState.isSubmitting}
									placeholder="Enter post title"
									{...field}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="content"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Content</FormLabel>
							<FormControl>
								<Textarea
									placeholder="Write your post content here..."
									className="min-h-[200px]"
									readOnly={form.formState.isSubmitting}
									{...field}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="images"
					render={() => (
						<FormItem>
							<FormLabel>Images</FormLabel>
							<FormControl>
								<div className="space-y-4">
									<div className="overflow-x-auto flex gap-5">
										{imageUrls.length < 5 && (
											<label
												htmlFor="image-upload"
												className={cn(
													"flex aspect-square cursor-pointer flex-col items-center justify-center rounded-md border border-dashed",
													"hover:bg-muted/50 transition-colors",
													"full min-w-[200px]  min-h-[200px] md:min-w-[300px] md:min-h-[300px]"
												)}>
												{isUploading ? (
													<>
														<Iconify
															icon="line-md:uploading-loop"
															width="52"
															height="52"
															style={{ color: "#E8770B" }}
														/>
													</>
												) : (
													<>
														<Upload className="h-6 w-6 mb-2 text-muted-foreground" />
														<span className="text-sm text-muted-foreground">
															Upload
														</span>
													</>
												)}
												<Input
													readOnly={form.formState.isSubmitting || isUploading}
													id="image-upload"
													max={5}
													type="file"
													accept="image/*"
													multiple
													className="hidden"
													onChange={handleImageUpload}
												/>
											</label>
										)}
										{imageUrls.map((url, index) => (
											<div
												key={index}
												className="relative aspect-square  min-w-[200px]  min-h-[200px] md:min-w-[300px] md:min-h-[300px]  rounded-md overflow-hidden border">
												<Image
													src={url || ""}
													alt={`Image ${index + 1}`}
													fill
													className="object-cover"
												/>
												<Button
													type="button"
													variant="destructive"
													size="icon"
													className="absolute top-2 right-2 h-8 w-8 rounded-full"
													onClick={() => handleRemoveImage(index)}>
													<Trash2 className="h-4 w-4" />
												</Button>
											</div>
										))}
									</div>
									<FormDescription>
										Upload one or more images for your post
									</FormDescription>
								</div>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<Button
					type="submit"
					disabled={form.formState.isSubmitting}
					className="w-full sm:w-auto">
					{form.formState.isSubmitting
						? "Saving..."
						: post
						? "Update Post"
						: "Create Post"}
				</Button>
			</form>
		</Form>
	);
}
