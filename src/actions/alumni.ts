"use server";

import { AlumniSchema } from "@/lib/definitions";
import prisma from "@/lib/prisma";
import { Alumni } from "@prisma/client";
import { revalidatePath } from "next/cache";

export const addAlumniData = async (
	data: Omit<Alumni, "createdAt" | "updatedAt" | "alumniId" | "id" | "alumni">
) => {
	try {
		const validated = AlumniSchema.safeParse({
			...data,
			birthDate: data.birthDate.toISOString(),
		});

		if (!validated.success) {
			throw new Error("Invalid form fields");
		}

		const alumni = await prisma.alumni.create({
			data: {
				...data,
				middleName: data.middleName || "",
			},
		});

		if (!alumni) {
			throw new Error("An error occurred while adding alumni data.");
		}

		revalidatePath("/alumni");
	} catch (err) {
		console.error(err);
		throw new Error((err as Error).message);
	}
};

export const updateAlumniData = async (data: {
	lrn: string;
	userId: number;
}) => {
	try {
		const alumni = await prisma.alumni.update({
			where: { lrn: data.lrn },
			data: {
				alumniAccount: {
					connect: {
						id: data.userId,
					},
				},
			},
		});

		if (!alumni) {
			throw new Error("An error occurred while updating alumni data.");
		}

		revalidatePath("/alumni");
	} catch (err) {
		console.error(err);
		throw new Error("INTERNAL_SERVER_ERROR");
	}
};

export const verifyAlumniAccount = async (
	alumniAccountId: number,
	alumniRecordId: number
) => {
	try {
		const isAccountAlreadyAssociated = await prisma.alumni.findFirst({
			where: {
				alumniAccount: {
					id: alumniAccountId,
				},
				id: alumniRecordId,
			},
		});

		if (isAccountAlreadyAssociated)
			throw new Error("Alumni already associated with other account.");

		await prisma.alumniAccount.update({
			data: {
				alumni: {
					connect: {
						id: alumniRecordId,
					},
				},
			},
			where: {
				id: alumniAccountId,
			},
		});

		revalidatePath("/admin/alumni");
	} catch (err) {
		console.error(err);
		throw new Error(
			err instanceof Error ? err.message : "INTERNAL_SERVER_ERROR"
		);
	}
};
