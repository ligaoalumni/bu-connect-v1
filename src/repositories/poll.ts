import prisma from "@/lib/prisma";
import { PaginationArgs, PaginationResult } from "@/types";
import { Poll, Prisma } from "@prisma/client";

export const createPoll = async ({
	options,
	question,
}: {
	question: string;
	options: string[];
}) => {
	return await prisma.poll.create({
		data: {
			question,
			options: {
				createMany: {
					data: options.map((option) => ({
						content: option,
					})),
				},
			},
		},
	});
};

export const vote = async (userId: number, optionId: number) => {
	return await prisma.vote.create({
		data: {
			userId,
			optionId,
		},
	});
};

export const readPolls = async ({
	filter,
	pagination,
	order,
	orderBy,
	status,
}: PaginationArgs<Poll["status"], never>): Promise<PaginationResult<Poll>> => {
	let where: Prisma.PollWhereInput = {};

	if (filter && typeof filter === "number") {
		where = {
			id: filter,
		};
	}

	if (status) {
		where = {
			...where,
			status: {
				in: status,
			},
		};
	}

	if (typeof filter === "string") {
		where = {
			OR: [{ question: { contains: filter, mode: "insensitive" } }],
		};
	}

	const polls = await prisma.poll.findMany({
		where,
		skip: pagination ? pagination.limit * pagination.page : undefined,
		take: pagination ? pagination.limit : undefined,
		orderBy: orderBy ? { [orderBy]: order || "asc" } : { id: "asc" },
	});

	const count = await prisma.poll.count({ where });

	return {
		count,
		hasMore: polls.length === pagination?.limit,
		data: polls,
	};
};

export const readPoll = async (id: number) => {
	return await prisma.poll.findUnique({
		where: {
			id,
		},
	});
};
