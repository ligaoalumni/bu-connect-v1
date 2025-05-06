"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

interface ImageModalProps {
	images: string[];
	initialIndex: number;
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

export function ImageModal({
	images,
	initialIndex,
	open,
	onOpenChange,
}: ImageModalProps) {
	const [currentIndex, setCurrentIndex] = useState(initialIndex);

	// Reset current index when modal opens
	useEffect(() => {
		if (open) {
			setCurrentIndex(initialIndex);
		}
	}, [open, initialIndex]);

	const handlePrevious = () => {
		setCurrentIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
	};

	const handleNext = () => {
		setCurrentIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
	};

	// Handle keyboard navigation
	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (!open) return;

			if (e.key === "ArrowLeft") {
				handlePrevious();
			} else if (e.key === "ArrowRight") {
				handleNext();
			} else if (e.key === "Escape") {
				onOpenChange(false);
			}
		};

		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [open, onOpenChange]);

	if (images.length === 0) return null;

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="max-w-screen-lg w-[90vw] h-[90vh] p-0 bg-background/95 backdrop-blur-sm">
				<div className="relative flex items-center justify-center w-full h-full">
					{/* Close button */}
					<Button
						variant="ghost"
						size="icon"
						className="absolute top-2 right-2 z-50 rounded-full bg-background/50 hover:bg-background/80"
						onClick={() => onOpenChange(false)}>
						<X className="h-5 w-5" />
						<span className="sr-only">Close</span>
					</Button>

					{/* Image counter */}
					<div className="absolute top-2 left-2 z-50 bg-background/50 px-2 py-1 rounded text-sm">
						{currentIndex + 1} / {images.length}
					</div>

					{/* Main image */}
					<div className="relative w-full h-full flex items-center justify-center p-8">
						<Image
							src={images[currentIndex] || "/placeholder.svg"}
							alt={`Image ${currentIndex + 1}`}
							fill
							className="object-contain"
							priority
						/>
					</div>

					{/* Navigation buttons */}
					{images.length > 1 && (
						<>
							<Button
								variant="ghost"
								size="icon"
								className="absolute left-2 z-50 rounded-full bg-background/50 hover:bg-background/80"
								onClick={handlePrevious}>
								<ChevronLeft className="h-8 w-8" />
								<span className="sr-only">Previous image</span>
							</Button>
							<Button
								variant="ghost"
								size="icon"
								className="absolute right-2 z-50 rounded-full bg-background/50 hover:bg-background/80"
								onClick={handleNext}>
								<ChevronRight className="h-8 w-8" />
								<span className="sr-only">Next image</span>
							</Button>
						</>
					)}

					{/* Thumbnail navigation for multiple images */}
					{images.length > 1 && (
						<div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 px-4">
							<div className="flex gap-2 p-2 bg-background/50 backdrop-blur-sm rounded-full overflow-x-auto max-w-full">
								{images.map((image, index) => (
									<button
										key={index}
										className={`relative w-12 h-12 rounded-full overflow-hidden border-2 transition-all ${
											index === currentIndex
												? "border-primary scale-110"
												: "border-transparent opacity-70"
										}`}
										onClick={() => setCurrentIndex(index)}>
										<Image
											src={image || "/placeholder.svg"}
											alt={`Thumbnail ${index + 1}`}
											fill
											className="object-cover"
										/>
									</button>
								))}
							</div>
						</div>
					)}
				</div>
			</DialogContent>
		</Dialog>
	);
}
