import { User } from "@prisma/client";

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

export type Gender = "MALE" | "FEMALE" | "PREFER_NOT_TO_SAY";

export type AlumniDataTableColumns = Pick<
	User,
	| "id"
	| "studentId"
	| "firstName"
	| "lastName"
	| "middleName"
	| "email"
	| "contactNumber"
	| "address"
	| "birthDate"
	| "batch"
	| "course"
	| "gender"
	| "status"
>;
