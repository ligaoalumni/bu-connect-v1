"use server";

import prisma from "@/lib/prisma";

export async function getSettings() {
	return prisma.setting.findFirst({
		orderBy: {
			createdAt: "desc",
		},
	});
}

export async function updateSettings({
	createdById,
	description,
	isMaintenance,
	websiteName,
}: {
	websiteName?: string;
	description?: string;
	isMaintenance?: boolean;
	createdById: number;
}) {
	return await prisma.setting.create({
		data: {
			createdBy: {
				connect: {
					id: createdById,
				},
			},
			isMaintenance,
			description,
			websiteName,
		},
	});
}
