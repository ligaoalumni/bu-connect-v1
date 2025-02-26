import prisma from "@/lib/prisma";
import { User } from "@/types";
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
	user: Pick<User, "email" | "password" | "role" | "firstName" | "lastName">
) => {
	const createdUser = await prisma.user.create({
		data: {
			email: user.email,
			role: user.role,
			firstName: user.firstName,
			lastName: user.lastName,
			password: user.password,
		},
	});

	return createdUser;
};
