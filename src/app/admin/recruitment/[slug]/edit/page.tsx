import React from "react";
import { readBatchesAction, readRecruitmentAction } from "@/actions";
import { notFound } from "next/navigation";
import { LoaderComponent } from "@/components";
import dynamic from "next/dynamic";

const RecruitmentForm = dynamic(
  () =>
    import("../../__components/recruitment-form").then(
      (mod) => mod.RecruitmentForm,
    ),
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
  if (!slug || isNaN(Number(slug))) return notFound();

  const recruitmentId = Number(slug);

  const recruitment = await readRecruitmentAction(recruitmentId);

  if (!recruitment) return notFound();

  const batches = await readBatchesAction();
  const batchesOptions = batches.data.map((batch) => batch.batch);

  return (
    <div>
      <RecruitmentForm initialData={recruitment} batches={batchesOptions} />
    </div>
  );
}
