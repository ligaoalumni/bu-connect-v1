import { getInformation } from "@/actions";
import EditProfileForm from "./__components/form";
import { formatDate } from "date-fns";

export default async function Page() {
	const user = await getInformation();

	if (!user) {
		return <div>Loading...</div>;
	}

	const systemRecord = user.alumni?.alumni;

	const alumniSystemRecord = {
		lrn: user.alumni?.lrn || "",
		batch: systemRecord?.graduationYear?.toString() || "",
		educationLevel: systemRecord?.educationLevel || "",
		strand: systemRecord?.strand || "",
	};

	return (
		<div>
			<EditProfileForm
				user={{
					id: user.id,
					avatar: user.avatar || "",
					address: user.address || "",
					birthDate: user.birthDate
						? formatDate(user.birthDate, "yyyy-MM-dd")
						: "",
					contactNumber: user.contactNumber || "",
					firstName: user.firstName || "",
					gender: user.gender || "",
					lastName: user.lastName || "",
					middleName: user.middleName || "",
					nationality: user.nationality || "",
					religion: user.religion || "",
				}}
				postInfo={{
					furtherEducation: systemRecord?.furtherEducation || "",
					company: systemRecord?.companyName || "",
					course: systemRecord?.course || "",
					jobTitle: systemRecord?.jobTitle || "",
					occupation: systemRecord?.status || "",
					schoolName: systemRecord?.schoolName || "",
				}}
				alumniSystemRecord={alumniSystemRecord}
			/>
		</div>
	);
}
