import { readPolls } from "@/repositories";
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
		throw new Error("Failed to create event");
	}
};
