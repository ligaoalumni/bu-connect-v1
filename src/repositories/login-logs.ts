"use server";

import { UAParser } from "ua-parser-js";
import { headers } from "next/headers";
import { prisma } from "@/lib";
import { PaginationArgs, PaginationResult } from "@/types";
import { LoginLog, Prisma } from "@prisma/client";

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

export const readLoginLogs = async ({
	pagination,
	filter,
	status,
	order,
	orderBy,
}: PaginationArgs<boolean, never> = {}): Promise<
	PaginationResult<LoginLog>
> => {
	let where: Prisma.LoginLogWhereInput = {};

	if (typeof filter === "string") {
		where = { email: { contains: filter, mode: "insensitive" } };
	}

	if (status && status.length > 0) {
		where = {
			status: {
				equals: status[0],
			},
		};
	}

	const logs = await prisma.loginLog.findMany({
		where,
		skip: pagination ? pagination.limit * pagination.page : undefined,
		take: pagination ? pagination.limit : undefined,
		orderBy: orderBy ? { [orderBy]: order || "asc" } : { id: "asc" },
	});

	const count = await prisma.loginLog.count({ where });

	return {
		count,
		hasMore: logs.length === pagination?.limit,
		data: logs,
	};
};
