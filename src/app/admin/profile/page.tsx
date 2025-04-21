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
	ChangeEmail,
	ChangePassword,
} from "@/components";
import { formatDate } from "date-fns";
import Link from "next/link";

export default async function Page() {
	const user = await getInformation({ isAlumni: false });

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
						<p className="text-sm text-white capitalize">
							{user?.role.replace(/_/g, " ").toLowerCase()}
						</p>
					</div>
				</div>

				<div className="flex gap-2 items-center">
					<Button variant="default" asChild>
						<Link href={"profile/edit"}>Edit Profile</Link>
					</Button>
					<ChangeEmail />
					<ChangePassword />
				</div>

				<Card className="bg-transparent text-white">
					<CardHeader className="px-5 pb-2 pt-5 font-medium">
						<CardTitle>Personal Information</CardTitle>
					</CardHeader>
					<CardContent className="px-5 pt-2 pb-4 grid grid-cols-1 sm:grid-cols-2 gap-3 sms:grid-cols-2 md:grid-cols-3  md:col-span-2">
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
						<AlumniData label="Address" data={user?.address} />
						<AlumniData label="Contact Number" data={user?.contactNumber} />
						<AlumniData label="Nationality" data={user?.nationality} />
						<AlumniData label="Religion" data={user?.religion} />

						{/* <AlumniData label="Contact Number" data={alumni.user./} /> */}
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
