"use server";

import prisma from "@/lib/prisma";
import {
	PaginationArgs,
	PaginationResult,
	RecruitmentWithApplicants,
} from "@/types";
import { Prisma, Recruitment } from "@prisma/client";

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

export const readRecruitmentList = async ({
	filter,
	pagination,
	order,
	orderBy,
}: PaginationArgs<Recruitment["status"], never> = {}): Promise<
	PaginationResult<RecruitmentWithApplicants>
> => {
	let where: Prisma.RecruitmentWhereInput = {};

	if (filter && typeof filter === "number") {
		where = {
			id: filter,
		};
	}

	if (filter && typeof filter === "string") {
		where = {
			title: {
				contains: filter,
				mode: "insensitive",
			},
		};
	}

	const recruitments = await prisma.recruitment.findMany({
		where,
		skip: pagination ? pagination.limit * pagination.page : undefined,
		take: pagination ? pagination.limit : undefined,
		orderBy: orderBy ? { [orderBy]: order || "asc" } : { id: "asc" },
		include: {
			applicants: {
				select: {
					id: true,
					firstName: true,
					lastName: true,
					email: true,
					batch: true,
				},
			},
		},
	});

	const count = await prisma.recruitment.count({ where });

	return {
		count,
		hasMore: recruitments.length === pagination?.limit,
		data: recruitments.map((recruitment) => ({
			...recruitment,
			applicants: recruitment.applicants.map((applicant) => ({
				...applicant,
				batch: Number(applicant.batch),
			})),
		})),
	};
};
