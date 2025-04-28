"use server";

import prisma from "@/lib/prisma";
import { PaginationArgs, PaginationResult } from "@/types";
import { Prisma, User } from "@prisma/client";

export const readAlumniAccounts = async ({
	filter,
	order,
	orderBy,
	pagination,
}: PaginationArgs<never, never> = {}): Promise<PaginationResult<User>> => {
	let where: Prisma.UserWhereInput = {};

	if (filter && typeof filter === "number") {
		where = {
			id: filter,
		};
	}

	if (typeof filter === "string") {
		where = {
			OR: [
				{ studentId: { contains: filter, mode: "insensitive" } },
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

	where = {
		...where,
		role: "ALUMNI",
	};

	const alumni = await prisma.user.findMany({
		where,
		skip: pagination ? pagination.limit * pagination.page : undefined,
		take: pagination ? pagination.limit : undefined,
		orderBy: orderBy ? { [orderBy]: order || "asc" } : { id: "asc" },
	});

	const count = await prisma.user.count({ where });

	console.log(alumni, "qqq");

	return {
		count,
		hasMore: alumni.length === pagination?.limit,
		data: alumni,
	};
};

export const readAlumniAccount = async (id: string | number) => {
	let where: Prisma.UserWhereInput;

	if (typeof id === "string") {
		where = {
			OR: [
				{ studentId: { contains: id, mode: "insensitive" } },
				{ email: { contains: id, mode: "insensitive" } },
			],
		};
	} else {
		where = {
			id: id,
		};
	}

	return await prisma.user.findFirst({
		where,
	});
};
