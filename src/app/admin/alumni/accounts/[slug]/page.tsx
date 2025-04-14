import { readAlumniAccount } from "@/actions/alumni-account";
import {
	Badge,
	Button,
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from "@/components";
import React from "react";
import { AlumniData } from "../../__components";
import { formatDate } from "date-fns";
import { alumniLabel } from "@/constant";
import Image from "next/image";

export default async function AlumniAccountPage({
	params,
}: {
	params: { slug: string };
}) {
	const { slug } = await params;

	const alumni = await readAlumniAccount(slug);

	if (!alumni) return <h1>No data</h1>;

	const isFemale = alumni.user.gender === "FEMALE";

	return (
		<div className="space-y-5">
			<div className="p-5 flex justify-between rounded-xl border bg-card text-card-foreground shadow items-center">
				<h1 className="inline text-lg font-medium">
					{alumniLabel[alumni.user.gender]} Account
				</h1>
				<div className="flex items-center gap-2">
					{/* <Button asChild variant="secondary" className="max-w-fit ">
						<Link href={`${alumni.lrn}/edit`}>Edit</Link>
					</Button> */}
					<Button disabled={!alumni.qrCode} className="max-w-fit ">
						View QR Code
					</Button>
				</div>
			</div>

			<div className="p-5 flex items-center gap-5 rounded-xl border bg-card shadow justify-start">
				<div
					// ratio={1 / 1}
					className=" shadow-sm rounded-full relative max-w-[120px] max-h-[120px] md:max-h-[120px] ">
					<Image
						src={
							alumni.user.avatar || isFemale
								? "/images/girl-avatar-placeholder.png"
								: "/images/boy-avatar-placeholder.png"
						}
						alt="Avatar"
						height={120}
						width={120}
					/>
					<Badge
						className="absolute bottom-0 right-0 border-2 border-white shadow-none"
						variant={alumni.user.verifiedAt ? "default" : "destructive"}>
						{alumni.user.verifiedAt ? "Verified" : "Not Verified"}
					</Badge>
				</div>
				<div>
					<h1 className="text-lg font-medium">
						{alumni.firstName} {alumni.middleName && `${alumni.middleName} `}
						{alumni.lastName}
					</h1>
					<p className="text-muted-foreground text-sm">
						Batch: {alumni.graduationYear}
					</p>
					<p className="text-muted-foreground text-sm">LRN: {alumni.lrn}</p>
					<p className="text-muted-foreground text-sm">
						Email: {alumni.user.email}
					</p>
				</div>
			</div>
			<Card>
				<CardHeader className="px-5 pb-2 pt-5 font-medium">
					<CardTitle>Personal Information</CardTitle>
				</CardHeader>
				<CardContent className="px-5 pt-2 pb-4 grid grid-cols-2 gap-3 sms:grid-cols-2 md:grid-cols-3  md:col-span-2">
					<AlumniData label="First Name" data={alumni.firstName} />
					<AlumniData label="Middle Name" data={alumni.middleName} />
					<AlumniData label="Last Name" data={alumni.lastName} />
					<AlumniData
						label="Birth Date"
						data={
							alumni.alumni
								? formatDate(alumni.alumni?.birthDate, "MMMM dd, yyyy")
								: null
						}
					/>
					<AlumniData
						label="Gender"
						data={`${alumni.user.gender[0]}${alumni.user.gender
							.slice(1)
							.toLocaleLowerCase()}`.replaceAll(/_/g, " ")}
					/>
					<AlumniData label="Email" data={alumni.user.email} />
					<AlumniData label="Address" data={alumni.user.address} />
					<AlumniData label="Contact Number" data={alumni.user.contactNumber} />
					<AlumniData label="Nationality" data={alumni.user.nationality} />
					<AlumniData label="Religion" data={alumni.user.religion} />

					{/* <AlumniData label="Contact Number" data={alumni.user./} /> */}
				</CardContent>
			</Card>
			<Card>
				<CardHeader className="px-5 pb-2 pt-5 font-medium">
					<CardTitle>Academic Information</CardTitle>
				</CardHeader>
				<CardContent className="px-5 pt-2 pb-4 grid grid-cols-2 gap-3 sms:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
					<AlumniData label="First Name" data={alumni.firstName} />
					<AlumniData label="Middle Name" data={alumni.middleName} />
					<AlumniData label="Last Name" data={alumni.lastName} />
					<AlumniData label="First Name" data={alumni.firstName} />
					<AlumniData
						label="Birth Date"
						data={
							alumni.alumni
								? formatDate(alumni.alumni?.birthDate, "MMMM dd, yyyy")
								: null
						}
					/>
				</CardContent>
			</Card>
		</div>
	);
}
