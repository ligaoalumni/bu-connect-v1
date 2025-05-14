"use server";
import {
	createRecruitment,
	readRecruitment,
	updateRecruitment,
} from "@/repositories";
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
