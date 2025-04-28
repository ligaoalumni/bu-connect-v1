import prisma from "@/lib/prisma";

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
