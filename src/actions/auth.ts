"use server";

import { SignupFormSchema } from "@/lib/definitions";
import prisma from "@/lib/prisma";
import { createSession, deleteSession } from "@/lib/session";
import { readUser } from "@/models";
import { UserRole } from "@/types";
import * as bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { z } from "zod";

export async function signup(
	formData: z.infer<typeof SignupFormSchema>,
	userRole: UserRole = "ALUMNI"
) {
	try {
		const validatedFields = SignupFormSchema.safeParse(formData);

		// If any form fields are invalid, return early
		if (!validatedFields.success) {
			return {
				errors: validatedFields.error.flatten().fieldErrors,
			};
		}

		// 2. Prepare data for insertion into database
		const { email, password } = validatedFields.data;
		// e.g. Hash the user's password before storing it
		const hashedPassword = await bcrypt.hash(password, 10);

		// 3. Insert the user into the database or call an Auth Library's API
		const user = await prisma.user.create({
			data: {
				email,
				password: hashedPassword,
				role: userRole,
			},
		});

		if (!user) {
			return {
				message: "An error occurred while creating your account.",
			};
		}

		// TODO:
		// 4. Create user session
		const { email: userEmail, id, role } = user;

		console.log(user);

		createSession({ email: userEmail, id, role });

		redirect("/");
	} catch (error) {
		console.log(`Error signing up: ${error}`);
		throw error;
	}
}

export async function login(email: string, password: string) {
	try {
		const user = await readUser({ id: email });

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

		createSession({ email: userEmail, id, role });

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
