"use server";

import { decrypt } from "@/lib/session";
import { createPost, readPost, readPosts, updatePost } from "@/repositories";
import { CreatePost, PaginationArgs } from "@/types";
import { cookies } from "next/headers";

export const createPostAction = async (
	data: Omit<CreatePost, "postedById">
) => {
	try {
		const cookieStore = await cookies();

		const session = await decrypt(cookieStore.get("session")?.value);

		await createPost({
			...data,
			postedById: Number(session?.id),
		});
	} catch (error) {
		console.log(error);
		throw new Error("Failed to create event");
	}
};

export const updatePostAction = async (
	slug: string,
	data: Partial<Omit<CreatePost, "postedById">>
) => {
	try {
		const cookieStore = await cookies();

		const session = await decrypt(cookieStore.get("session")?.value);

		await updatePost({
			slug,
			postedById: Number(session?.id),
			data,
		});
	} catch (error) {
		console.log(error);
		throw new Error("Failed to create event");
	}
};

export const readPostsAction = async (
	data: PaginationArgs<never, never> = {}
) => {
	try {
		return await readPosts(data);
	} catch (error) {
		console.log(error);
		throw new Error("Failed to fetch posts");
	}
};

export const readPostAction = async (slug: string) => {
	try {
		return await readPost(slug);
	} catch (error) {
		console.log(error);
		throw new Error("Failed to fetch posts");
	}
};
