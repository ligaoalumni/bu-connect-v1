import React from "react";
import { readBatchesAction } from "@/actions";
import dynamic from "next/dynamic";
import { LoaderComponent } from "@/components";

const RecruitmentForm = dynamic(
  () =>
    import("../__components/recruitment-form").then(
      (mod) => mod.RecruitmentForm,
    ),
  {
    loading: LoaderComponent,
  },
);

export default async function Page() {
  const batches = await readBatchesAction();

  const batchesOptions = batches.data.map((batch) => batch.batch);

  return (
    <div>
      <RecruitmentForm batches={batchesOptions} />
    </div>
  );
}
