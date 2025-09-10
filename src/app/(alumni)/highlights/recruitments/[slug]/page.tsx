import { readBatchesAction, readRecruitmentAction } from "@/actions";
import RecruitmentInfo from "@/app/admin/recruitment/__components/recruitment-info";
import { notFound } from "next/navigation";

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  if (!slug || isNaN(parseInt(slug))) return notFound();

  const batches = await readBatchesAction();
  const recruitment = await readRecruitmentAction(Number(slug));

  if (!recruitment) return notFound();

  return (
    <div className="mt-10 px-5 md:px-10 space-y-4">
      <h3 className="text-2xl font-bold">Recruitment</h3>
      <RecruitmentInfo
        recruitment={recruitment}
        batches={batches.data.map((b) => b.batch)}
      />
    </div>
  );
}
