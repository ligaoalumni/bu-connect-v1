"use server";

import prisma from "@/lib/prisma";
import { PaginationArgs, PaginationResult, User } from "@/types";
import { Prisma } from "@prisma/client";

export const readUser = async ({
	id,
	isAlumni = false,
}: {
	id: string;
	isAlumni?: boolean;
}) => {
	let where: Prisma.UserWhereUniqueInput = { id: Number(id) };

	if (id.includes("@")) {
		where = { email: id };
	}

	const user = await prisma.user.findUnique({
		where,
		include: {
			alumni: isAlumni,
		},
	});

	return user;
};

export const createUser = async (
	user: Pick<
		User,
		"email" | "password" | "role" | "firstName" | "lastName" | "middleName"
	>
) => {
	const createdUser = await prisma.user.create({
		data: {
			email: user.email,
			role: user.role,
			firstName: user.firstName,
			lastName: user.lastName,
			middleName: user.middleName,
			password: user.password,
		},
	});

	return createdUser;
};

export const readUsers = async (
	{
		filter,
		order,
		orderBy,
		pagination,
		role = ["ADMIN", "ALUMNI"],
	}: PaginationArgs<never> = {},
	includeAlumni?: boolean
): Promise<
	PaginationResult<Omit<User, "password" | "notifications" | "alumni">>
> => {
	let where: Prisma.UserWhereInput = {};

	if (filter && typeof filter === "number") {
		where = {
			id: filter,
		};
	}

	if (typeof filter === "string") {
		where = {
			OR: [
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

	where.role = {
		in: role,
	};

	const users = await prisma.user.findMany({
		where,
		skip: pagination ? pagination.limit * pagination.page : undefined,
		take: pagination ? pagination.limit : undefined,
		omit: {
			password: true,
		},
		orderBy: orderBy ? { [orderBy]: order || "asc" } : { id: "asc" },
		include: {
			alumni: includeAlumni,
		},
	});

	const count = await prisma.user.count({ where });

	return {
		count,
		hasMore: users.length === pagination?.limit,
		data: users.map((user) => ({
			...user,
			alumni: user.alumni
				? { ...user.alumni, userId: user.id, interested: [], events: [] }
				: null,
			notifications: [],
		})),
	};
};

export const updateUserStatus = async (id: number, status: User["status"]) => {
	const updatedUser = await prisma.user.update({
		where: { id },
		data: { status },
	});

	return updatedUser;
};
