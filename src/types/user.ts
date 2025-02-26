export interface User<T> {
	readonly id: number;
	email: string;
	role: UserRole;
	password: string;
	firstName: string;
	lastName: string;

	alumniData: T extends "ALUMNI"
		? { graduationYear: number; major: string }
		: never;

	createdAt: Date;
	updatedAt: Date;
}

export type UserRole = "ADMIN" | "SUPER_ADMIN" | "ALUMNI";
