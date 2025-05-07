"use server";

import { decrypt } from "@/lib/session";
import {
	createPost,
	readPost,
	readPostComments,
	readPosts,
	unlikePost,
	updatePost,
	writePostComment,
} from "@/repositories";
import { CreatePost, Pagination, PaginationArgs } from "@/types";
import { revalidatePath } from "next/cache";
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

export const readPostCommentsAction = async (args: {
	pagination?: Pagination;
	postId: number;
}) => {
	try {
		return await readPostComments(args);
	} catch (err) {
		console.log(err);
		throw new Error("Failed to fetch comments");
	}
};

export const writePostCommentAction = async ({
	comment,
	postId,
	slug,
}: {
	postId: number;
	comment: string;
	slug: string;
}) => {
	try {
		const cookieStore = await cookies();

		const session = await decrypt(cookieStore.get("session")?.value);

		if (!session?.id) throw new Error("Unauthorized");

		await writePostComment({ userId: session.id, comment, postId });

		revalidatePath(`/posts/${slug}/info`);
	} catch {
		throw new Error("Failed to fetch interested alumni");
	}
};

export const unlikePostAction = async ({
	postId,
	slug,
}: {
	postId: number;

	slug: string;
}) => {
	try {
		const cookieStore = await cookies();

		const session = await decrypt(cookieStore.get("session")?.value);

		if (!session?.id) throw new Error("Unauthorized");

		await unlikePost({ userId: session.id, postId });

		revalidatePath(`/posts/${slug}/info`);
	} catch {
		throw new Error("Failed to fetch interested alumni");
	}
};
