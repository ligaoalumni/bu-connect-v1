import { LoaderComponent } from "@/components";
import dynamic from "next/dynamic";
import React from "react";

const PollForm = dynamic(
  () => import("../__components/poll-form").then((mod) => mod.PollForm),
  {
    loading: LoaderComponent,
  },
);

export default function Page() {
  return (
    <div className="min-h-[82dvh] flex items-center justify-center">
      <PollForm />
    </div>
  );
}
