"use server";

import { decrypt } from "@/lib/session";
import { createJob, readJob, readJobs, updateJob } from "@/repositories";
import { JobData, PaginationArgs, UpdateJob } from "@/types";
import { JobStatus } from "@prisma/client";
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
		throw new Error("Failed to update job");
	}
};

export const readJobsAction = async (
	data: PaginationArgs<JobStatus, never>
) => {
	try {
		const cookieStore = await cookies();

		const session = await decrypt(cookieStore.get("session")?.value);

		return await readJobs({
			...data,
			userId: Number(session?.id),
			isAdmin: session?.role !== "ALUMNI",
		});
	} catch (error) {
		console.log(error);
		throw new Error("Failed to create event");
	}
};

export const readJobAction = async (id: number) => {
	try {
		const job = await readJob(id);

		if (!job) return null;

		return job;
	} catch (error) {
		console.log(error);
		throw new Error("Failed to fetch job");
	}
};
