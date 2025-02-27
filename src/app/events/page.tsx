import { readEventsAction } from "@/actions";
import { InfiniteScroll } from "@/components";

export default async function AllEvents() {
	const events = await readEventsAction({
		pagination: {
			limit: 12,
			page: 0,
		},
	});

	return (
		<div className="container mx-auto pt-10 px-5 md:px-0">
			<InfiniteScroll defaultData={events.data} moreData={events.hasMore} />
		</div>
	);
}
