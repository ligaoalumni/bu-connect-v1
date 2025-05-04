"use server";

import prisma from "@/lib/prisma";

import {
	Attendant,
	DashboardEvent,
	Event,
	EventComment,
	EventPartialRelation,
	Events,
	EventStatus,
	EventWithPagination,
	PaginationArgs,
	PaginationResult,
	TEventPagination,
} from "@/types";
import { Prisma } from "@prisma/client";
import { format, isFuture } from "date-fns";
import slug from "unique-slug";

export const readEvent = async (
	slug: string | number
): Promise<EventPartialRelation | null> => {
	let where: Prisma.EventWhereUniqueInput = { id: Number(slug) };

	if (typeof slug === "string") {
		where = { slug };
	}

	const event = await prisma.event.findUnique({
		where,
		include: {
			interested: {
				select: {
					firstName: true,
					lastName: true,
					email: true,
					id: true,
				},
			},
			alumni: {
				select: {
					firstName: true,
					lastName: true,
					email: true,
					id: true,
				},
			},
		},
	});

	if (!event) return null;

	return {
		...event,
		coverImg: event.coverImg || "",
	};
};

export const createEvent = async (
	data: Omit<
		Event,
		"id" | "createdAt" | "updatedAt" | "interested" | "alumni" | "slug"
	>
) => {
	const timestamp = Date.now(); // current timestamp
	const randomPart = Math.random().toString(36).substring(2, 10); // random string (base 36)
	const name = data.name.toLowerCase().replace(/ /g, "-");
	const generatedSlug = slug(name);

	const createdEvent = await prisma.event.create({
		data: {
			...data,
			endDate: data.endDate || data.startDate,
			slug: `${name}-${timestamp}-${randomPart}-${generatedSlug}`,
			// slug: "test-7-1740444042069-yoje5jym-394d791c",
		},
	});

	return createdEvent;
};

export const readEvents = async ({
	filter,
	pagination,
	order,
	orderBy,
	status,
}: PaginationArgs<EventStatus, never> = {}): Promise<
	PaginationResult<EventWithPagination>
> => {
	let where: Prisma.EventWhereInput = {};

	if (filter && typeof filter === "number") {
		where = {
			id: filter,
		};
	}

	if (status && status?.includes("Ongoing Event")) {
		where = {
			...where,
			OR: [
				{
					startDate: {
						lte: new Date(),
					},
					endDate: {
						gte: new Date(),
					},
				},
			],
		};
	} else if (status && status?.includes("Upcoming Event")) {
		where = {
			...where,
			startDate: {
				gt: new Date(),
			},
		};
	} else if (status && status?.includes("Past Event")) {
		where = {
			...where,
			OR: [
				{
					endDate: {
						lt: new Date(),
					},
				},
			],
		};
	}

	if (typeof filter === "string") {
		where = {
			OR: [{ name: { contains: filter, mode: "insensitive" } }],
		};
	}

	const events = await prisma.event.findMany({
		where,
		skip: pagination ? pagination.limit * pagination.page : undefined,
		take: pagination ? pagination.limit : undefined,
		orderBy: orderBy ? { [orderBy]: order || "asc" } : { id: "asc" },
		include: {
			alumni: true,
			interested: true,
			_count: {
				select: {
					interested: true,
					alumni: true,
					comments: true,
				},
			},
		},
	});

	const count = await prisma.event.count({ where });

	return {
		count,
		hasMore: events.length === pagination?.limit,
		data: events.map((event) => ({
			...event,
			alumni: event.alumni,
			interested: event.interested,
			_count: {
				interested: event._count.interested,
				alumni: event._count.alumni,
				comments: event._count.comments,
			},
			coverImg: event.coverImg || "",
		})),
	};
};

export const updateEvent = async (
	data: Omit<
		Event,
		"createdAt" | "updatedAt" | "interested" | "alumni" | "slug"
	>
) => {
	const isExists = await prisma.event.findUnique({
		where: { id: data.id },
	});

	if (!isExists) {
		throw new Error("Event not found");
	}

	let generatedSlug: string | undefined = undefined;

	if (isExists.name !== data.name) {
		const timestamp = Date.now(); // current timestamp
		const randomPart = Math.random().toString(36).substring(2, 10); // random string (base 36)
		const name = data.name.toLowerCase().replace(/ /g, "-");
		generatedSlug = `${name}-${timestamp}-${randomPart}-${slug(name)}`;
	}

	const updatedEvent = await prisma.event.update({
		data: {
			...data,
			endDate: data.endDate || data.startDate,
			slug: generatedSlug,
		},
		where: {
			id: isExists.id,
		},
	});

	return updatedEvent;
};

export const getDisabledEvents = async (): Promise<Events> => {
	const allEvents = await readEvents();
	const futureEvents = allEvents.data.filter((event) =>
		isFuture(event.startDate)
	);

	const setTimeOnDate = (date: Date, timeString: string) => {
		// Split the timeString into hours and minutes
		const [hours, minutes] = timeString.split(":").map(Number);

		// Set the hours and minutes on the provided date
		date.setHours(hours, minutes, 0, 0); // Set hours, minutes, seconds, and milliseconds to 0
		return date;
	};

	return futureEvents.map((event) => {
		// Start Date & Time
		const start = setTimeOnDate(
			event.startDate,
			format(event.startTime, "HH:mm")
		);

		// End Date & Time
		const endDate = event.endDate || event.startDate; // Use startDate if no endDate is provided
		const end = setTimeOnDate(endDate, format(event.endTime, "HH:mm"));

		const color = `hsl(${Math.floor(Math.random() * 360)}, 70%, 70%)`;

		return {
			id: event.slug,
			start,
			end,
			location: event.location,
			title: event.name,
			backgroundColor: color,
			borderColor: color,
		};
	});
};

export const readOngoingEvent = async () => {
	const event = await prisma.event.findFirst({
		where: {
			startDate: {
				lte: new Date(),
			},
			endDate: {
				gte: new Date(),
			},
		},

		include: {
			alumni: true,
			interested: true,
			_count: {
				select: {
					interested: true,
					alumni: true,
					comments: true,
				},
			},
		},
	});

	const upcomingEvent = await prisma.event.findFirst({
		where: {
			startDate: {
				gt: new Date(),
			},
		},
		orderBy: {
			startDate: "asc",
		},
		include: {
			alumni: true,
			interested: true,
			_count: {
				select: {
					interested: true,
					alumni: true,
					comments: true,
				},
			},
		},
	});

	return {
		ongoing: event ? formatDashboardEvent(event) : null,
		nextEvent: upcomingEvent ? formatDashboardEvent(upcomingEvent) : null,
	};
};

function formatDashboardEvent(event: EventWithPagination): DashboardEvent {
	let oneDay = false;

	if (event && event.startDate === event.endDate) {
		oneDay = true;
	} else {
		oneDay = false;
	}

	return {
		id: event.id,
		slug: event.slug,
		name: event.name,
		location: event.location,
		attendees: event._count.alumni,
		time: `${format(event.startTime, "h:mm a")} - ${format(
			event.endTime,
			"h:mm a"
		)}`,
		date: oneDay
			? format(event.startDate, "MMMM d, yyyy")
			: `${format(event.startDate, "MMMM d ")} - ${format(
					event.endDate || event.startDate,
					"MMMM d, yyyy"
			  )}`,
	};
}

export const addEventAttendant = async ({
	id,
	eventId,
}: {
	eventId: number;
	id: number;
}) => {
	return await prisma.$transaction(async (tx) => {
		const attendantAlreadyExists = await tx.event.findFirst({
			where: {
				id: eventId,
				alumni: {
					some: {
						id,
					},
				},
			},
		});

		if (attendantAlreadyExists) {
			throw new Error("Attendant already exists");
		}

		await tx.event.update({
			data: {
				alumni: {
					connect: {
						id,
					},
				},
			},
			where: {
				id: eventId,
			},
		});
	});
};

export const readAttendants = async ({
	slug,
	pagination,
}: TEventPagination): Promise<PaginationResult<Attendant>> => {
	const event = await prisma.event.findUnique({
		where: {
			slug,
		},
		select: {
			alumni: {
				skip: pagination ? pagination.limit * pagination.page : undefined,
				take: pagination ? pagination.limit : undefined,
				select: {
					avatar: true,
					batch: true,
					studentId: true,
					course: true,
					firstName: true,
					lastName: true,
					email: true,
				},
			},
		},
	});

	const total = await prisma.event.findUnique({
		where: {
			slug,
		},
		select: {
			alumni: {
				select: {
					firstName: true,
					lastName: true,
					email: true,
				},
			},
		},
	});

	if (!event)
		return {
			count: 0,
			data: [],
			hasMore: false,
		};

	return {
		count: total?.alumni.length || 0,
		data: event.alumni.map((attendant) => ({
			avatar: attendant.avatar || "",
			firstName: attendant.firstName,
			lastName: attendant.lastName,
			email: attendant.email,
			course: attendant?.course || "",
			batch: attendant.batch || 0,
		})),
		hasMore: event.alumni.length === pagination?.limit,
	};
};

export const readEventComments = async ({
	slug,
	pagination,
}: TEventPagination): Promise<PaginationResult<EventComment>> => {
	const comments = await prisma.eventComment.findMany({
		where: {
			event: {
				slug,
			},
		},
		include: {
			commentBy: {
				select: {
					firstName: true,
					lastName: true,
					email: true,
					studentId: true,
					batch: true,
					avatar: true,
				},
			},
		},
		skip: pagination ? pagination.limit * pagination.page : undefined,
		take: pagination ? pagination.limit : undefined,
	});

	const total = await prisma.eventComment.count({
		where: {
			event: {
				slug,
			},
		},
	});

	return {
		count: total || 0,
		data: comments.map((comment) => ({
			id: comment.id,
			comment: comment.comment,
			avatar: comment.commentBy?.avatar || "",
			name: `${comment.commentBy.firstName} ${comment.commentBy.lastName}`,
			studentId: comment.commentBy.studentId || "",
			batch: comment.commentBy.batch?.toString() || "",
			createdAt: comment.createdAt.toISOString(),
		})),
		hasMore: comments.length === pagination?.limit,
	};
};

export const addInterestEvent = async ({
	eventId,
	userId,
}: {
	userId: number;
	eventId: number;
}) => {
	return await prisma.event.update({
		data: {
			interested: {
				connect: {
					id: userId,
				},
			},
		},
		where: {
			id: eventId,
		},
	});
};

export const readInterestedAlumni = async ({
	slug,
	pagination,
}: TEventPagination) => {
	const event = await prisma.event.findUnique({
		where: {
			slug,
		},
		select: {
			interested: {
				skip: pagination ? pagination.limit * pagination.page : undefined,
				take: pagination ? pagination.limit : undefined,
				select: {
					avatar: true,
					batch: true,
					studentId: true,
					course: true,
					firstName: true,
					lastName: true,
					email: true,
				},
			},
			_count: {
				select: { interested: true },
			},
		},
	});

	if (!event)
		return {
			count: 0,
			data: [],
			hasMore: false,
		};

	return {
		count: event._count.interested || 0,
		data: event.interested.map((attendant) => ({
			avatar: attendant.avatar || "",
			firstName: attendant.firstName,
			lastName: attendant.lastName,
			email: attendant.email,
			course: attendant?.course || "",
			batch: attendant.batch || 0,
		})),
		hasMore: event.interested.length === pagination?.limit,
	};
};

export const writeEventComment = async ({
	comment,
	eventId,
	userId,
}: {
	comment: string;
	eventId: number;
	userId: number;
}) => {
	return await prisma.eventComment.create({
		data: {
			comment,
			commentBy: {
				connect: {
					id: userId,
				},
			},
			event: {
				connect: {
					id: eventId,
				},
			},
		},
	});
};
