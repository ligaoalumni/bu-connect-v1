"use server";

import prisma from "@/lib/prisma";
import {
	PaginationArgs,
	PaginationResult,
	UpdateProfileData,
	User,
	UserRole,
} from "@/types";
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

export const updateProfile = async (
	id: number,
	lrn: string,
	data: UpdateProfileData
): Promise<void> => {
	const {
		address,
		avatar,
		birthDate,
		company,
		contactNumber,
		course,
		firstName,
		furtherEducation,
		gender,
		jobTitle,
		lastName,
		middleName,
		nationality,
		occupation,
		religion,
		schoolName,
	} = data;

	// Input validation
	if (!id) throw new Error("User ID is required.");
	if (!lrn) throw new Error("LRN is required.");
	if (!firstName || !lastName)
		throw new Error("First and last names are required.");

	let parsedBirthDate: Date | null = null;
	if (birthDate) {
		parsedBirthDate = new Date(birthDate);
		if (isNaN(parsedBirthDate.getTime())) {
			throw new Error("Invalid birth date format.");
		}
	}

	try {
		await prisma.$transaction(async (tx) => {
			// Update user details
			const user = await tx.user.update({
				where: { id },
				data: {
					avatar,
					religion,
					address,
					birthDate: parsedBirthDate,
					contactNumber,
					firstName,
					middleName,
					lastName,
					nationality,
					gender,
				},
			});
			if (!user) throw new Error("Failed to update user profile.");

			// Update alumni account
			const alumniAccount = await tx.alumniAccount.update({
				where: { lrn },
				data: {
					firstName,
					middleName,
					lastName,
				},
			});
			if (!alumniAccount) throw new Error("Failed to update profile.");

			// Update alumni details
			const alumni = await tx.alumni.update({
				where: { lrn },
				data: {
					companyName: company,
					course,
					furtherEducation,
					jobTitle,
					schoolName,
					status: occupation,
				},
			});
			if (!alumni) throw new Error("Failed to update profile.");
		});
	} catch (error) {
		// Log the error (placeholder for actual logging)
		console.error("Transaction failed:", error);
		throw new Error(
			"An error occurred while updating the profile. Please try again later."
		);
	}
};
