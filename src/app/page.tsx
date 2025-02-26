import { FCalendarSkeleton } from "@/components";
import { getDisabledEvents } from "@/models";
import { Metadata } from "next";
import { lazy, Suspense } from "react";

// either Static metadata
export const metadata: Metadata = {
	title: "LNHS | Alumni Tracking",
};

const FCalendar = lazy(() => import("@/components/custom/full-calendar"));

export default async function Home() {
	const events = await getDisabledEvents();

	return (
		<div className="container mx-auto">
			<Suspense fallback={<FCalendarSkeleton />}>
				<FCalendar events={events} />
			</Suspense>
		</div>
	);
}
