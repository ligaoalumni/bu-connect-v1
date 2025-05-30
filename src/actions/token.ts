"use server";

import { encrypt } from "@/lib";
import { updateEmail, validateToken } from "@/repositories";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

export const validateTokenAction = async ({
	email,
	otp,
	id,
}: {
	email: string;
	otp: string;
	id: number;
}) => {
	try {
		const isTokenValid = await validateToken(email, otp);

		if (!isTokenValid) throw new Error("Token is invalid or expired");

		const user = await updateEmail(id, email);

		// Create user session
		const { email: userEmail, id: userId, role } = user;
		const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
		const session = await encrypt({
			id: userId,
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

		revalidatePath(user.role === "ALUMNI" ? "/profile" : "/admin/profile");

		return true;
	} catch (err) {
		throw new Error(
			err instanceof Error
				? err.message
				: "An error occurred while sending OTP to your new email address."
		);
	}
};
