"use server";

import prisma from "@/lib/prisma";
import { Recruitment } from "@prisma/client";

export const createRecruitment = async ({
	allowedBatches,
	date,
	industry,
	title,
	topics,
}: Pick<
	Recruitment,
	"date" | "industry" | "allowedBatches" | "title" | "topics"
>) => {
	return await prisma.recruitment.create({
		data: {
			date,
			industry,
			title,
			topics,
			allowedBatches,
		},
	});
};

export const readRecruitment = async (id: number) => {
	return await prisma.recruitment.findUnique({
		where: {
			id,
		},
		include: { applicants: true },
	});
};

export const updateRecruitment = async (
	id: number,
	data: Partial<Recruitment>
) => {
	return await prisma.recruitment.update({
		where: {
			id,
		},
		data,
	});
};
