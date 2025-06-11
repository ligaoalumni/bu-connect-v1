"use server";

import { resetPasswordEmailTemplate } from "@/constant";
import { prisma } from "@/lib";
import { transporter } from "@/lib/email";
import { addMinutes, isPast } from "date-fns";

const generateOTP = () => {
	// Generate a 6-digit OTP
	const newOTP = Math.floor(100000 + Math.random() * 900000).toString();
	return newOTP;
};

export const sentResetOTPToken = async (email: string) => {
	try {
		const token = generateOTP();
		const validUntil = addMinutes(new Date(), 5);

		const user = await prisma.user.findUnique({
			where: { email },
		});

		const existingToken = await prisma.token?.findFirst({
			where: {
				email,
			},
		});

		if (!user) {
			throw new Error("INTERNAL_SERVER_ERROR");
		}

		if (existingToken && !isPast(existingToken.validUntil)) {
			// Calculate remaining minutes until token expires
			const remainingMinutes = Math.ceil(
				(existingToken.validUntil.getTime() - Date.now()) / (1000 * 60)
			);
			throw new Error(
				`Please wait ${remainingMinutes} minutes before requesting a new token`
			);
		}

		const mailOptions = {
			from: process.env.EMAIL,
			sender: {
				name: "BU Connect",
				address: process.env.EMAIL!,
			},
			to: email,
			subject: "Password Reset Request",
			html: resetPasswordEmailTemplate(
				`${user.firstName} ${user.lastName}`,
				token
			),
		};

		await transporter.sendMail(mailOptions);
		// Create new token if none exists or existing is expired
		await prisma.token.upsert({
			create: {
				email,
				token,
				validUntil,
			},
			update: {
				token,
				validUntil,
			},
			where: {
				email,
			},
		});
	} catch (err) {
		throw new Error((err as Error).message);
	}
};
