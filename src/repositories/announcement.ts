"use server";

import prisma from "@/lib/prisma";
import {
	AnnouncementCommentWithUser,
	Pagination,
	PaginationArgs,
	PaginationResult,
} from "@/types";
import { Announcement, NotificationType, Prisma } from "@prisma/client";
import slug from "unique-slug";
import { createNotifications } from "./notifications";
import { getNotificationMessage } from "@/lib/utils";
import { getAdmins, getUsersId } from "./user";

export const createAnnouncement = async ({
	content,

	title,
}: Pick<Announcement, "title" | "content">) => {
	const timestamp = Date.now(); // current timestamp
	const randomPart = Math.random().toString(36).substring(2, 10); // random string (base 36)
	const name = title.toLowerCase().replace(/ /g, "-");
	const generatedSlug = slug(name);

	const newAnnouncement = await prisma.announcement.create({
		data: {
			title,
			content,
			slug: `${name}-${timestamp}-${randomPart}-${generatedSlug}`,
		},
	});

	const usersId = await getUsersId();
	const link = `/announcements/${newAnnouncement.slug}`;

	const notifications = usersId.map((id) => ({
		userId: id,
		message: getNotificationMessage("ANNOUNCEMENT"),
		link,
		type: "ANNOUNCEMENT" as NotificationType,
	}));

	await createNotifications(notifications);

	return newAnnouncement;
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
		include: {
			_count: {
				select: {
					comments: true,
					likedBy: true,
				},
			},
			likedBy: {
				select: {
					id: true,
				},
			},
		},
	});
};

export const writeAnnouncementComment = async ({
	announcementId,
	comment,
	userId,
}: {
	announcementId: number;
	comment: string;
	userId: number;
}) => {
	const newComment = await prisma.announcementComment.create({
		data: {
			announcementId,
			comment,
			commentById: userId,
		},
		include: {
			announcement: {
				select: {
					comments: {
						select: {
							commentById: true,
						},
					},
				},
			},
		},
	});

	if (!newComment) {
		throw new Error("Failed to create comment");
	}

	const { announcement } = newComment;

	const ids = announcement.comments
		.map((comment) => comment.commentById)
		.filter((ids) => ids !== userId);

	const link = `/announcements/${announcementId}#comment-${newComment.id}`;

	const notifications = ids.map((id) => ({
		userId: id,
		message: getNotificationMessage("ANNOUNCEMENT_COMMENT"),
		link,
		type: "ANNOUNCEMENT_COMMENT" as NotificationType,
	}));

	await createNotifications(notifications);
};

export const readAnnouncementComments = async ({
	pagination,
	announcementId,
}: {
	pagination?: Pagination;
	announcementId: number;
}): Promise<PaginationResult<AnnouncementCommentWithUser>> => {
	const records = await prisma.announcementComment.findMany({
		where: {
			announcementId,
		},
		include: {
			commentBy: {
				select: {
					id: true,
					avatar: true,
					firstName: true,
					lastName: true,
					batch: true,
				},
			},
		},
		skip: pagination ? pagination.limit * pagination.page : undefined,
		take: pagination ? pagination.limit : undefined,
		orderBy: {
			createdAt: "desc",
		},
	});

	const count = await prisma.announcementComment.count({
		where: {
			announcementId,
		},
	});

	return {
		count,
		hasMore: records.length === pagination?.limit,
		data: records.map((record) => ({
			...record,
		})),
	};
};

export const likeAnnouncement = async ({
	id,
	userId,
}: {
	id: number;
	userId: number;
}) => {
	const announcement = await prisma.announcement.update({
		where: {
			id,
		},
		data: {
			likedBy: {
				connect: {
					id: userId,
				},
			},
		},
	});

	if (!announcement) throw new Error("Failed to like announcement");
	const users = await getAdmins();

	const link = `/announcements/${announcement.id}`;

	const notifications = users.map((user) => ({
		userId: user.id,
		message: getNotificationMessage("LIKE_ANNOUNCEMENT"),
		link,
		type: "LIKE_ANNOUNCEMENT" as NotificationType,
	}));

	await createNotifications(notifications);

	return announcement;
};

export const unlikeAnnouncement = async ({
	id,
	userId,
}: {
	id: number;
	userId: number;
}) => {
	return await prisma.announcement.update({
		where: {
			id,
		},
		data: {
			likedBy: {
				disconnect: {
					id: userId,
				},
			},
		},
	});
};
