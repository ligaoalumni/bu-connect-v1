import Image from "next/image";
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
    <div className="relative ">
      {/*<div className="relative p-5 z-10 min-h-screen w-screen flex   md:justify-end  md:p-10 items-center bg-[url('/images/bu-torch-auth-bg.png')] justify-center bg-no-repeat bg-origin-content bg-left lg:col-span-4 lg:py-10 lg:pl-10 lg:pr-52">*/}
      <div className="relative bg-[#24517D] p-5 z-10 min-h-screen w-screen flex   md:justify-end  md:p-10 items-center   justify-center bg-no-repeat   lg:col-span-4 lg:py-10 lg:pl-10 lg:pr-52">
        <Image
          className="absolute  opacity-40 lg:opacity-100 object-cover  "
          fill
          alt="torch"
          src="/images/torch.png"
        />
        {children}
      </div>
    </div>
  );
}
