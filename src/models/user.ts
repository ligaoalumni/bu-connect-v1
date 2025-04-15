"use server";

import prisma from "@/lib/prisma";
import { PaginationArgs, PaginationResult, User, UserRole } from "@/types";
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
			alumni: {
				include: {
					alumni: isAlumni,
				},
			},
		},
	});

	return user;
};

export const createUser = async (
	user: Pick<
		User,
		"email" | "password" | "role" | "firstName" | "lastName" | "middleName"
	> & {
		alumniData?: { batchYear: number; lrn: string };
	}
) => {
	const createdUser = await prisma.user.create({
		data: {
			email: user.email,
			role: user.role,
			firstName: user.firstName,
			lastName: user.lastName,
			middleName: user.middleName,
			password: user.password,
			alumni: !!user.alumniData
				? {
						create: {
							email: user.email,
							firstName: user.firstName,
							lastName: user.lastName,
							graduationYear: user.alumniData.batchYear,
							lrn: user.alumniData.lrn,
							qrCode: "",
							middleName: user.middleName,
						},
				  }
				: undefined,
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
	}: PaginationArgs<never, UserRole> = {},
	includeAlumni?: boolean
): Promise<PaginationResult<Omit<User, "password" | "notifications">>> => {
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
				? {
						...user.alumni,
						major: user.alumni.major || "",
						userId: user.id,
						interested: [],
						events: [],
				  }
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

export const updateUser = async (
	id: number,
	data: Partial<
		Pick<
			User,
			"avatar" | "firstName" | "lastName" | "middleName" | "verifiedAt"
		>
	>
) => {
	const isExists = await prisma.user.findUnique({
		where: {
			id,
		},
	});

	if (!isExists) {
		throw new Error("Account not found!");
	}

	const updatedAccount = await prisma.user.update({
		data,
		where: { id },
	});

	if (!updatedAccount) {
		throw new Error("Failed to update account");
	}

	return updatedAccount;
};
