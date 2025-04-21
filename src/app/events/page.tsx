// import { readEventsAction } from "@/actions";
// import { InfiniteScroll } from "@/components";

import { readEventsAction } from "@/actions";
import { EmptyState, Marquee } from "@/components";
import EventCard from "@/components/custom/event-card";
import Image from "next/image";

export default async function AllEvents() {
	const upcomingEvents = await readEventsAction({
		status: ["Upcoming Event"],
		pagination: {
			limit: 3,
			page: 0,
		},
	});

	const pastEvents = await readEventsAction({
		status: ["Past Event"],
		pagination: {
			limit: 3,
			page: 0,
		},
	});

	const images = [
		{ image: "/images/event-img-1.png", alt: "event image 1" },
		{ image: "/images/event-img-2.png", alt: "event image 2" },
		{ image: "/images/event-img-3.png", alt: "event image 3" },
		{ image: "/images/event-img-4.png", alt: "event image 4" },
	];

	return (
		<div className="container mx-auto space-y-10 py-10 mt-32 pt-5 px-5 md:px-0">
			<section>
				<h1 className="text-2xl md:text-3xl font-bold text-center ">
					Ligao National High School
				</h1>
				<p className="font-tangerine tracking-wider text-3xl md:text-5xl text-center">
					&quot;The past brought us together,
					<br /> the future keep us connected&quot;
				</p>
			</section>

			<section className=" ">
				<Marquee pauseOnHover className="">
					{images.map((image, index) => (
						<EventImageCard key={index} image={image.image} alt={image.alt} />
					))}
				</Marquee>
			</section>

			<section>
				<h1 className="text-2xl md:text-3xl font-bold text-center ">
					Upcoming Events
				</h1>
				{upcomingEvents.data.length > 0 ? (
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
						{upcomingEvents.data.map((event) => (
							<EventCard key={event.slug} {...event} />
						))}
					</div>
				) : (
					<div className="flex justify-center items-center">
						<EmptyState showRedirectButton={false} />
					</div>
				)}
			</section>

			<section>
				<h1 className="text-2xl mb-10 md:text-3xl font-bold text-center ">
					Past Event
				</h1>
				{pastEvents.data.length > 0 ? (
					<div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-10">
						{pastEvents.data.map((event) => (
							<EventCard imageOnly key={event.slug} {...event} />
						))}
					</div>
				) : (
					<div className="flex justify-center items-center">
						<EmptyState showRedirectButton={false} />
					</div>
				)}
			</section>

			{/* <InfiniteScroll defaultData={events.data} moreData={events.hasMore} /> */}
		</div>
	);
}

const EventImageCard = ({ image, alt }: { image: string; alt?: string }) => {
	return (
		<div className="relative mx-5 min-w-[240px] max-w-[240px] md:max-w-[300px] md:min-w-[300px] h-[280px] md:h-[320px] ">
			<Image alt={alt || image} fill src={image} />
		</div>
	);
};
