"use server";

import prisma from "@/lib/prisma";
import {
	CreatePost,
	Pagination,
	PaginationArgs,
	PaginationResult,
	TPost,
	TPostComment,
} from "@/types";
import { Prisma } from "@prisma/client";
import uniqueSlug from "unique-slug";

export const createPost = async ({
	content,
	images,
	postedById,
	title,
}: CreatePost) => {
	const timestamp = Date.now(); // current timestamp
	const randomPart = Math.random().toString(36).substring(2, 10); // random string (base 36)
	const name = title.toLowerCase().replace(/ /g, "-");
	const generatedSlug = uniqueSlug(name);

	return await prisma.post.create({
		data: {
			content,
			images,
			slug: `${name}-${timestamp}-${randomPart}-${generatedSlug}`,
			title,
			postedBy: {
				connect: {
					id: postedById,
				},
			},
		},
	});
};

export const updatePost = async ({
	slug,
	postedById,
	data,
}: {
	slug: string;
	postedById: number;
	data: Partial<CreatePost>;
}) => {
	const isPostExist = await prisma.post.findFirst({
		where: { slug, postedById },
	});

	if (!isPostExist) return null;

	return await prisma.post.update({
		where: {
			slug,
			postedBy: {
				id: postedById,
			},
		},
		data,
	});
};

export const readPosts = async ({
	filter,
	pagination,
	order,
	orderBy,
}: PaginationArgs<never, never> = {}): Promise<PaginationResult<TPost>> => {
	let where: Prisma.PostWhereInput = {};

	if (filter && typeof filter === "number") {
		where = {
			id: filter,
		};
	}

	if (filter && typeof filter === "string") {
		where = {
			title: {
				contains: filter,
				mode: "insensitive",
			},
		};
	}

	const posts = await prisma.post.findMany({
		where,
		skip: pagination ? pagination.limit * pagination.page : undefined,
		take: pagination ? pagination.limit : undefined,
		orderBy: orderBy ? { [orderBy]: order || "asc" } : { id: "asc" },
		include: {
			postedBy: {
				select: {
					id: true,
					avatar: true,
					firstName: true,
					lastName: true,
					batch: true,
				},
			},
			likedBy: {
				select: {
					id: true,
				},
			},
			_count: {
				select: {
					comments: true,
					likedBy: true,
				},
			},
		},
	});

	const count = await prisma.post.count({ where });

	return {
		count,
		hasMore: posts.length === pagination?.limit,
		data: posts.map((post) => ({
			...post,
		})),
	};
};

export const readPost = async (slug: string) => {
	return await prisma.post.findFirst({
		where: {
			slug,
		},
		include: {
			_count: {
				select: {
					comments: true,
					likedBy: true,
				},
			},
			postedBy: {
				select: {
					id: true,
					avatar: true,
					firstName: true,
					lastName: true,
					batch: true,
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

export const readPostComments = async ({
	postId,
	pagination,
}: {
	pagination?: Pagination;
	postId: number;
}): Promise<PaginationResult<TPostComment>> => {
	const comments = await prisma.postComment.findMany({
		where: {
			postId,
		},
		include: {
			commentBy: {
				select: {
					firstName: true,
					lastName: true,
					email: true,
					studentId: true,
					batch: true,
					avatar: true,
				},
			},
		},
		orderBy: {
			createdAt: "desc",
		},
		skip: pagination ? pagination.limit * pagination.page : undefined,
		take: pagination ? pagination.limit : undefined,
	});

	const total = await prisma.postComment.count({
		where: {
			postId,
		},
	});

	return {
		count: total || 0,
		data: comments.map((comment) => ({
			id: comment.id,
			comment: comment.comment,
			avatar: comment.commentBy?.avatar || "",
			name: `${comment.commentBy.firstName} ${comment.commentBy.lastName}`,
			commentById: comment.commentById,
			batch: comment.commentBy.batch?.toString() || "",
			postId: comment.postId,
			createdAt: comment.createdAt,
		})),
		hasMore: comments.length === pagination?.limit,
	};
};

export const writePostComment = async ({
	comment,
	postId,
	userId,
}: {
	postId: number;
	comment: string;
	userId: number;
}) => {
	return await prisma.postComment.create({
		data: {
			comment,
			postedBy: {
				connect: {
					id: postId,
				},
			},
			commentBy: {
				connect: {
					id: userId,
				},
			},
		},
	});
};
