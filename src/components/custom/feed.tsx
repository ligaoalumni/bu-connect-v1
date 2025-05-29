// import { readEventsAction } from "@/actions";
// import { InfiniteScroll } from "@/components";

import {
	getInformation,
	readAnnouncementsAction,
	readEventsAction,
	readJobsAction,
	readUserLocationAction,
} from "@/actions";
import { Button, EmptyState } from "@/components";
import EventCard from "@/components/custom/event-card";
import AlumniMap from "@/components/custom/alumni-map";
import { StarRating } from "./star-rating";
import { StatusSelection } from "./status-selection";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";

export async function Feed() {
	const upcomingEvents = await readEventsAction({
		status: ["Upcoming Event"],
		pagination: {
			limit: 3,
			page: 0,
		},
	});
	const information = await getInformation();
	const jobs = await readJobsAction({
		pagination: {
			limit: 1,
			page: 0,
		},
		order: "desc",
		orderBy: "createdAt",
	});
	const news = await readAnnouncementsAction({
		pagination: {
			limit: 1,
			page: 0,
		},
		order: "desc",
		orderBy: "createdAt",
	});
	const locations = await readUserLocationAction();

	return (
		<div className="container mx-auto space-y-10 pb-10   px-5 md:px-0">
			<section className="bg-[#15497A] p-5 md:p-8">
				<h1 className="text-2xl md:text-3xl font-bold text-center text-white py-5">
					Welcome Back, {information?.firstName} {information?.lastName}!
				</h1>
				<div className="flex flex-col md:flex-row smd:justify-between gap-4">
					<div className="bg-white space-y-2 rounded-md  shadow-md p-5 w-full min-w-[80d%] md:min-w-[40d%]">
						<h2 className="font-medium">Where are you now?</h2>
						<StatusSelection initialValue={information?.occupationStatus} />
					</div>
					<div className="bg-white space-y-2 rounded-md shadow-md p-5 w-full min-w-[80d%] md:min-w-[40d%]">
						<h2 className="font-medium">How did BU Connect help you?</h2>
						<div className="flex justify-center items-center gap-2">
							<StarRating
								size="lg"
								initialRating={information?.rate || 0}
								className="  "
								hideRate
							/>
						</div>
					</div>
				</div>
			</section>

			<section className="flex flex-col md:flex-row smd:justify-between gap-4 md:px-10 p-5">
				<div className="bg-[#CEE1FF] rounded-md border border-black/50 p-5 md:p-8 w-full min-w-[80d%] md:min-w-[40d%]">
					<h2 className="text-3xl font-medium">Job Opportunities</h2>
					{jobs.data.length > 0 ? (
						<div className="space-y-2 flex items-center justify-between">
							<div>
								<h4 className="text-xl font-medium">{jobs.data[0].jobTitle}</h4>
								<span>
									{formatDistanceToNow(jobs.data[0].createdAt, {
										addSuffix: true,
									})}
								</span>
							</div>
							<Button asChild>
								<Link href={`/jobs/${jobs.data[0].id}`}>View</Link>
							</Button>
						</div>
					) : (
						<>
							<p>No record of jobs!</p>
						</>
					)}
				</div>
				<div className="bg-[#CEE1FF] rounded-md border border-black/50 p-5 md:p-8 w-full min-w-[80d%] md:min-w-[40d%]">
					<h2 className="text-3xl font-medium">News</h2>
					{news.data.length > 0 ? (
						<div className="space-y-2 flex items-center justify-between">
							<div>
								<h4 className="text-xl font-medium">{news.data[0].title}</h4>
								<span>
									{formatDistanceToNow(jobs.data[0].createdAt, {
										addSuffix: true,
									})}
								</span>
							</div>
							<Button asChild>
								<Link href={`/announcements/${news.data[0].slug}`}>View</Link>
							</Button>
						</div>
					) : (
						<>
							<p>No record of news!</p>
						</>
					)}
				</div>
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
					Alumni Map
				</h1>
				<AlumniMap initialMarkers={locations || []} />
			</section>

			{/* <InfiniteScroll defaultData={events.data} moreData={events.hasMore} /> */}
		</div>
	);
}
