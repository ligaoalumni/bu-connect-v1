"use client";

import { Dispatch, SetStateAction, useState } from "react";
import { ImagePlus, Users } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { ImageUploadDialog } from "./image-upload-dialog";
import { ImageGalleryDialog } from "./image-gallery-upload";
import Image from "next/image";
import { Batch } from "@/types";

interface BatchCardProps {
	batch: Batch;
	setBatches: Dispatch<SetStateAction<Batch[]>>;
}

export function BatchCard({ batch, setBatches }: BatchCardProps) {
	const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
	const [galleryDialogOpen, setGalleryDialogOpen] = useState(false);

	return (
		<>
			<Card className="overflow-hidden">
				<CardHeader className="pb-2">
					<CardTitle className="flex items-center justify-between">
						<span>Batch {batch.batch}</span>
						<div className="flex items-center text-sm font-normal text-muted-foreground">
							<Users className="mr-1 h-4 w-4" />
							{batch.students} students
						</div>
					</CardTitle>
				</CardHeader>
				<CardContent className="p-0">
					<div
						className="relative aspect-video cursor-pointer"
						onClick={() =>
							batch.images.length > 0 && setGalleryDialogOpen(true)
						}>
						{batch.images.length > 0 ? (
							<>
								<div className="relative h-full w-full">
									<Image
										fill
										src={batch.images[0]}
										alt={`Batch ${batch.batch} preview`}
										className="h-full w-full object-cover"
									/>
								</div>
								{batch.images.length > 1 && (
									<div className="absolute bottom-2 right-2 rounded-full bg-black/70 px-2 py-1 text-xs text-white">
										+{batch.images.length - 1} more
									</div>
								)}
							</>
						) : (
							<div className="flex h-full w-full items-center justify-center bg-muted">
								<p className="text-muted-foreground">No images yet</p>
							</div>
						)}
					</div>
				</CardContent>
				<CardFooter className="flex justify-between pt-4">
					<div className="text-sm text-muted-foreground">
						{batch.images.length}{" "}
						{batch.images.length === 1 ? "image" : "images"}
					</div>
					<Button size="sm" onClick={() => setUploadDialogOpen(true)}>
						<ImagePlus className="mr-2 h-4 w-4" />
						Upload Images
					</Button>
				</CardFooter>
			</Card>

			<ImageUploadDialog
				setBatches={setBatches}
				batchNumber={batch.batch}
				open={uploadDialogOpen}
				onOpenChange={setUploadDialogOpen}
			/>

			<ImageGalleryDialog
				batchNumber={batch.batch}
				images={batch.images}
				open={galleryDialogOpen}
				onOpenChange={setGalleryDialogOpen}
			/>
		</>
	);
}
