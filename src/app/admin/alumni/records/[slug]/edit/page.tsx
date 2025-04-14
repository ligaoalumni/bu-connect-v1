import { readAlumniRecord } from "@/actions/alumni-account";
import { redirect } from "next/navigation";
import { AlumniRecordForm } from "../../../__components";

export default async function EditAlumniRecord({
	params,
}: {
	params: Promise<{ slug: string }>;
}) {
	const { slug } = await params;
	const alumni = await readAlumniRecord({ lrn: slug });

	if (!alumni) return redirect("/admin/alumni/records");

	return (
		<div>
			<AlumniRecordForm alumni={alumni} />
		</div>
	);
}
