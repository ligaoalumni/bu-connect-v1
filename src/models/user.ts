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
	user: Pick<User<never>, "email" | "password" | "role">
) => {
	const createdUser = await prisma.user.create({
		data: {
			email: user.email,
			role: "ADMIN",
			password: user.password,
		},
	});

	return createdUser;
};
