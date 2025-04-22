import { ReactNode } from "react";

// async function getEvents() {
// 	// const allEvents = await readEventsAction({ pagination: { limit: 10, page: 1 } });
// 	const allEvents = await readEventsAction();
// 	const futureEvents = allEvents.data.filter((event) =>
// 		isFuture(event.startDate)
// 	);
// 	const events = futureEvents.sort(() => Math.random() - 0.5).slice(0, 10);

// 	return events.map((event) => {
// 		const status = getEventStatus({
// 			endDate: event.endDate || event.startDate,
// 			startDate: event.startDate,
// 			startTime: event.startTime,
// 			endTime: event.endTime,
// 		});

// 		return {
// 			name: event.name,
// 			designation: status,
// 			quote: getEventDescription(event),
// 			src:
// 				event.coverImg ||
// 				"https://nkmkpzzqjrewuynxaftt.supabase.co/storage/v1/object/public/event_covers/Group%201(1).png-adb8ef80-bb32-477d-8a7a-f49f6c0bbbe7",
// 		};
// 	});
// }

export default async function Layout({
	children,
}: Readonly<{
	children: ReactNode;
}>) {
	return (
		<div className="p-5 min-h-screen w-screen flex justify-center md:p-10 items-center bg-[url('/images/hallway.png')] bg-no-repeat bg-cover bg-center lg:col-span-4 lg:p-10">
			{children}
		</div>
	);
}
