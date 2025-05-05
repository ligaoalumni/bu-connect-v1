import { Button, Card, CardContent, CardHeader, CardTitle } from "@/components";
import { formatDate } from "date-fns";
import Link from "next/link";
import React from "react";
import { AlumniData } from "../__components";
import { readAlumniAction } from "@/actions";

export default async function Page({
	params,
}: {
	params: Promise<{ slug: string }>;
}) {
	const { slug } = await params;

	const alumni = await readAlumniAction(Number(slug));

	if (!alumni) return <h1>No Record Found!</h1>;

	const hasAccount = alumni;

	return (
		<div className="space-y-5">
			<div className="p-5 flex justify-between rounded-xl border bg-card text-card-foreground shadow items-center">
				<h1 className="inline text-lg font-medium">
					Former Student Information
				</h1>
				<div className="flex items-center gap-2">
					<Button asChild variant="secondary" className="max-w-fit ">
						<Link href={`${alumni.id}/edit`}>Edit</Link>
					</Button>
					<Button disabled={!hasAccount} asChild className="max-w-fit ">
						<Link href={`/admin/alumni/accounts/${alumni.id}`}>
							{hasAccount ? "View Account Details" : "No account connected"}
						</Link>
					</Button>
				</div>
			</div>

			<Card>
				<CardHeader className="px-5 pb-2 pt-5 font-medium">
					<CardTitle>Personal Information</CardTitle>
				</CardHeader>
				<CardContent className="px-5 pt-2 pb-4 grid grid-cols-2 gap-3 sms:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
					<AlumniData label="First Name" data={alumni.firstName} />
					<AlumniData label="Middle Name" data={alumni.middleName} />
					<AlumniData label="Last Name" data={alumni.lastName} />
					<AlumniData label="First Name" data={alumni.firstName} />
					<AlumniData
						label="Birth Date"
						data={formatDate(alumni.birthDate, "MMMM dd, yyyy")}
					/>
				</CardContent>
			</Card>
			<Card>
				<CardHeader className="px-5 pb-2 pt-5 font-medium">
					<CardTitle>Academic Information</CardTitle>
				</CardHeader>
				<CardContent className="px-5 pt-2 pb-4 grid grid-cols-2 gap-3 sms:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
					<AlumniData label="Student ID" data={alumni.studentId} />
					<AlumniData label="Batch" data={alumni.batch?.toString() || ""} />
				</CardContent>
			</Card>
		</div>
	);
}
