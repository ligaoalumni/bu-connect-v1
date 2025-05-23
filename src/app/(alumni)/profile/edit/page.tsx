import { getInformation } from "@/actions";
import EditProfileForm from "./__components/form";

export default async function Page() {
	const user = await getInformation();

	if (!user) {
		return <div>Loading...</div>;
	}

	const data = {
		...user,
		address:
			Array.from(user.address as any).length > 0
				? typeof user.address === "string"
					? JSON.parse(user.address)
					: user.address
				: undefined,
	};

	console.log(data, "qqq");

	return (
		<div>
			<EditProfileForm user={data} />
		</div>
	);
}
