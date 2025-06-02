"use server";
import { decrypt } from "@/lib/session";
import {
	createPoll,
	readPoll,
	readPolls,
	updatePoll,
	vote,
} from "@/repositories";
import { PaginationArgs, PaginationResult, Poll, UpdatePoll } from "@/types";
import { cookies } from "next/headers";

export const readPollsAction = async (
	data: PaginationArgs<Poll["status"], never> = {}
): Promise<PaginationResult<Poll>> => {
	try {
		return await readPolls({
			...data,
		});
	} catch (error) {
		console.log(error);
		throw new Error("Failed to fetch polls");
	}
};

export const readPollAction = async (id: number) => {
	try {
		const poll = await readPoll(id);

		if (!poll) return null;

		return poll;
	} catch (error) {
		console.log(error);
		throw new Error("Failed to fetch poll");
	}
};

export const createPollAction = async (data: {
	question: string;
	options: string[];
}) => {
	try {
		return await createPoll({
			options: data.options,
			question: data.question,
		});
	} catch (error) {
		console.log(error);
		throw new Error("Failed to create job");
	}
};

export const voteAction = async (optionId: number) => {
	try {
		const cookieStore = await cookies();

		const session = await decrypt(cookieStore.get("session")?.value);

		if (!session?.id) throw new Error("Unauthorized!");

		await vote(session.id, optionId);
	} catch (error) {
		console.log(error);
		throw new Error("Failed to create job");
	}
};

export const updatePollAction = async (id: number, values: UpdatePoll) => {
	try {
		await updatePoll(id, values);
	} catch (error) {
		console.log(error);
		throw new Error("Failed to update poll");
	}
};
