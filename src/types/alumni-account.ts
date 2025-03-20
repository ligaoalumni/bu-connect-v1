export interface AlumniAccount {
	readonly id: number;
	email: string;
	firstName: string;
	lastName: string;
	middleName: string | null;

	graduationYear: number;
	lrn: string;
	major: string;

	qrCode: string;

	interested: Event[];
	events: Event[];

	createdAt: Date;
	updatedAt: Date;
}
