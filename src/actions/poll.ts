import { createPoll, readPoll, readPolls } from "@/repositories";
import { PaginationArgs, PaginationResult } from "@/types";
import { Poll } from "@prisma/client";

export const readPollsAction = async (
	data: PaginationArgs<Poll["status"], never>
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
		await createPoll({
			options: data.options,
			question: data.question,
		});
	} catch (error) {
		console.log(error);
		throw new Error("Failed to update job");
	}
};
