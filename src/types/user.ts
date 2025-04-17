import { Notification } from "@prisma/client";
import { AlumniAccount } from "./alumni-account";

export interface User {
	readonly id: number;
	email: string;
	role: UserRole;
	password: string;
	firstName: string;
	lastName: string;
	middleName: string | null;
	avatar: string | null;

	verifiedAt: Date | null;
	status: "ACTIVE" | "BLOCKED" | "PENDING" | "DELETED";
	notifications: Notification[];

	alumni: AlumniAccount | null;

	createdAt: Date;
	updatedAt: Date;
}

export type UserRole = "ADMIN" | "SUPER_ADMIN" | "ALUMNI";

export type UserTableData = Omit<User, "password" | "notifications">;

export interface UpdateProfileData {
	address?: string;
	avatar?: string;
	birthDate?: string;
	company?: string;
	contactNumber?: string;
	course?: string;
	firstName: string;
	furtherEducation?: string;
	gender?: Gender;
	jobTitle?: string;
	lastName: string;
	middleName?: string;
	nationality?: string;
	occupation?: string;
	religion?: string;
	schoolName?: string;
}
