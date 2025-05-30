"use server";

import { prisma, transporter, generateEmailHTML } from "@/lib";
import { addMinutes, isPast } from "date-fns";

const generateOTP = () => {
	// Generate a 6-digit OTP
	const newOTP = Math.floor(100000 + Math.random() * 900000).toString();
	return newOTP;
};

export const createToken = async (email: string) => {
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
				name: "LNHS | Alumni Association",
				address: process.env.EMAIL!,
			},
			to: email,
			subject: "Account Credentials",
			html: generateEmailHTML(`
                <p>Hello ${user.firstName} ${user.lastName},</p>

                <p>Your verification code is:</p>

                <div style="background-color: #f4f4f4; padding: 20px; margin: 20px 0; text-align: center; font-size: 24px; letter-spacing: 5px; font-weight: bold;">
                    ${token}
                </div>

                <p>This code will expire in 5 minutes.</p>

                <p class="warning">Important: Never share this code with anyone. Our team will never ask for your verification code.</p>

                <p>If you didn't request this code, please ignore this email.</p>

                <p>Thank you,<br>The Team</p>
            `),
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

export const validateToken = async (email: string, token: string) => {
	const existingToken = await prisma.token.findUnique({
		where: { email },
	});

	if (!existingToken) {
		return false;
	}

	if (isPast(existingToken.validUntil)) {
		// Token has expired
		return false;
	}

	return existingToken.token === token;
};
