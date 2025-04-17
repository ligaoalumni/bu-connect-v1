import { AlumniAccount } from "./alumni-account";

export interface Event {
	readonly id: number;
	slug: string;
	name: string;
	content: string;
	coverImg: string;
	startDate: Date;
	endDate: Date | null;

	startTime: Date;
	endTime: Date;

	location: string;

	interested: AlumniAccount[];
	alumni: AlumniAccount[];

	createdAt: Date;
	updatedAt: Date;
}

export type EventPartialRelation = Omit<Event, "interested" | "alumni"> & {
	alumni: Pick<AlumniAccount, "id" | "firstName" | "lastName" | "email">[];
	interested: Pick<AlumniAccount, "id" | "firstName" | "lastName" | "email">[];
};

export type EventWithoutRelations = Omit<Event, "interested" | "alumni">;

export type EventWithPagination = Omit<Event, "interested" | "alumni"> & {
	interested: number;
	alumni: number;
};

export interface DashboardEvent {
	id: number;
	slug: string;
	location: string;
	attendees: number;
	time: string;
	date: string;
	name: string;
}

export type EventStatus = "Upcoming Event" | "Ongoing Event" | "Past Event";

export interface EventComment {
	id: number;
	comment: string;

	// user who commented
	avatar: string;
	name: string;
	lrn: string;
	batch: string;

	createdAt: string;
}
