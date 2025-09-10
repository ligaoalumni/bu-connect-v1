// import { readEventsAction } from "@/actions";
// import { InfiniteScroll } from "@/components";

import { readEventsAction } from "@/actions";
import { EmptyState } from "@/components";
import EventCard from "@/components/custom/event-card";
import ImagesMarquee from "../__components/images-marquee";

export default async function AllEvents() {
  const upcomingEvents = await readEventsAction({
    status: ["Upcoming Event"],
    pagination: {
      limit: 3,
      page: 0,
    },
  });

  const ongoingEvents = await readEventsAction({
    status: ["Ongoing Event"],
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

  return (
    <div className="container mx-auto space-y-10 py-10 md:mt-14 pt-5 px-5 md:px-10">
      <section>
        <h1 className="text-2xl md:text-3xl font-bold text-center ">
          BU POLANGUI
        </h1>
        <p className="font-tangerine  tracking-wider text-2xl md:text-3xl  text-center">
          &quot;The past brought us together, the future keep us <br />
          connected&quot;
        </p>
      </section>

      <ImagesMarquee />

      <section>
        <h1 className="text-2xl md:text-3xl font-bold text-center ">
          Upcoming Events
        </h1>
        {ongoingEvents.data.length > 0 || upcomingEvents.data.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {ongoingEvents.data.length > 0 &&
              ongoingEvents.data.map((event) => (
                <EventCard key={event.slug} {...event} />
              ))}
            {upcomingEvents.data.length > 0 &&
              upcomingEvents.data.map((event) => (
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
