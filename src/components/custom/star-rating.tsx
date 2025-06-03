"use client";

import type React from "react";

import { useState } from "react";
import { Star } from "lucide-react";
import { cn } from "@/lib";
import { updateUserAction } from "@/actions";
import { toast } from "sonner";

interface StarRatingProps {
	initialRating?: number;
	size?: "sm" | "md" | "lg";
	readOnly?: boolean;
	className?: string;
	hideRate?: boolean;
}

export function StarRating({
	initialRating = 0,
	size = "md",
	readOnly = false,
	className,
	hideRate = false,
}: StarRatingProps) {
	const [rating, setRating] = useState(initialRating);
	const [hoverRating, setHoverRating] = useState(0);
	const [loading, setLoading] = useState(false);

	const sizes = {
		sm: "w-4 h-4",
		md: "w-6 h-6",
		lg: "w-8 h-8",
	};

	const handleClick = async (
		e: React.MouseEvent<HTMLDivElement>,
		index: number
	) => {
		if (loading || readOnly) return;
		const prevRating = rating;

		const { left, width } = e.currentTarget.getBoundingClientRect();
		const percent = (e.clientX - left) / width;

		let selectedRating: number;

		// If cursor is on the left half of the star
		if (percent <= 0.5) {
			selectedRating = index + 0.5;
		} else {
			selectedRating = index + 1;
		}

		try {
			setLoading(true);
			setRating(selectedRating);
			await updateUserAction({
				rate: selectedRating as any,
			});
			toast.success("Rating updated successfully!", {
				description: `You rated ${selectedRating} stars.`,
				richColors: true,
				position: "top-center",
				duration: 5000,
			});
		} catch (error) {
			toast.error("Failed to update rating.", {
				description: "Please try again later.",
				richColors: true,
				position: "top-center",
				duration: 5000,
			});
			console.log(error);
			setRating(prevRating); // Revert to previous rating on error
		} finally {
			setLoading(false);
		}
	};

	const handleMouseMove = (
		e: React.MouseEvent<HTMLDivElement>,
		index: number
	) => {
		if (readOnly) return;

		const { left, width } = e.currentTarget.getBoundingClientRect();
		const percent = (e.clientX - left) / width;

		// If cursor is on the left half of the star
		if (percent <= 0.5) {
			setHoverRating(index + 0.5);
		} else {
			setHoverRating(index + 1);
		}
	};

	const handleMouseLeave = () => {
		if (readOnly) return;
		setHoverRating(0);
	};

	const activeRating = hoverRating || rating;

	return (
		<div
			className={cn("flex items-center", className)}
			role="radiogroup"
			aria-label="Rating">
			{[...Array(5)].map((_, index) => {
				const starValue = index + 1;
				const isActiveHalf = activeRating === index + 0.5;
				const isActiveFull = activeRating >= starValue;

				return (
					<div
						key={index}
						className={cn(
							"relative cursor-pointer",
							readOnly && "cursor-default"
						)}
						onClick={(e) => handleClick(e, index)}
						onMouseMove={(e) => handleMouseMove(e, index)}
						onMouseLeave={handleMouseLeave}
						role="radio"
						aria-checked={Math.ceil(rating) === starValue}
						aria-label={`${starValue} star${starValue === 1 ? "" : "s"}`}>
						{/* Background star (always shown) */}
						<Star className={cn(sizes[size], "stroke-gray-300", "fill-none")} />

						{/* Half star */}
						{isActiveHalf && (
							<div className="absolute inset-0 overflow-hidden w-1/2">
								<Star
									className={cn(
										sizes[size],
										"stroke-yellow-400 fill-yellow-400"
									)}
								/>
							</div>
						)}

						{/* Full star */}
						{isActiveFull && (
							<Star
								className={cn(
									"absolute inset-0",
									sizes[size],
									"stroke-yellow-400 fill-yellow-400"
								)}
							/>
						)}
					</div>
				);
			})}
			{!hideRate && (
				<span className="ml-2 text-sm text-gray-600" aria-live="polite">
					{activeRating ? `${activeRating.toFixed(1)}` : ""}
				</span>
			)}
		</div>
	);
}
