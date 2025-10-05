import { readOldAccountAction } from "@/actions";
import { LoaderComponent } from "@/components";
import dynamic from "next/dynamic";
import { notFound } from "next/navigation";

const OldAlumniForm = dynamic(
  () => import("../../__components").then((mod) => mod.OldAlumniForm),
  {
    loading: LoaderComponent,
  },
);

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
