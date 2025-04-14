export interface Alumni {
	readonly id: number;
	studentId: string;
	lrn: string;
	firstName: string;
	lastName: string;
	middleName: string;
	graduationYear: number;
	birthDate: Date;
	strand: string | null;
	educationLevel: string | null;

	furtherEducation: string | null;
	course: string | null;
	schoolName: string | null;
	// JOB INFORMATION
	status: string | null;
	companyName: string | null;
	jobTitle: string | null;
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
