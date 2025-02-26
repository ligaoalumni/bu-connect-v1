"use server";

import { SignupFormSchema } from "@/lib/definitions";
import { createSession, decrypt, deleteSession, encrypt } from "@/lib/session";
import { createUser, readUser } from "@/models";
import { UserRole } from "@/types";
import * as bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
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

		const isExists = await readUser({ id: email });

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
			role: userRole,
		});

		if (!user) {
			throw new Error("An error occurred while creating your account.");
		}

		// TODO:
		// 4. Create user session
		const { email: userEmail, id, role } = user;
		const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
		const session = await encrypt({ id, role, email: userEmail, expiresAt });
		const cookieStore = await cookies();

		cookieStore.set("session", session, {
			httpOnly: true,
			secure: true,
			expires: expiresAt,
			sameSite: "lax",
			path: "/",
		});

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
		const user = await readUser({ id: email, isAlumni: true });

		if (!user) {
			return {
				error: { message: "User is not registered" },
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

		createSession({ email: userEmail, id, role, alumniId: user.alumni?.id });

		redirect("/");
	} catch (error) {
		console.log(`Error signing up: ${error}`);
		throw error;
	}
}

export async function logout() {
	try {
		await deleteSession();
		// Redirect after logout
		redirect("/");
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

	return await readUser({ id: session?.email, isAlumni: true });
}
