"use server";

import prisma from "@/lib/prisma";
import { JobData, UpdateJob } from "@/types";

export const createJob = async ({
	company,
	description,
	jobTitle,
	location,
	title,
	type,
	userId,
}: JobData) => {
	return await prisma.job.create({
		data: {
			company,
			description,
			jobTitle,
			location,
			title,
			type,
			postedBy: {
				connect: {
					id: userId,
				},
			},
		},
	});
};

export const updateJob = async (
	toUpdate: number,
	postedById: number,
	data: UpdateJob
) => {
	return await prisma.job.update({
		where: {
			id: toUpdate,
			postedById,
		},
		data,
	});
};
