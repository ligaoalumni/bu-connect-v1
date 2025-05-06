import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

// Helper functions for image grid layout
export function getImageGridClass(count: number): string {
	switch (count) {
		case 1:
			return "grid-cols-1";
		case 2:
			return "grid-cols-2";
		case 3:
			return "grid-cols-2";
		case 4:
			return "grid-cols-2";
		case 5:
			return "grid-cols-3";
		default:
			return "grid-cols-1";
	}
}

export function getImageHeightClass(count: number, index: number): string {
	// Special case for 3 images (2x2 grid with first image taking full width)
	if (count === 3 && index === 0) {
		return "col-span-2 aspect-[2/1]";
	}

	// For 5 images, we're only showing 3, with a different layout
	if (count === 5) {
		if (index === 0) {
			return "aspect-square";
		} else {
			return "aspect-square";
		}
	}

	// Default heights
	switch (count) {
		case 1:
			return "aspect-[16/9]";
		case 2:
			return "aspect-square";
		case 3:
		case 4:
			return "aspect-square";
		default:
			return "aspect-square";
	}
}
