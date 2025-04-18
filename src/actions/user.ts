"use server";

import { transporter } from "@/lib/email";
import { generateEmailHTML } from "@/lib/generate-email";
import { encrypt } from "@/lib/session";
import {
	changeEmail,
	createUser,
	readUser,
	updatePassword,
	updateProfile,
	updateUser,
	updateUserStatus,
} from "@/models";
import { validateToken } from "@/models/token";
import { AdminFormData } from "@/types";
import type { UpdateProfileData, User } from "@/types";
import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

export const createAdmin = async (
	data: Pick<
		AdminFormData,
		"firstName" | "lastName" | "middleName" | "password" | "email" | "role"
	>
) => {
	try {
		// Your code here
		const isExists = await readUser({ id: data.email });

		if (isExists) {
			throw new Error("An admin with the same email address already exists.");
		}

		// e.g. Hash the user's password before storing it
		const hashedPassword = await bcrypt.hash(data.password, 10);

		const newAdmin = await createUser({
			...data,
			middleName: data.middleName || "",
			password: hashedPassword,
		});

		if (!newAdmin) {
			throw new Error("An error occurred while creating the admin.");
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
                <p>Hello ${data.firstName} ${data.lastName},</p>

                <p>Your administrator account has been created. Below are your login credentials:</p>

                <div class="credentials">
                    <p><strong>Email:</strong> ${data.email}</p>
                    <p><strong>Role:</strong> ${data.role}</p>
                    <p><strong>Temporary Password:</strong> ${data.password}</p>
                </div>

                <p class="warning">Important: Please change your password immediately after your first login for security
                    reasons.</p>

                <p>To access your account, please click the button below:</p>

                <a href="${process.env.CLIENT_URL}/login" target="_blank" class="button">Login to Your Account</a>

                <p>If you have any questions or need assistance, please contact our support team.</p>

                <p>Thank you,<br>The Team</p>    
            `),
		};

		await transporter.sendMail(mailOptions);
	} catch (err) {
		throw new Error(
			err instanceof Error
				? err.message
				: "An error occurred while creating the admin."
		);
	}
};

export const updateUserStatusAction = async (
	id: number,
	status: User["status"]
) => {
	await updateUserStatus(id, status);
	revalidatePath("/admin/list");
};

export const verifyAccount = async (
	userId: number,
	email: string,
	token: string
) => {
	try {
		const isValid = await validateToken(email, token);

		if (!isValid) {
			throw new Error("OTP is expired or invalid!");
		}

		const user = await updateUser(userId, { verifiedAt: new Date() });

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
	} catch (err) {
		throw new Error(
			err instanceof Error
				? err.message
				: "An error occurred while creating the admin."
		);
	}
};

export const updateProfileActions = async (
	id: number,
	data: UpdateProfileData,
	lrn?: string
) => {
	try {
		await updateProfile(id, data, lrn);

		revalidatePath(lrn ? "/profile" : "/admin/profile");
	} catch (err) {
		throw new Error(
			err instanceof Error
				? err.message
				: "An error occurred while creating the admin."
		);
	}
};

export const updatePasswordAction = async ({
	currentPassword,
	id,
	newPassword,
}: {
	id: number;
	currentPassword: string;
	newPassword: string;
}) => {
	try {
		await updatePassword({ currentPassword, id, newPassword });
	} catch (err) {
		throw new Error(
			err instanceof Error
				? err.message
				: "An error occurred while updating your password."
		);
	}
};

export const changeEmailAction = async ({ email }: { email: string }) => {
	try {
		await changeEmail({ email });
	} catch (err) {
		throw new Error(
			err instanceof Error
				? err.message
				: "An error occurred while sending OTP to your new email address."
		);
	}
};
