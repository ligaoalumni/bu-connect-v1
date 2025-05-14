import React, { Suspense } from "react";
import RecruitmentInfo from "../../__components/recruitment-info";
import { readBatchesAction, readRecruitmentAction } from "@/actions";
import { notFound } from "next/navigation";
import {
	ApplicantsList,
	ApplicantsLoading,
} from "../../__components/applicants-list";

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
			<RecruitmentInfo recruitment={recruitment} batches={batchesOptions} />
			<Suspense fallback={<ApplicantsLoading />}>
				<ApplicantsList recruitmentId={recruitment.id} />
			</Suspense>
		</div>
	);
}
