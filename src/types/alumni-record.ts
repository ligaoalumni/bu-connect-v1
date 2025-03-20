export interface Alumni {
	readonly id: number;
	studentId: string;
	lrn: string;
	firstName: string;
	lastName: string;
	middleName: string;
	graduationYear: number;
	birthDate: Date;
}

export interface AlumniRecord extends Alumni {
	alumni: {
		email: string;
		major: string;
		firstName: string;
		lastName: string;
		middleName: string;
		lrn: string;
		graduationYear: number;
		id: number;
	} | null;
	alumniId: number | null;
}
