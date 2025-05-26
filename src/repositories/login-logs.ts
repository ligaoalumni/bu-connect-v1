"use server";

import { UAParser } from "ua-parser-js";
import { headers } from "next/headers";
import prisma from "@/lib/prisma";

export async function logLoginAttempt(email: string, success = false) {
	// Get headers from the incoming request
	const reqHeaders = await headers();

	// Extract IP Address
	const ipAddress =
		reqHeaders.get("x-forwarded-for")?.split(",")[0] || // Client IP (if behind proxy)
		reqHeaders.get("host"); // Fallback to host

	// Extract User Agent
	const userAgent = reqHeaders.get("user-agent");

	// Parse User Agent using UAParser
	const parser = new UAParser(userAgent || "");
	const deviceInfo = parser.getResult();

	await prisma.loginLog.create({
		data: {
			email,
			ipAddress: ipAddress || "Unknown",
			userAgent: userAgent || "Unknown",
			status: success,
			device: deviceInfo.device?.model || "Unknown",
			os: deviceInfo.os?.name || "Unknown",
			browser: deviceInfo.browser?.name || "Unknown",
		},
	});
}
