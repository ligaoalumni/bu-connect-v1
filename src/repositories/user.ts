"use server";

import { generateEmailHTML } from "@/lib/generate-email";
import prisma from "@/lib/prisma";
import {
	PaginationArgs,
	PaginationResult,
	UpdateProfileData,
	UserRole,
} from "@/types";
import { Prisma, User } from "@prisma/client";
import bcrypt from "bcryptjs";
import { addMinutes } from "date-fns";
import { transporter } from "@/lib/email";

const generateOTP = () => {
	// Generate a 6-digit OTP
	const newOTP = Math.floor(100000 + Math.random() * 900000).toString();
	return newOTP;
};

export const readUser = async (
	id: number,
	email?: string
): Promise<User | null> => {
	let where: Prisma.UserWhereUniqueInput = {
		id,
	};

	if (email) {
		where = {
			email,
		};
	}

	const user = await prisma.user.findUnique({
		where,
	});

	if (!user) return null;

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
		},
	});

	return createdUser;
};

export const readUsers = async ({
	filter,
	order,
	orderBy,
	pagination,
	role = ["ADMIN", "ALUMNI"],
}: PaginationArgs<never, UserRole> = {}): Promise<
	PaginationResult<Omit<User, "password" | "notifications">>
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
	});

	const count = await prisma.user.count({ where });

	return {
		count,
		hasMore: users.length === pagination?.limit,
		data: users.map((user) => ({
			...user,
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
		gender,
		jobTitle,
		lastName,
		middleName,
		nationality,
		occupation,
		religion,
	} = data;

	// Input validation
	if (!id) throw new Error("User ID is required.");
	if (!firstName || !lastName)
		throw new Error("First and last names are required.");

	let parsedBirthDate: Date | undefined = undefined;
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
					company,
					course,
					jobTitle,
					currentOccupation: occupation,
				},
			});
			if (!user) throw new Error("Failed to update user profile.");
		});
	} catch (error) {
		// Log the error (placeholder for actual logging)
		console.error("Transaction failed:", error);
		throw new Error(
			"An error occurred while updating the profile. Please try again later."
		);
	}
};

export const updatePassword = async ({
	currentPassword,
	id,
	newPassword,
}: {
	id: number;
	currentPassword: string;
	newPassword: string;
}) => {
	const user = await prisma.user.findUnique({
		where: { id },
		select: { password: true },
	});

	if (!user) throw new Error("User not found!");

	const isPasswordMatch = await bcrypt.compare(currentPassword, user.password);

	if (!isPasswordMatch) throw new Error("Current Password is incorrect!");

	const hashedPassword = await bcrypt.hash(newPassword, 10);

	await prisma.user.update({
		data: {
			password: hashedPassword,
		},
		where: { id },
	});
};

export const changeEmail = async ({ email }: { email: string }) => {
	const isEmailExists = await prisma.user.findUnique({ where: { email } });

	if (isEmailExists) throw new Error("Email is already use");

	const token = generateOTP();
	const validUntil = addMinutes(new Date(), 5);

	const mailOptions = {
		from: process.env.EMAIL,
		sender: {
			name: "LNHS | Alumni Association",
			address: process.env.EMAIL!,
		},
		to: email,
		subject: "Verify Your New Email Address",
		html: generateEmailHTML(`
			<p>Hello,</p>

			<p>You have requested to change your email address. Please use the verification code below to confirm your new email:</p>

			<div style="background-color: #f4f4f4; padding: 20px; margin: 20px 0; text-align: center; font-size: 24px; letter-spacing: 5px; font-weight: bold;">
				${token}
			</div>

			<p>This code will expire in 5 minutes.</p>

			<p class="warning">Important: Never share this code with anyone. Our team will never ask for your verification code.</p>

			<p>If you did not request this change, please contact our support immediately.</p>

			<p>Thank you,<br>The Team</p>
		`),
	};

	await prisma.token.upsert({
		create: {
			email,
			token,
			validUntil,
		},
		update: {
			token,
			validUntil,
		},
		where: {
			email,
		},
	});

	await transporter.sendMail(mailOptions);
};

export const updateEmail = async (id: number, email: string) => {
	return await prisma.user.update({
		where: {
			id,
		},
		data: { email },
	});
};
