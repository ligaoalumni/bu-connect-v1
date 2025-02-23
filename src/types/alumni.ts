import { User } from "./user";

export interface Alumni {
	readonly id: number;
	email: string;
	firstName: string;
	lastName: string;
	graduationYear: number;
	major: string;
	qrCode: string;
	user: User<"ALUMNI">;
	userId: number;

	createdAt: Date;
	updatedAt: Date;
}
