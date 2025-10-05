import React from "react";
import { readBatchesAction, readRecruitmentAction } from "@/actions";
import { notFound } from "next/navigation";
import { ApplicantsLoading } from "../../__components/applicants-list";
import dynamic from "next/dynamic";
import { LoaderComponent } from "@/components";

const RecruitmentInfo = dynamic(
  () => import("../../__components/recruitment-info"),
  {
    loading: LoaderComponent,
  },
);
const ApplicantsList = dynamic(
  () =>
    import("../../__components/applicants-list").then(
      (mod) => mod.ApplicantsList,
    ),
  {
    loading: ApplicantsLoading,
  },
);

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  if (!slug || isNaN(Number(slug))) return notFound();

  const batches = await readBatchesAction();
  const batchesOptions = batches.data.map((batch) => batch.batch);
  const recruitment = await readRecruitmentAction(Number(slug));

  if (!recruitment) return notFound();

  return (
    <div>
      <RecruitmentInfo
        recruitment={recruitment}
        isAdmin
        batches={batchesOptions}
      />

      <ApplicantsList recruitmentId={recruitment.id} />
    </div>
  );
}
