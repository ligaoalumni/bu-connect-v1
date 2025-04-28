"use server";

import {
	createAnnouncement,
	deleteAnnouncement,
	readAnnouncement,
	readAnnouncements,
	updateAnnouncement,
} from "@/repositories";
import { PaginationArgs } from "@/types";
import { Announcement } from "@prisma/client";
import { revalidatePath } from "next/cache";

export const createAnnouncementAction = async ({
	content,
	title,
}: Pick<Announcement, "content" | "title">) => {
	try {
		const announcement = await createAnnouncement({
			content,
			title,
		});

		if (!announcement) {
			throw new Error("Announcement creation failed");
		}

		revalidatePath("/admin/announcements");

		return announcement;
	} catch (err) {
		console.error("Error creating announcement:", err);
		throw new Error(
			err instanceof Error
				? err.message
				: "Internal Server Error, Please contact tech support."
		);
	}
};

export const updateAnnouncementAction = async (
	slug: string,
	data: Partial<Pick<Announcement, "title" | "content">>
) => {
	try {
		const updatedAnnouncement = await updateAnnouncement(slug, data);

		if (!updatedAnnouncement) {
			throw new Error("Updating announcement failed!");
		}

		revalidatePath("/admin/announcements");
		return updatedAnnouncement;
	} catch (err) {
		console.error("Error creating announcement:", err);
		throw new Error(
			err instanceof Error
				? err.message
				: "Internal Server Error, Please contact tech support."
		);
	}
};

export const deleteAnnouncementAction = async (slug: string) => {
	try {
		await deleteAnnouncement(slug);

		revalidatePath("/admin/announcements");
	} catch (err) {
		console.error("Error creating announcement:", err);
		throw new Error(
			err instanceof Error
				? err.message
				: "Internal Server Error, Please contact tech support."
		);
	}
};

export const readAnnouncementsAction = async (
	args: PaginationArgs<never, never> = {}
) => {
	try {
		return await readAnnouncements(args);
	} catch (err) {
		console.error("Error creating announcement:", err);
		throw new Error(
			err instanceof Error
				? err.message
				: "Internal Server Error, Please contact tech support."
		);
	}
};
export const readAnnouncementAction = async (slug: string) => {
	try {
		return await readAnnouncement(slug);
	} catch (err) {
		console.error("Error creating announcement:", err);
		throw new Error(
			err instanceof Error
				? err.message
				: "Internal Server Error, Please contact tech support."
		);
	}
};
