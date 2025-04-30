import { getInformation } from "@/actions";
import EditProfileForm from "./__components/form";

export default async function Page() {
	const user = await getInformation();

	if (!user) {
		return <div>Loading...</div>;
	}

	return (
		<div>
			<EditProfileForm user={user} />
		</div>
	);
}
