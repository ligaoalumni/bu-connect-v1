"use server";

import { AlumniSchema } from "@/lib/definitions";
import prisma from "@/lib/prisma";
import { AlumniFormData } from "@/types";
import { Alumni } from "@prisma/client";
import { revalidatePath } from "next/cache";

export const addAlumniData = async (
	data: Pick<
		Alumni,
		| "birthDate"
		| "strand"
		| "educationLevel"
		| "firstName"
		| "lastName"
		| "middleName"
		| "studentId"
		| "graduationYear"
		| "lrn"
	>
) => {
	try {
		const validated = AlumniSchema.safeParse({
			...data,
			birthDate: data.birthDate.toISOString(),
		});

		console.log(data, "data");

		if (!validated.success) {
			throw new Error("Invalid form fields");
		}

		console.log(data, "qqq");

		const alumni = await prisma.alumni.create({
			data: {
				...data,
				middleName: data.middleName || "",
				strand: data.strand ? data.strand : null,
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

export const updateAlumniRecord = async (id: number, data: AlumniFormData) => {
	try {
		const existingRecord = await prisma.alumni.findUnique({
			where: { id },
		});

		if (!existingRecord) {
			throw new Error("Alumni record not found.");
		}

		const isDataExists = await prisma.alumni.findFirst({
			where: {
				OR: [{ lrn: data.lrn }, { studentId: data.studentId }],
				NOT: {
					id,
				},
			},
		});

		// If LRN or studentId are modified, verify that no other record uses the same combination
		if (
			(existingRecord.lrn !== data.lrn && isDataExists?.lrn === data.lrn) ||
			(existingRecord.studentId !== data.studentId &&
				isDataExists?.studentId === data.studentId)
		) {
			throw new Error("LRN or Student ID is already used by another record.");
		}

		const alumni = await prisma.alumni.update({
			where: { id },
			data: { ...data, birthDate: new Date(data.birthDate) },
		});

		if (!alumni) {
			throw new Error("An error occurred while updating alumni data.");
		}
	} catch (err) {
		throw new Error(
			err instanceof Error ? err.message : "INTERNAL_SERVER_ERROR"
		);
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
				user: {
					update: {
						status: "ACTIVE",
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
