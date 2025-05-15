import { INDUSTRIES } from "@/constant";
import { NotificationType } from "@prisma/client";
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

// Helper function to get industry name by id
export const getIndustryName = (industryId: string) => {
	const industry = INDUSTRIES.find((i) => i.id === industryId);
	return industry ? industry.name : industryId;
};

export function getNotificationMessage(type: NotificationType): string {
	switch (type) {
		case "EVENT":
			return "You have a new event invitation!";
		case "ANNOUNCEMENT":
			return "A new announcement is available. Check it out!";
		case "ANNOUNCEMENT_COMMENT":
			return "Someone commented on an announcement.";
		case "LIKE_COMMENT":
			return "Your comment received a new like!";
		case "POST":
			return "A new post has been shared.";
		case "POST_COMMENT":
			return "Someone commented on your post.";
		case "LIKE_POST":
			return "Your post received a new like!";
		case "NEW_JOB":
			return "A new job opportunity has been posted.";
		case "JOB":
			return "Check out the latest job postings.";
		case "NEW_RECRUITMENT":
			return "A new recruitment opportunity is available.";
		case "RECRUITMENT":
			return "Explore the latest recruitment notices.";
		case "NEW_POLL":
			return "A new poll has been created. Cast your vote!";
		case "POLL":
			return "Don't forget to participate in ongoing polls.";
		case "RECRUITMENT_APPLICATION":
			return "A new recruitment application has been submitted.";
		default:
			return "You have a new notification.";
	}
}
