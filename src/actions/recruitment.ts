"use server";
import { createRecruitment } from "@/repositories";
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
