"use server";

import prisma from "@/lib/prisma";
import { CreatePost } from "@/types";
import uniqueSlug from "unique-slug";

export const createPost = async ({
	content,
	coverImg,
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
			coverImg,
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
