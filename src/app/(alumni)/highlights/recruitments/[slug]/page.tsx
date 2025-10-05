import { readBatchesAction, readRecruitmentAction } from "@/actions";

import {
  Button,
  LoaderComponent,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components";
import { ChevronLeft } from "lucide-react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { notFound } from "next/navigation";

const RecruitmentInfo = dynamic(
  () => import("@/app/admin/recruitment/__components/recruitment-info"),
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

  if (!slug || isNaN(parseInt(slug))) return notFound();

  const batches = await readBatchesAction();
  const recruitment = await readRecruitmentAction(Number(slug));

  if (!recruitment) return notFound();

  return (
    <div className="mt-10 px-5 md:px-10  ">
      <div className="flex gap-4 mb-5">
        <TooltipProvider>
          <Tooltip delayDuration={300}>
            <TooltipTrigger asChild>
              <Button size="icon" asChild>
                <Link href="/highlights">
                  <ChevronLeft />
                </Link>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>Back to highlights</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <h3 className="text-2xl font-bold">Recruitment</h3>
      </div>
      <RecruitmentInfo
        recruitment={recruitment}
        batches={batches.data.map((b) => b.batch)}
      />
    </div>
  );
}
