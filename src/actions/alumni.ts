"use server";

import { AlumniSchema, prisma, transporter, generateEmailHTML } from "@/lib";
import { readUser } from "@/repositories";
import { AlumniFormData } from "@/types";
import { User } from "@prisma/client";

import { hash } from "bcryptjs";
import { getDay, getMonth, getYear } from "date-fns";
import { revalidatePath } from "next/cache";

export const addAlumniData = async (
	data: Pick<
		User,
		| "email"
		| "firstName"
		| "lastName"
		| "middleName"
		| "studentId"
		| "batch"
		| "birthDate"
	>
) => {
	try {
		const validated = AlumniSchema.safeParse({
			...data,
			birthDate: data.birthDate?.toISOString(),
		});

		if (!validated.success) {
			throw new Error("Invalid form fields");
		}

		const year = getYear(data.birthDate);
		const month = getMonth(data.birthDate) + 1; // Months are zero-indexed in JavaScript
		const day = getDay(data.birthDate);
		const password = `${data.lastName.toLowerCase()}${year}${month}${day}`;

		const hashedPassword = await hash(password, 10);

		const alumni = await prisma.user.create({
			data: {
				...data,
				middleName: data.middleName || "",
				password: hashedPassword,
				role: "ALUMNI",
			},
		});

		if (!alumni) {
			throw new Error("An error occurred while adding alumni data.");
		}

		const mailOptions = {
			from: process.env.EMAIL,
			sender: {
				name: "LNHS | Alumni Association",
				address: process.env.EMAIL!,
			},
			to: data.email,
			subject: "Account Credentials",
			html: generateEmailHTML(`
						<p>Hello ${alumni.firstName} ${alumni.lastName},</p>
		
						<p>Your alumni account has been created. Below are your login credentials:</p>

						<div class="credentials">
							<p><strong>Email:</strong> ${alumni.email}</p> 
							<p><strong>Password:</strong> Your initial password is your last name (all lowercase) followed by your birthdate in the format YYYYMMDD.</p>
						</div>

						<p><em>For example, if your last name is "Garcia" and your birthdate is January 15, 1990, your password would be "garcia19900115".</em></p>

						<p class="warning">Important: Please change your password immediately after your first login for security reasons.</p>

						<p>To access your account, please click the button below:</p>

						<a href="${process.env.CLIENT_URL}/login" target="_blank" class="button">Login to Your Account</a>

						<p>If you have any questions or need assistance, please contact our support team.</p>

						<p>Thank you,<br>The Team</p> 
					`),
		};

		await transporter.sendMail(mailOptions);

		revalidatePath("/alumni");
	} catch (err) {
		console.error(err);
		throw new Error((err as Error).message);
	}
};

export const updateAlumniRecord = async (id: number, data: AlumniFormData) => {
	try {
		const existingRecord = await prisma.user.findUnique({
			where: { id },
		});

		if (!existingRecord) {
			throw new Error("Alumni record not found.");
		}

		const isDataExists = await prisma.user.findFirst({
			where: {
				OR: [{ studentId: data.studentId }, { studentId: data.studentId }],
				NOT: {
					id,
				},
			},
		});

		// If LRN or studentId are modified, verify that no other record uses the same combination
		if (
			(existingRecord.studentId !== data.studentId &&
				isDataExists?.studentId === data.studentId) ||
			(existingRecord.studentId !== data.studentId &&
				isDataExists?.studentId === data.studentId)
		) {
			throw new Error("LRN or Student ID is already used by another record.");
		}

		const alumni = await prisma.user.update({
			where: { id },
			data: {
				...data,
				birthDate: new Date(data.birthDate),
			},
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

export const readAlumniAction = async (id: number) => {
	try {
		const alumni = await readUser(id);

		return alumni;
	} catch (err) {
		console.error(err);
		throw new Error((err as Error).message);
	}
};
