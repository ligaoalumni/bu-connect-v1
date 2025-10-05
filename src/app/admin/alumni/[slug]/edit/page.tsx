import { redirect } from "next/navigation";
import { readAlumniAction } from "@/actions";
import dynamic from "next/dynamic";
import { LoaderComponent } from "@/components";

const AlumniRecordForm = dynamic(
  () => import("../../__components").then((mod) => mod.AlumniRecordForm),
  {
    loading: LoaderComponent,
  },
);

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
