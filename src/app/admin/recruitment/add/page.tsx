import React from "react";
import { RecruitmentForm } from "../__components/recruitment-form";
import { readBatchesAction } from "@/actions";

export default async function Page() {
  const batches = await readBatchesAction();

  const batchesOptions = batches.data.map((batch) => batch.batch);

  return (
    <div>
      <RecruitmentForm batches={batchesOptions} />
    </div>
  );
}
