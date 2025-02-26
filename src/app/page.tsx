import { FCalendar, WIPBanner } from "@/components";
import { getDisabledEvents } from "@/models";
import { Metadata } from "next";
import { Suspense } from "react";

// either Static metadata
export const metadata: Metadata = {
	title: "LNHS | Alumni Tracking",
};

export default async function Home() {
	const events = await getDisabledEvents();

	return (
		<div className="container mx-auto">
			<Suspense fallback={<div>Loading...</div>}>
				<FCalendar events={events} />
			</Suspense>
			<div className="flex  items-center justify-center h-screen">
				<WIPBanner />
			</div>
		</div>
	);
}
