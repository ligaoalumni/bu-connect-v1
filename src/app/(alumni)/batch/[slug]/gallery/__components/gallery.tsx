"use client";
import { ImageGalleryDialog } from "@/app/admin/batches-gallery/__components/image-gallery-upload";
import { ImageUploadDialog } from "@/app/admin/batches-gallery/__components/image-upload-dialog";
import { Button } from "@/components";

import { Batch } from "@/types";
import { ImagePlus, Users } from "lucide-react";
import Image from "next/image";
import React, { useState } from "react";

export default function BatchGallery({
	batch,
	userBatch,
}: {
	batch: Batch;
	userBatch: number;
}) {
	const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
	const [viewImageIndex, setViewImageIndex] = useState<number | null>(null);
	const [images, setImages] = useState<string[]>(batch.images);

	return (
		<div className="p-6">
			<div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
				<div>
					<h1 className="text-2xl font-bold">Batch {batch.batch} Gallery</h1>
					<div className="flex items-center mt-1 text-muted-foreground">
						<Users className="mr-1 h-4 w-4" />
						<span>{batch.students} students</span>
						<span className="mx-2">•</span>
						<span>
							{images.length} {images.length === 1 ? "image" : "images"}
						</span>
					</div>
				</div>
				{userBatch === batch.batch && (
					<Button
						onClick={() => setUploadDialogOpen(true)}
						className="w-full sm:w-auto">
						<ImagePlus className="mr-2 h-4 w-4" />
						Upload Images
					</Button>
				)}
			</div>

			{images.length > 0 ? (
				<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
					{images.map((image, index) => (
						<div
							key={index}
							className="relative aspect-video cursor-pointer overflow-hidden rounded-lg border bg-muted hover:opacity-90 transition-opacity"
							onClick={() => setViewImageIndex(index)}>
							<Image
								fill
								src={image || "/placeholder.svg"}
								alt={`Batch ${batch.batch} image ${index + 1}`}
								className="h-full w-full object-cover"
							/>
						</div>
					))}
				</div>
			) : (
				<div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center">
					<p className="text-muted-foreground">
						No images have been uploaded for this batch yet.
					</p>
					{userBatch === batch.batch && (
						<Button onClick={() => setUploadDialogOpen(true)} className="mt-4">
							<ImagePlus className="mr-2 h-4 w-4" />
							Upload First Image
						</Button>
					)}
				</div>
			)}

			<ImageUploadDialog
				handleUploadedImages={(imgs) => setImages((prev) => [...prev, ...imgs])}
				batchNumber={batch.batch}
				open={uploadDialogOpen}
				onOpenChange={setUploadDialogOpen}
			/>

			{viewImageIndex !== null && (
				<ImageGalleryDialog
					batchNumber={batch.batch}
					images={images}
					open={viewImageIndex !== null}
					onOpenChange={() => setViewImageIndex(null)}
				/>
			)}
		</div>
	);
}
