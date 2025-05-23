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

export const updateAllNotification = async (userId: number) => {
	return await prisma.notification.updateMany({
		where: {
			userId,
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

export const deleteNotification = async (
	notificationId: number,
	userId: number
) => {
	return await prisma.notification.delete({
		where: {
			userId,
			id: notificationId,
		},
	});
};

export const deleteAllNotifications = async (userId: number) => {
	return await prisma.notification.deleteMany({
		where: {
			userId,
		},
	});
};
