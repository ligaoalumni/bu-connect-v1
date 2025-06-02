"use server";

import { decrypt } from "@/lib/session";
import { createJob, readJob, readJobs, updateJob } from "@/repositories";
import { JobData, PaginationArgs, UpdateJob } from "@/types";
import { Job, JobStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";
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

		const job = await updateJob(toUpdateId, Number(session?.id), data);

		if (data.status) {
			revalidatePath(session?.role === "ALUMNI" ? `/jobs` : `/admin/jobs`);
		} else {
			revalidatePath(
				session?.role === "ALUMNI"
					? `/jobs/${job.id}/edit`
					: `/admin/jobs/${job.id}/edit`
			);
		}
	} catch (error) {
		console.log(error);
		throw new Error("Failed to update job");
	}
};

export const readJobsAction = async (
	data: PaginationArgs<JobStatus, never> & {
		type?: Job["type"];
		location?: string;
		managedByAlumni?: boolean;
	}
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
