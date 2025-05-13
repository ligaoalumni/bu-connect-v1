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
