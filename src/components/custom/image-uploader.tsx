"use client";

import { useCallback, useState } from "react";
import { ImagePlus, Loader2, X } from "lucide-react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import Image from "next/image";

export function ImageUpload() {
	const [file, setFile] = useState<File | null>(null);
	const [preview, setPreview] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);

	const onDrop = useCallback((acceptedFiles: File[]) => {
		const file = acceptedFiles[0];
		if (file) {
			if (file.type.startsWith("image/")) {
				setFile(file);
				const reader = new FileReader();
				reader.onloadend = () => {
					setPreview(reader.result as string);
				};
				reader.readAsDataURL(file);
			} else {
				toast.error("Invalid file type", {
					richColors: true,
					description: "Please upload an image file",
					position: "top-center",
				});
			}
		}
	}, []);

	const { getRootProps, getInputProps, isDragActive } = useDropzone({
		onDrop,
		accept: {
			"image/*": [".png", ".jpg", ".jpeg", ".gif"],
		},
		maxFiles: 1,
	});

	const handleUpload = async () => {
		if (!file) return;

		setLoading(true);
		try {
			// Simulate upload delay
			await new Promise((resolve) => setTimeout(resolve, 2000));

			// Here you would typically upload the file to your server
			// const formData = new FormData()
			// formData.append("file", file)
			// await fetch("/api/upload", { method: "POST", body: formData })

			toast.success("Success", {
				richColors: true,
				description: "Image uploaded successfully",
				position: "top-center",
			});
			// Reset the form
			setFile(null);
			setPreview(null);
		} catch (error) {
			console.error(error);
			toast.error("Error", {
				richColors: true,
				description: "Failed to upload image",
				position: "top-center",
			});
		} finally {
			setLoading(false);
		}
	};

	const handleRemove = () => {
		setFile(null);
		setPreview(null);
	};

	return (
		<Card className="w-full min-h-[200px] lg:min-h-[300px]">
			<CardContent className="pt-6">
				<div
					{...getRootProps()}
					className={`relative flex min-h-[200px] lg:min-h-[300px] w-full cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed p-6 text-center ${
						isDragActive
							? "border-primary bg-muted/50"
							: "border-muted-foreground/25"
					}`}>
					<input {...getInputProps()} />
					{preview ? (
						<>
							<Image
								src={preview}
								alt="Preview"
								fill
								className=" w-full rounded object-contain"
							/>
							<Button
								size="icon"
								variant="destructive"
								className="absolute -right-2 -top-2 h-6 w-6"
								onClick={(e) => {
									e.stopPropagation();
									handleRemove();
								}}>
								<X className="h-4 w-4" />
							</Button>
						</>
					) : (
						<div className="flex flex-col items-center gap-2">
							<ImagePlus className="h-8 w-8 text-muted-foreground" />
							<div className="text-xs">
								<span className="font-medium">Click to upload</span> or drag and
								drop
							</div>
							<div className="text-xs text-muted-foreground">
								PNG, JPG, GIF (max. 10MB)
							</div>
						</div>
					)}
				</div>
				{file && (
					<div className="mt-4">
						<Button
							onClick={handleUpload}
							disabled={loading}
							className="w-full">
							{loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
							{loading ? "Uploading..." : "Upload"}
						</Button>
					</div>
				)}
			</CardContent>
		</Card>
	);
}
