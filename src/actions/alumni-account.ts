"use server";

import prisma from "@/lib/prisma";
import { AlumniWithRelation, PaginationArgs, PaginationResult } from "@/types";
import { AlumniAccount, Prisma } from "@prisma/client";

export const readAlumniAccounts = async (
	{ filter, order, orderBy, pagination }: PaginationArgs<never, never> = {},
	includeAlumni?: boolean
): Promise<PaginationResult<AlumniAccount>> => {
	let where: Prisma.AlumniAccountWhereInput = {};

	if (filter && typeof filter === "number") {
		where = {
			id: filter,
		};
	}

	if (typeof filter === "string") {
		where = {
			OR: [
				{ lrn: { contains: filter, mode: "insensitive" } },
				{
					email: { contains: filter, mode: "insensitive" },
				},
				{
					firstName: { contains: filter, mode: "insensitive" },
				},
				{
					lastName: { contains: filter, mode: "insensitive" },
				},
			],
		};
	}

	where.alumniId = null;

	const alumniAccounts = await prisma.alumniAccount.findMany({
		where,
		skip: pagination ? pagination.limit * pagination.page : undefined,
		take: pagination ? pagination.limit : undefined,
		orderBy: orderBy ? { [orderBy]: order || "asc" } : { id: "asc" },
		include: {
			alumni: includeAlumni,
		},
	});

	const count = await prisma.alumniAccount.count({ where });

	return {
		count,
		hasMore: alumniAccounts.length === pagination?.limit,
		data: alumniAccounts.map((alumniAccount) => ({
			...alumniAccount,
		})),
	};
};

export const readAlumniAccount = async (id: string | number) => {
	let where: Prisma.AlumniAccountWhereUniqueInput;

	if (typeof id === "string") {
		where = {
			lrn: id,
		};
	} else {
		where = {
			id: id,
		};
	}

	return await prisma.alumniAccount.findUnique({
		where,
		include: {
			alumni: true,
			user: true,
		},
	});
};

export const readAlumniRecords = async ({
	filter,
	order,
	orderBy,
	pagination,
}: PaginationArgs<never, never> = {}): Promise<
	PaginationResult<AlumniWithRelation>
> => {
	let where: Prisma.AlumniWhereInput = {};

	if (filter && typeof filter === "number") {
		where = {
			id: filter,
		};
	}

	if (typeof filter === "string") {
		where = {
			OR: [
				{ lrn: { contains: filter, mode: "insensitive" } },
				{
					firstName: { contains: filter, mode: "insensitive" },
				},
				{
					lastName: { contains: filter, mode: "insensitive" },
				},
			],
		};
	}

	const records = await prisma.alumni.findMany({
		where,
		skip: pagination ? pagination.limit * pagination.page : undefined,
		take: pagination ? pagination.limit : undefined,
		orderBy: orderBy ? { [orderBy]: order || "asc" } : { id: "asc" },
		include: {
			alumniAccount: true,
		},
	});

	const count = await prisma.alumni.count({ where });

	return {
		count,
		hasMore: records.length === pagination?.limit,
		data: records.map((record) => ({
			...record,
		})),
	};
};

export const readAlumniRecord = async ({
	id,
	lrn,
	studentId,
}: {
	id?: number;
	studentId?: string;
	lrn?: string;
}): Promise<AlumniWithRelation | null> => {
	const record = await prisma.alumni.findFirst({
		where: {
			OR: [{ id: id }, { lrn: lrn }, { studentId: studentId }],
		},
		include: {
			alumniAccount: true,
		},
	});

	return record;
};
