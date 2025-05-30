"use server";

import { prisma } from "@/lib";
import { JobData, PaginationArgs, PaginationResult, UpdateJob } from "@/types";
import { Job, JobStatus, Prisma } from "@prisma/client";

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
	const user = await prisma.user.findUnique({ where: { id: postedById } });

	if (!user) {
		throw new Error("Unauthorized");
	}

	if (user.id !== postedById && user.role === "ALUMNI") {
		throw new Error("Unauthorized");
	}

	return await prisma.job.update({
		where: {
			id: toUpdate,
		},
		data,
	});
};

type TJobPagination = PaginationArgs<JobStatus, never> & {
	isAdmin?: boolean;
	userId: number;
	type?: Job["type"];
	location?: string;
	managedByAlumni?: boolean;
};

export const readJobs = async ({
	filter,
	pagination,
	order,
	orderBy,
	status,
	type,
	managedByAlumni,
	userId,
	isAdmin,
	location,
}: TJobPagination): Promise<PaginationResult<Job>> => {
	let where: Prisma.JobWhereInput = {};

	if (filter && typeof filter === "number") {
		where = {
			id: filter,
		};
	}

	if (type) {
		where = {
			...where,
			type,
		};
	}

	if (status) {
		where = {
			...where,
			status: {
				in: status,
			},
		};
	}

	if (location) {
		where = {
			...where,
			location: {
				contains: location,
				mode: "insensitive",
			},
		};
	}

	if (typeof filter === "string") {
		where = {
			OR: [
				{ title: { contains: filter, mode: "insensitive" } },
				{ jobTitle: { contains: filter, mode: "insensitive" } },
			],
		};
	}

	if (managedByAlumni && !isAdmin) {
		where = {
			...where,
			postedBy: {
				id: userId,
			},
		};
	}

	const jobs = await prisma.job.findMany({
		where,
		skip: pagination ? pagination.limit * pagination.page : undefined,
		take: pagination ? pagination.limit : undefined,
		orderBy: orderBy ? { [orderBy]: order || "asc" } : { id: "asc" },
	});

	const count = await prisma.job.count({ where });

	console.log(jobs, "qweqw");

	return {
		count,
		hasMore: jobs.length === pagination?.limit,
		data: jobs,
	};
};

export const readJob = async (id: number) => {
	return await prisma.job.findUnique({
		where: {
			id,
		},
	});
};
