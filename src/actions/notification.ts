"use server";

import { decrypt } from "@/lib/session";
import {
	deleteAllNotifications,
	deleteNotification,
	getNotifications,
	updateAllNotification,
	updateNotification,
} from "@/repositories";
import { cookies } from "next/headers";

export const readNotificationsAction = async () => {
	try {
		const cookieStore = await cookies();

		const session = await decrypt(cookieStore.get("session")?.value);

		if (!session?.id) throw new Error("UnAuthorized!");

		return await getNotifications(session.id);
	} catch (error) {
		console.log(error);
		throw new Error("Failed to fetch notifications");
	}
};

export const updateNotificationStatusAction = async (id: number) => {
	try {
		const cookieStore = await cookies();

		const session = await decrypt(cookieStore.get("session")?.value);

		if (!session?.id) throw new Error("UnAuthorized!");

		return await updateNotification(id, session.id);
	} catch (error) {
		console.log(error);
		throw new Error("Failed to update notification");
	}
};

export const deleteNotificationAction = async (id: number) => {
	try {
		const cookieStore = await cookies();

		const session = await decrypt(cookieStore.get("session")?.value);

		if (!session?.id) throw new Error("UnAuthorized!");

		return await deleteNotification(id, session.id);
	} catch (error) {
		console.log(error);
		throw new Error("Failed to delete notification");
	}
};

export const deleteAllNotificationAction = async () => {
	try {
		const cookieStore = await cookies();

		const session = await decrypt(cookieStore.get("session")?.value);

		if (!session?.id) throw new Error("UnAuthorized!");

		return await deleteAllNotifications(session.id);
	} catch (error) {
		console.log(error);
		throw new Error("Failed to delete all notification");
	}
};

export const updateAllNotificationStatusAction = async () => {
	try {
		const cookieStore = await cookies();

		const session = await decrypt(cookieStore.get("session")?.value);

		if (!session?.id) throw new Error("UnAuthorized!");

		return await updateAllNotification(session.id);
	} catch (error) {
		console.log(error);
		throw new Error("Failed to update all notification");
	}
};
