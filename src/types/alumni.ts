export interface Alumni {
	readonly id: number;
	email: string;
	firstName: string;
	lastName: string;

	graduationYear: number;
	major: string;

	qrCode: string;

	interested: Event[];
	events: Event[];

	createdAt: Date;
	updatedAt: Date;
}
