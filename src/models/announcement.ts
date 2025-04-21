"use server";

import prisma from "@/lib/prisma";
import { PaginationArgs, PaginationResult } from "@/types";
import { Announcement, Prisma } from "@prisma/client";
import slug from "unique-slug";

export const createAnnouncement = async ({
	content,

	title,
}: Pick<Announcement, "title" | "content">) => {
	const timestamp = Date.now(); // current timestamp
	const randomPart = Math.random().toString(36).substring(2, 10); // random string (base 36)
	const name = title.toLowerCase().replace(/ /g, "-");
	const generatedSlug = slug(name);

	return await prisma.announcement.create({
		data: {
			title,
			content,
			slug: `${name}-${timestamp}-${randomPart}-${generatedSlug}`,
		},
	});
};

export const updateAnnouncement = async (
	toUpdate: string,
	values: Partial<Pick<Announcement, "title" | "content">>
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

export const readAnnouncements = async ({
	filter,
	order,
	orderBy,
	pagination,
}: PaginationArgs<never, never> = {}): Promise<
	PaginationResult<Announcement>
> => {
	let where: Prisma.AnnouncementWhereInput = {};

	if (filter && typeof filter === "number") {
		where = {
			id: filter,
		};
	}

	if (typeof filter === "string") {
		where = {
			OR: [{ title: { contains: filter, mode: "insensitive" } }],
		};
	}

	const records = await prisma.announcement.findMany({
		where,
		skip: pagination ? pagination.limit * pagination.page : undefined,
		take: pagination ? pagination.limit : undefined,
		orderBy: orderBy ? { [orderBy]: order || "asc" } : { id: "asc" },
	});

	const count = await prisma.announcement.count({ where });

	return {
		count,
		hasMore: records.length === pagination?.limit,
		data: records.map((record) => ({
			...record,
		})),
	};
};

export const readAnnouncement = async (slug: string) => {
	return await prisma.announcement.findUnique({
		where: { slug },
	});
};
