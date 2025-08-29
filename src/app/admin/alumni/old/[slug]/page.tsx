import {} from "@/repositories";
import { OldAlumniForm } from "../../__components";
import { readOldAccountAction } from "@/actions";
import { notFound } from "next/navigation";

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const oldData = await readOldAccountAction(slug);
  if (!oldData) notFound();

  return (
    <div className=" md:mx-auto md:min-w-[700px] md:max-w-[700px]">
      <OldAlumniForm initialValue={oldData} />
    </div>
  );
}
