"use server";
import { createClient } from "@/lib";
import { v4 as uuidv4 } from "uuid";

export const uploadImageAction = async (
	file: File,
	storage = "event_covers"
) => {
	const db = await createClient();

	try {
		const name = `${file.name}-${uuidv4()}`;
		const { data } = await db.storage.from(storage).upload(name, file, {
			cacheControl: "3600",
			upsert: false,
		});
		if (data === null) {
			return console.error("No data");
		}
		const response = await db.storage.from(storage).getPublicUrl(data.path);
		if (response.data.publicUrl === null) {
			return console.error("No data");
		}
		return response.data.publicUrl;
	} catch (error) {
		console.error(error);
	}
};

export const uploadAvatarImageAction = async (file: File) => {
	const db = await createClient();

	try {
		const name = `${file.name}-${uuidv4()}`;
		const { data } = await db.storage.from("avatars").upload(name, file, {
			cacheControl: "3600",
			upsert: false,
		});
		if (data === null) {
			return console.error("No data");
		}
		const response = await db.storage.from("avatars").getPublicUrl(data.path);
		if (response.data.publicUrl === null) {
			return console.error("No data");
		}
		return response.data.publicUrl;
	} catch (error) {
		console.error(error);
	}
};
