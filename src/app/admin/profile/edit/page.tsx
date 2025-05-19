import { getInformation } from "@/actions";
import ProfileForm from "../__components/profile-form";
import { Gender } from "@prisma/client";
import { formatDate } from "date-fns";

export default async function Page() {
	const user = await getInformation();

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
		address: typeof user.address
			? user.address === "string"
				? JSON.parse(user.address)
				: user.address
			: undefined,
		gender: Gender[user.gender],
	};

	return (
		<div>
			<ProfileForm {...data} id={user.id} />
		</div>
	);
}
