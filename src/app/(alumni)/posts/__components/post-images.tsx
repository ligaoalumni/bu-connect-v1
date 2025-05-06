"use client";

import Image from "next/image";
import React, { useState } from "react";
import { ImageModal } from "./image-modal";
import { getImageGridClass, getImageHeightClass } from "@/lib/utils";

export default function PostImages({ images }: { images: string[] }) {
	const imageCount = images.length;

	// State for image modal
	const [modalOpen, setModalOpen] = useState(false);
	const [selectedImageIndex, setSelectedImageIndex] = useState(0);

	const handleImageClick = (index: number) => {
		setSelectedImageIndex(index);
		setModalOpen(true);
	};

	return (
		<>
			<div
				className={`grid gap-1 cursor-pointer ${getImageGridClass(
					imageCount
				)}`}>
				{images
					.slice(0, imageCount === 5 ? 3 : imageCount)
					.map((image, index) => (
						<div
							key={index}
							className={`relative overflow-hidden rounded-md ${getImageHeightClass(
								imageCount,
								index
							)}`}
							onClick={() => handleImageClick(index)}>
							<Image
								src={image || ""}
								alt={`Post image ${index + 1}`}
								fill
								className="object-cover"
							/>
							{imageCount === 5 && index === 2 && (
								<div className="absolute inset-0 bg-black/60 flex items-center justify-center">
									<span className="text-white font-medium text-lg">
										+2 more
									</span>
								</div>
							)}
						</div>
					))}
			</div>

			{/* Image Modal */}
			<ImageModal
				images={images}
				initialIndex={selectedImageIndex}
				open={modalOpen}
				onOpenChange={setModalOpen}
			/>
		</>
	);
}
