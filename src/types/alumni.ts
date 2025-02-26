import { User } from "./user";

export interface Alumni {
	readonly id: number;
	email: string;
	firstName: string;
	lastName: string;

	graduationYear: number;
	major: string;

	qrCode: string;
	user: User;
	userId: number;

	interested: Event[];
	events: Event[];

	createdAt: Date;
	updatedAt: Date;
}
