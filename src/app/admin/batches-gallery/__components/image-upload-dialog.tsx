"use client";

import type React from "react";

import { useState } from "react";
import { Upload, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import Image from "next/image";
import { toast } from "sonner";
import { uploadBatchImagesAction, uploadImageAction } from "@/actions";
import { Iconify } from "@/components";

interface ImageUploadDialogProps {
	batchNumber: number;
	open: boolean;
	onOpenChange: (open: boolean) => void;
	handleUploadedImages: (imgs: string[]) => void;
}

export function ImageUploadDialog({
	batchNumber,
	open,
	onOpenChange,
	handleUploadedImages,
}: ImageUploadDialogProps) {
	const [files, setFiles] = useState<File[]>([]);
	const [isDragging, setIsDragging] = useState(false);
	const [isUploading, setIsUploading] = useState(false);

	const handleDragOver = (e: React.DragEvent) => {
		e.preventDefault();
		setIsDragging(true);
	};

	const handleDragLeave = () => {
		setIsDragging(false);
	};

	const handleDrop = (e: React.DragEvent) => {
		e.preventDefault();
		if (isUploading) return;
		setIsDragging(false);

		if (e.dataTransfer.files) {
			const newFiles = Array.from(e.dataTransfer.files).filter((file) =>
				file.type.startsWith("image/")
			);
			setFiles((prev) => [...prev, ...newFiles]);
		}
	};

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files) {
			const newFiles = Array.from(e.target.files);
			setFiles((prev) => [...prev, ...newFiles]);
		}
	};

	const removeFile = (index: number) => {
		setFiles(files.filter((_, i) => i !== index));
	};

	const handleSubmit = async () => {
		try {
			setIsUploading(true);

			const imgUrls = await Promise.all(
				files.map(async (file) => {
					return await uploadImageAction(file, "batches-gallery");
				})
			);

			const imgs = imgUrls.filter(
				(img): img is string => typeof img === "string"
			);
			const batch = await uploadBatchImagesAction(batchNumber, imgs);
			handleUploadedImages(batch.images);

			toast.success("Images uploaded successfully!", {
				description: `Batch ${batch.batch} has been updated with new images.`,
				richColors: true,
				position: "top-center",
			});
		} catch (error) {
			toast.error("Failed to upload images. Please try again.", {
				description:
					error instanceof Error ? error.message : "Something went wrong",
				richColors: true,
				position: "bottom-right",
			});
		} finally {
			setIsUploading(false);
		}

		setFiles([]);
		onOpenChange(false);
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-[500px]">
				<DialogHeader>
					<DialogTitle>Upload Images</DialogTitle>
					<DialogDescription>
						Upload images for Batch {batchNumber}. You can select multiple
						images.
					</DialogDescription>
				</DialogHeader>

				<div
					className={`mt-4 flex min-h-[200px] cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 transition-colors ${
						isDragging
							? "border-primary bg-primary/10"
							: "border-muted-foreground/25"
					}`}
					onDragOver={handleDragOver}
					onDragLeave={handleDragLeave}
					onDrop={handleDrop}
					onClick={() => document.getElementById("file-upload")?.click()}>
					<Upload className="mb-2 h-10 w-10 text-muted-foreground" />
					<p className="mb-1 text-sm font-medium">
						Drag and drop images here or click to browse
					</p>
					<p className="text-xs text-muted-foreground">
						Supported formats: JPG, PNG, GIF
					</p>
					<input
						readOnly={isUploading}
						id="file-upload"
						type="file"
						multiple
						accept="image/*"
						className="hidden"
						onChange={handleFileChange}
					/>
				</div>

				{files.length > 0 && (
					<div className="mt-4">
						<p className="mb-2 text-sm font-medium">
							Selected files ({files.length}):
						</p>
						<div className="max-h-[200px] overflow-y-auto rounded-lg border">
							{files.map((file, index) => (
								<div
									key={index}
									className="flex items-center justify-between border-b p-2 last:border-0">
									<div className="flex items-center space-x-2 truncate">
										<div className="h-10 w-10 shrink-0 overflow-hidden relative rounded-md bg-muted">
											<Image
												fill
												src={URL.createObjectURL(file)}
												alt={file.name}
												className="h-full w-full object-cover"
											/>
										</div>
										<div className="truncate">
											<p className="truncate text-sm">{file.name}</p>
											<p className="text-xs text-muted-foreground">
												{(file.size / 1024 / 1024).toFixed(2)} MB
											</p>
										</div>
									</div>
									<Button
										variant="ghost"
										size="icon"
										onClick={(e) => {
											e.stopPropagation();
											removeFile(index);
										}}>
										<X className="h-4 w-4" />
									</Button>
								</div>
							))}
						</div>
					</div>
				)}

				<DialogFooter className="mt-4">
					<Button
						disabled={isUploading}
						variant="outline"
						onClick={() => onOpenChange(false)}>
						Cancel
					</Button>
					<Button
						onClick={handleSubmit}
						disabled={files.length === 0 || isUploading}>
						{isUploading ? "Uploading..." : "Upload"}
						{isUploading && (
							<Iconify
								icon="line-md:uploading-loop"
								width="28"
								height="28"
								style={{ color: "#ffffff" }}
							/>
						)}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
