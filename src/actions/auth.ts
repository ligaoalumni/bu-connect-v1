"use server";

import { SignupFormSchema } from "@/lib";
import { decrypt, deleteSession, encrypt } from "@/lib/session";
import {
	createUser,
	logLoginAttempt,
	readUser,
	updateResetPassword,
	validateToken,
} from "@/repositories";
import { sendResetOTPToken } from "@/repositories";
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
		const { email, password, firstName, lastName } = validatedFields.data;

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
			// TODO: TO FIX
			birthDate: new Date(),
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
			await logLoginAttempt(email, false);
			return {
				error: { message: "User is not registered" },
			};
		}

		if (user.status === "DELETED" || user.status === "BLOCKED") {
			await logLoginAttempt(email, false);
			return {
				error: {
					message:
						"Your account has been suspended. Please contact support for assistance.",
				},
			};
		}

		if (user.status === "PENDING" && user.role === "ALUMNI") {
			await logLoginAttempt(email, false);
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
			await logLoginAttempt(email, false);
			return {
				error: { message: "Invalid password" },
			};
		}

		// Create user session
		const { email: userEmail, id, role } = user;
		const expiresAt = new Date();
		expiresAt.setDate(expiresAt.getDate() + 7);
		const session = await encrypt({
			id,
			role,
			email: userEmail,
			expiresAt,
			verified: !!user.verifiedAt,
		});
		const cookieStore = await cookies();

		await logLoginAttempt(email, true);
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

export async function getInformation() {
	const cookieStore = await cookies();

	const session = await decrypt(cookieStore.get("session")?.value);

	if (!session) {
		return null;
	}

	return await readUser(-1, session.email);
}

export async function sendPasswordRequestTokenAction(email: string) {
	try {
		await sendResetOTPToken(email);
	} catch (err) {
		throw new Error((err as Error).message);
	}
}

export async function validateResetTokenAction(email: string, token: string) {
	try {
		const isTokenValid = await validateToken(email, token);

		if (!isTokenValid) throw new Error("Token is invalid or expired");

		return true;
	} catch (err) {
		throw new Error((err as Error).message);
	}
}

export async function updateResetPasswordAction(
	email: string,
	password: string
) {
	try {
		const user = await readUser(-1, email);

		if (!user) {
			throw new Error("User not found");
		}

		await updateResetPassword({
			email,
			newPassword: password,
		});

		return true;
	} catch (error) {
		console.log(`Error updating password: ${error}`);
		throw error;
	}
}
