import prisma from "@/lib/prisma";
import { Announcement } from "@prisma/client";
import slug from "unique-slug";

export const createAnnouncement = async ({
	content,
	coverImg,
	title,
}: Pick<Announcement, "title" | "content" | "coverImg">) => {
	const timestamp = Date.now(); // current timestamp
	const randomPart = Math.random().toString(36).substring(2, 10); // random string (base 36)
	const name = title.toLowerCase().replace(/ /g, "-");
	const generatedSlug = slug(name);

	return await prisma.announcement.create({
		data: {
			title,
			content,
			coverImg,
			slug: `${name}-${timestamp}-${randomPart}-${generatedSlug}`,
		},
	});
};

export const updateAnnouncement = async (
	toUpdate: string,
	values: Partial<Pick<Announcement, "title" | "content" | "coverImg">>
) => {
	return await prisma.announcement.update({
		where: {
			slug: toUpdate,
		},
		data: values,
	});
};

export const deleteAnnouncement = async (toDelete: string) => {
	return await prisma.announcement.delete({
		where: {
			slug: toDelete,
		},
	});
};
