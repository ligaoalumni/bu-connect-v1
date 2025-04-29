import { redirect } from "next/navigation";
import { AlumniRecordForm } from "../../__components";
import { readAlumniAction } from "@/actions";

export default async function EditAlumniRecord({
	params,
}: {
	params: Promise<{ slug: string }>;
}) {
	const { slug } = await params;
	const alumni = await readAlumniAction(Number(slug));

	if (!alumni) return redirect("/admin/alumni/records");

	return (
		<div>
			<AlumniRecordForm alumni={alumni} />
		</div>
	);
}
