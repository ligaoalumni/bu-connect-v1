"use server";

import { decrypt } from "@/lib/session";
import { createJob, updateJob } from "@/repositories";
import { JobData, UpdateJob } from "@/types";
import { cookies } from "next/headers";

export const createJobAction = async (data: Omit<JobData, "userId">) => {
	try {
		const cookieStore = await cookies();

		const session = await decrypt(cookieStore.get("session")?.value);

		await createJob({
			...data,
			userId: Number(session?.id),
		});
	} catch (error) {
		console.log(error);
		throw new Error("Failed to create event");
	}
};

export const updateJobAction = async (toUpdateId: number, data: UpdateJob) => {
	try {
		const cookieStore = await cookies();

		const session = await decrypt(cookieStore.get("session")?.value);

		await updateJob(toUpdateId, Number(session?.id), data);
	} catch (error) {
		console.log(error);
		throw new Error("Failed to create event");
	}
};
