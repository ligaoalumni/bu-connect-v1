"use server";
import {
	createRecruitment,
	readApplicants,
	readRecruitment,
	readRecruitmentList,
	updateRecruitment,
} from "@/repositories";
import {
	Applicant,
	Pagination,
	PaginationArgs,
	PaginationResult,
	RecruitmentWithApplicants,
} from "@/types";
import { Recruitment } from "@prisma/client";
import { revalidatePath } from "next/cache";

export const createRecruitmentAction = async (
	data: Pick<
		Recruitment,
		"date" | "industry" | "allowedBatches" | "title" | "topics"
	>
) => {
	try {
		const newData = await createRecruitment(data);
		revalidatePath("/admin/recruitment");

		return newData;
	} catch (error) {
		console.log(error);
		throw new Error(`Failed to create ${data.title} recruitment`);
	}
};

export const readRecruitmentAction = async (id: number) => {
	try {
		return await readRecruitment(id);
	} catch (error) {
		console.log(error);
		throw new Error(`Failed to read recruitment`);
	}
};

export const updateRecruitmentAction = async (
	id: number,
	data: Partial<Recruitment>
) => {
	try {
		return await updateRecruitment(id, data);
	} catch (error) {
		console.log(error);
		throw new Error(`Failed to update recruitment`);
	}
};

export const readRecruitmentListAction = async (
	args: PaginationArgs<Recruitment["status"], never> = {}
): Promise<PaginationResult<RecruitmentWithApplicants>> => {
	try {
		return await readRecruitmentList(args);
	} catch (error) {
		console.log(error);
		throw new Error(`Failed to read recruitment list`);
	}
};
export const readApplicantsAction = async (args: {
	id: number;
	pagination?: Pagination;
}): Promise<PaginationResult<Applicant>> => {
	try {
		return await readApplicants(args);
	} catch (error) {
		console.log(error);
		throw new Error(`Failed to read applicant list`);
	}
};
