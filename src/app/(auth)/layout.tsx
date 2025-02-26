import { readEventsAction } from "@/actions";
import { AnimatedTestimonials } from "@/components";
import { getEventDescription, getEventStatus } from "@/lib/event";
import { isFuture } from "date-fns";
import React, { Suspense } from "react";

async function getEvents() {
	// const allEvents = await readEventsAction({ pagination: { limit: 10, page: 1 } });
	const allEvents = await readEventsAction();
	const futureEvents = allEvents.data.filter((event) =>
		isFuture(event.startDate)
	);
	const events = futureEvents.sort(() => Math.random() - 0.5).slice(0, 10);

	return events.map((event) => {
		const status = getEventStatus({
			endDate: event.endDate || event.startDate,
			startDate: event.startDate,
			startTime: event.startTime,
			endTime: event.endTime,
		});

		return {
			name: event.name,
			designation: status,
			quote: getEventDescription(event),
			src:
				event.coverImg ||
				"https://nkmkpzzqjrewuynxaftt.supabase.co/storage/v1/object/public/event_covers/Group%201(1).png-adb8ef80-bb32-477d-8a7a-f49f6c0bbbe7",
		};
	});
}

export default async function Layout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const events = await getEvents();

	return (
		<main className="grid container mx-auto lg:grid-cols-12 grid-cols-1">
			<section className="hidden lg:flex justify-between items-center w-full col-span-8 ">
				<Suspense fallback={<div>Loading...</div>}>
					<AnimatedTestimonials autoplay testimonials={events} />
				</Suspense>
			</section>
			<section className="p-5 min-h-screen flex justify-center md:p-10 items-center w-full lg:col-span-4 lg:p-10">
				{children}
			</section>
		</main>
	);
}
