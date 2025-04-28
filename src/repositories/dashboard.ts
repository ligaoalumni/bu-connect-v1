"use server";

import prisma from "@/lib/prisma";
import { sub } from "date-fns";

export const readDashboardOverview = async () => {
	const totalAlumniRecords = await prisma.alumni.count();
	const totalAlumni = await prisma.alumniAccount.count();
	const totalEvents = await prisma.event.count();

	const lastMonth = await prisma.event.count({
		where: {
			createdAt: {
				gte: sub(new Date(), { months: 1 }),
			},
		},
	});

	const lastMonthAlumni = await prisma.alumniAccount.count({
		where: {
			createdAt: {
				gte: sub(new Date(), { months: 1 }),
			},
		},
	});

	const eventPercent = (lastMonth / totalEvents) * 100;
	const alumniPercent = (lastMonthAlumni / totalAlumni) * 100;
	const alumniRecordPercent = (lastMonth / totalAlumniRecords) * 100;

	return {
		alumni: {
			total: totalAlumni,
			percentage: isNaN(alumniPercent) ? 0 : alumniPercent,
		},
		alumniRecord: {
			total: totalAlumniRecords,
			percentage: isNaN(alumniRecordPercent) ? 0 : alumniRecordPercent,
		},
		events: {
			total: totalEvents || 0,
			percentage: isNaN(eventPercent) ? 0 : eventPercent,
		},
	};
};
