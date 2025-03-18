"use server";

import { transporter } from "@/lib/email";
import { generateEmailHTML } from "@/lib/generate-email";
import { createUser, readUser } from "@/models";
import { AdminFormData } from "@/types";
import bcrypt from "bcryptjs";

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
