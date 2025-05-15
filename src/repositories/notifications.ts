"use server";

import prisma from "@/lib/prisma";
import { Notification } from "@prisma/client";

export const createNotifications = async (
	data: Array<Pick<Notification, "userId" | "message" | "link" | "type">>
) => {
	return await prisma.notification.createMany({
		data,
		skipDuplicates: true,
	});
};

export const updateNotification = async (
	notificationId: number,
	userId: number
) => {
	return await prisma.notification.updateMany({
		where: {
			userId,
			id: notificationId,
		},
		data: {
			readStatus: true,
		},
	});
};

export const getNotifications = async (userId: number) => {
	return await prisma.notification.findMany({
		where: {
			userId,
		},
		orderBy: {
			createdAt: "desc",
		},
	});
};
