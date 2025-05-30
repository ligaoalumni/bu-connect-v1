"use server";

import { decrypt } from "@/lib";
import { readLoginLogs } from "@/repositories";
import { PaginationArgs } from "@/types";
import { cookies } from "next/headers";

export async function readLoginLogsAction(
	data: PaginationArgs<boolean, never> = {}
) {
	try {
		const cookieStore = await cookies();

		const session = await decrypt(cookieStore.get("session")?.value);

		if (session && session.role === "ALUMNI")
			throw new Error("Access denied: Alumni users cannot view login logs.");

		return await readLoginLogs(data);
	} catch (error) {
		throw new Error(
			error instanceof Error ? error.message : "Failed to fetch login logs"
		);
	}
}
