"use server";

import { SignupFormSchema } from "@/lib/definitions";
import { decrypt, deleteSession, encrypt } from "@/lib/session";
import { createUser, readUser } from "@/repositories";
import { UserRole } from "@/types";
import * as bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { z } from "zod";

export async function signUpAction(
	formData: z.infer<typeof SignupFormSchema>,
	userRole: UserRole = "ALUMNI"
) {
	try {
		const validatedFields = SignupFormSchema.safeParse(formData);

		// If any form fields are invalid, return early
		if (!validatedFields.success) {
			throw new Error("Invalid form fields");
		}

		// 2. Prepare data for insertion into database
		const { email, password, firstName, lastName, batchYear, lrn } =
			validatedFields.data;

		const isExists = await readUser(-1, email);

		if (isExists) {
			throw new Error("User already exists");
		}

		// e.g. Hash the user's password before storing it
		const hashedPassword = await bcrypt.hash(password, 10);

		// 3. Insert the user into the database or call an Auth Library's API
		const user = await createUser({
			email,
			password: hashedPassword,
			firstName,
			lastName,
			middleName: validatedFields.data.middleName || "",
			role: userRole,
			alumniData: {
				batchYear: Number(batchYear),
				lrn,
			},
		});

		if (!user) {
			throw new Error("An error occurred while creating your account.");
		}

		return user;
	} catch (error) {
		console.log(`Error signing up: ${error}`);
		if (error instanceof Error) {
			throw error;
		} else {
			throw new Error("An error occurred while creating your account.");
		}
	}
}

export async function loginAction(email: string, password: string) {
	try {
		const user = await readUser(-1, email);

		if (!user) {
			return {
				error: { message: "User is not registered" },
			};
		}

		if (user.status === "DELETED" || user.status === "BLOCKED") {
			return {
				error: {
					message:
						"Your account has been suspended. Please contact support for assistance.",
				},
			};
		}

		if (user.status === "PENDING" && user.role === "ALUMNI") {
			return {
				error: {
					isPending: true,
					message:
						"Your account is pending for admin verification. Please wait for approval.",
				},
			};
		}

		const passwordMatch = await bcrypt.compare(password, user.password);

		if (!passwordMatch) {
			return {
				error: { message: "Invalid password" },
			};
		}

		// Create user session
		const { email: userEmail, id, role } = user;
		const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
		const session = await encrypt({
			id,
			role,
			email: userEmail,
			expiresAt,
			verified: !!user.verifiedAt,
		});
		const cookieStore = await cookies();

		cookieStore.set("session", session, {
			httpOnly: true,
			secure: true,
			expires: expiresAt,
			sameSite: "lax",
			path: "/",
		});
	} catch (error) {
		console.log(`Error signing up: ${error}`);
		throw error;
	}
}

export async function logout() {
	try {
		await deleteSession();
	} catch (error) {
		console.log(`Error logging out: ${error}`);
		throw error;
	}
}

export async function getInformation(
	{
		isAlumni,
	}: {
		isAlumni: boolean;
	} = { isAlumni: true }
) {
	const cookieStore = await cookies();

	const session = await decrypt(cookieStore.get("session")?.value);

	if (!session) {
		return null;
	}

	return await readUser(-1, session.email);
}
