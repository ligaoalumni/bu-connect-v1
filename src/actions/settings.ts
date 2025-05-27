"use server";

import { decrypt } from "@/lib/session";
import { getSettings, updateSettings } from "@/repositories";
import { cookies } from "next/headers";

export async function readSettingsAction() {
	try {
		return await getSettings();
	} catch (error) {
		throw new Error(
			error instanceof Error ? error.message : "Failed to fetch settings"
		);
	}
}

export async function updateSettingsAction(data: {
	websiteName?: string;
	description?: string;
	isMaintenance?: boolean;
}) {
	try {
		const cookieStore = await cookies();

		const session = await decrypt(cookieStore.get("session")?.value);

		if (!session?.id) throw new Error("Unauthorized!");

		return await updateSettings({
			createdById: session.id,
			...data,
		});
	} catch (error) {
		throw new Error(
			error instanceof Error ? error.message : "Failed to update settings"
		);
	}
}
