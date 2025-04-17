import { getInformation } from "@/actions";
import ProfileForm from "../__components/profile-form";
import { Gender } from "@prisma/client";
import { formatDate } from "date-fns";

export default async function Page() {
	const user = await getInformation({ isAlumni: false });

	if (!user) {
		return <div className="text-center">User not found</div>;
	}

	const data = {
		firstName: user.firstName,
		lastName: user.lastName,
		middleName: user.middleName || "",
		birthDate: user.birthDate ? formatDate(user.birthDate, "yyyy-MM-dd") : "",
		contactNumber: user.contactNumber || "",
		nationality: user.nationality || "",
		religion: user.religion || "",
		avatar: user.avatar || "",
		address: user.address || "",
		gender: Gender[user.gender],
	};

	return (
		<div>
			<ProfileForm id={user.id} {...data} />
		</div>
	);
}
