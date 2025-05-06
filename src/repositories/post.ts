"use server";

import prisma from "@/lib/prisma";
import { CreatePost, PaginationArgs, PaginationResult, TPost } from "@/types";
import { Prisma } from "@prisma/client";
import uniqueSlug from "unique-slug";

export const createPost = async ({
	content,
	images,
	postedById,
	title,
	type,
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
			type,
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
			likes: post._count.likedBy,
			comments: post._count.comments,
		})),
	};
};
