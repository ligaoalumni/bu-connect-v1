"use server";

import prisma from "@/lib/prisma";
import { PaginationArgs, PaginationResult } from "@/types";
import { Alumni, AlumniAccount, Prisma } from "@prisma/client";

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

export const readAlumniAccount = async (id: number) => {
	const alumniAccount = await prisma.alumniAccount.findUnique({
		where: {
			id,
		},
	});

	if (!alumniAccount) throw new Error("Alumni not found!");

	return alumniAccount;
};

export const readAlumniRecords = async ({
	filter,
	order,
	orderBy,
	pagination,
}: PaginationArgs<never, never> = {}): Promise<PaginationResult<Alumni>> => {
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
