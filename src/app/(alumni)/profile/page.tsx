import { getInformation } from "@/actions";
import { AlumniData } from "@/app/admin/alumni/__components";
import {
	Avatar,
	AvatarFallback,
	AvatarImage,
	Button,
	Card,
	CardContent,
	CardHeader,
	CardTitle,
	QRCodeViewer,
	ChangePassword,
	LocationSharingModal,
} from "@/components";
import { formatAddress } from "@/lib/utils";
import { formatDate } from "date-fns";
import Link from "next/link";
import React from "react";

export default async function Page() {
	const user = await getInformation();

	return (
		<div className="space-y-3">
			<h1 className=" text-center text-lg font-medium">User Profile</h1>
			<div className="rounded-3xl space-y-5 px-5 bg-[#2F61A0] py-10 dark:bg-[#5473a8]">
				<div className="flex flex-col items-center ">
					<Avatar className="h-[120px] w-[120px]">
						<AvatarImage src={user?.avatar || ""} />
						<AvatarFallback className="text-3xl">
							{user?.firstName[0]}
							{user?.lastName[0]}
						</AvatarFallback>
					</Avatar>
					<div className="text-center">
						<h2 className="text-2xl font-semibold text-white">
							{user?.firstName} {user?.lastName}
						</h2>
						<p className="text-sm text-white">
							{user?.batch} {user?.course}
						</p>
					</div>
				</div>

				<div className="flex justify-between items-end  md:items-center gap-3  ">
					<div className="flex items-center gap-3 flex-wrap">
						<Button variant="default" asChild>
							<Link href={"profile/edit"}>Edit Profile</Link>
						</Button>
						<ChangePassword />
						<LocationSharingModal
							shareLocation={user?.shareLocation || false}
						/>
					</div>

					<QRCodeViewer
						buttonProps={{
							variant: "secondary",
						}}
						buttonLabel="My QR Code"
						data={{
							id: Number(user?.id),
							batch: Number(user?.batch),
							firstName: user?.firstName || "",
							lastName: user?.lastName || "",
							course: user?.course || "",
							studentId: user?.studentId || "",
							email: user?.email || "",
							middleName: user?.middleName || "",
						}}
					/>
				</div>

				<Card className="bg-transparent text-white">
					<CardHeader className="px-5 pb-2 pt-5 font-medium">
						<CardTitle>Personal Information</CardTitle>
					</CardHeader>
					<CardContent className="px-5 pt-2 pb-4 grid grid-cols-2 gap-3 sms:grid-cols-2 md:grid-cols-3  md:col-span-2">
						<AlumniData label="First Name" data={user?.firstName} />
						<AlumniData label="Middle Name" data={user?.middleName} />
						<AlumniData label="Last Name" data={user?.lastName} />
						<AlumniData
							label="Birth Date"
							data={
								user?.birthDate
									? formatDate(user.birthDate, "MMMM dd, yyyy")
									: null
							}
						/>
						<AlumniData
							label="Gender"
							data={`${user?.gender[0]}${user?.gender
								.slice(1)
								.toLocaleLowerCase()}`.replaceAll(/_/g, " ")}
						/>
						<AlumniData label="Email" data={user?.email} />
						<div className="sm:col-span-2 md:col-span-3">
							<AlumniData
								label="Address"
								data={formatAddress(user?.address || "").address || ""}
							/>
						</div>
						<AlumniData label="Contact Number" data={user?.contactNumber} />
						<AlumniData label="Nationality" data={user?.nationality} />
						<AlumniData label="Religion" data={user?.religion} />

						{/* <AlumniData label="Contact Number" data={alumni.user./} /> */}
					</CardContent>
				</Card>

				<Card className="bg-transparent text-white">
					<CardHeader className="px-5 pb-2 pt-5 font-medium">
						<CardTitle>Academic Information</CardTitle>
					</CardHeader>
					<CardContent className="px-5 pt-2 pb-4 grid grid-cols-2 gap-3 sms:grid-cols-2 md:grid-cols-3  ">
						<AlumniData label="Student ID" data={user?.studentId} />
						<AlumniData label="Batch" data={user?.batch?.toString()} />
						<AlumniData label="Course" data={user?.course} />
					</CardContent>
				</Card>

				<Card className="bg-transparent text-white">
					<CardHeader className="px-5 pb-2 pt-5 font-medium">
						<CardTitle>Post - Graduation Information</CardTitle>
					</CardHeader>
					<CardContent className="px-5 pt-2 pb-4 grid grid-cols-2 gap-3 sms:grid-cols-2 md:grid-cols-3  ">
						<AlumniData label="Company" data={user?.company} />
						<AlumniData
							label="Name of University/College"
							data={user?.jobTitle}
						/>
						<AlumniData
							label="Current Occupation"
							data={user?.currentOccupation}
						/>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
