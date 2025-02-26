"use client";

import { useCallback, useState } from "react";
import { ImagePlus, Loader2, X } from "lucide-react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import Image from "next/image";
import { uploadImageAction } from "@/actions";

export function ImageUpload({
	handleValueChange,
	defaultValue,
}: {
	handleValueChange: (value: string) => void;
	defaultValue?: string;
}) {
	const [preview, setPreview] = useState<string | null>(defaultValue || null);
	const [loading, setLoading] = useState(false);

	const onDrop = useCallback(
		async (acceptedFiles: File[]) => {
			const file = acceptedFiles[0];
			try {
				setLoading(true);
				if (file) {
					if (file.type.startsWith("image/")) {
						const img = await uploadImageAction(file);
						if (!img) {
							throw new Error("Failed to upload image");
						}
						console.log(img, "qqq");

						setPreview(img);
						handleValueChange(img);

						toast.success("Success", {
							richColors: true,
							description: "Image uploaded successfully",
							position: "top-center",
							duration: 5000,
						});
					} else {
						throw new Error("Invalid file type");
					}
				}
			} catch (error) {
				toast.error("Error uploading file", {
					richColors: true,
					description: (error as Error).message || "Please try again",
					position: "top-center",
				});
			} finally {
				setLoading(false);
			}
		},
		[handleValueChange]
	);

	const { getRootProps, getInputProps, isDragActive } = useDropzone({
		onDrop,
		accept: {
			"image/*": [".png", ".jpg", ".jpeg", ".gif"],
		},
		maxFiles: 1,
	});

	const handleRemove = () => {
		setPreview(null);
	};

	return (
		<Card className="w-full min-h-[200px]  lg:min-h-[300px]">
			<CardContent className="pt-6">
				<div
					{...getRootProps()}
					className={`relative flex min-h-[200px] dark:bg-zinc-800 lg:min-h-[300px] w-full cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed p-6 text-center ${
						isDragActive
							? "border-primary bg-muted/50"
							: "border-muted-foreground/25"
					}`}>
					<input {...getInputProps()} />
					{loading ? (
						<Loader2 className="absolute  z-50  h-8 w-8 animate-spin" />
					) : preview ? (
						<>
							<Image
								src={preview}
								alt="Preview"
								fill
								className={`w-full rounded  object-contain ${
									loading && "backdrop-blur-md opacity-50"
								}`}
							/>
							<Button
								size="icon"
								variant="destructive"
								disabled={loading}
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
				{/* {file && (
					<div className="mt-4">
						<Button onClick={() => {}} disabled={loading} className="w-full">
							{loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
							{loading ? "Uploading..." : "Upload"}
						</Button>
					</div>
				)} */}
			</CardContent>
		</Card>
	);
}
