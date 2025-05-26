"use server";

import { readLoginLogs } from "@/repositories";
import { PaginationArgs } from "@/types";

export async function readLoginLogsAction(
	data: PaginationArgs<boolean, never> = {}
) {
	try {
		const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/login-logs`, {
			next: { revalidate: 60 },
		});

		if (!res.ok) throw new Error("Failed to fetch login logs");
		return await readLoginLogs(data);
	} catch (error) {
		throw new Error(
			error instanceof Error ? error.message : "Failed to fetch login logs"
		);
	}
}
