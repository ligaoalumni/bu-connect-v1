"use server";
import { createClient } from "@/lib/supabase";
import { v4 as uuidv4 } from "uuid";

export const uploadImageAction = async (file: File) => {
	const db = await createClient();

	try {
		const name = `${file.name}-${uuidv4()}`;
		const { data } = await db.storage.from("event_covers").upload(name, file, {
			cacheControl: "3600",
			upsert: false,
		});
		if (data === null) {
			return console.error("No data");
		}
		const response = await db.storage
			.from("event_covers")
			.getPublicUrl(data.path);
		if (response.data.publicUrl === null) {
			return console.error("No data");
		}
		return response.data.publicUrl;
	} catch (error) {
		console.error(error);
	}
};
