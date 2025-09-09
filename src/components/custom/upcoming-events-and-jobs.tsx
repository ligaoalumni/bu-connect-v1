import { readEventsAction, readJobsAction } from "@/actions";
import { Icon } from "@iconify/react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import Link from "next/link";
import { formatDate } from "date-fns";

export async function UpComingEventsAndJobs() {
  const upcomingEvents = await readEventsAction({
    status: ["Upcoming Event"],
    pagination: {
      limit: 4,
      page: 0,
    },
  });

  const jobs = await readJobsAction({
    status: ["OPEN"],
    pagination: {
      limit: 2,
      page: 0,
    },
  });

  return (
    <section className="px-5 md:px-0">
      <div className=" container mx-auto bg-[#1D4263]  py-10">
        <div className="flex  items-center gap-3 justify-center">
          <Icon
            icon="mingcute:celebrate-fill"
            width="28"
            height="28"
            style={{ color: "#E6750C" }}
          />
          <h1 className="text-[#E6750C] text-2xl font-bold uppercase">
            Upcoming Events
          </h1>
        </div>
        <div className="px-5 grid grid-cols-1 md:gap-20 md:px-10 md:grid-cols-2 gap-5 py-10">
          {upcomingEvents.data.length > 0 ? (
            upcomingEvents.data.map((event) => (
              <CardComponent
                title={event.name}
                key={event.id}
                content={event.location}
                date={formatDate(event.startDate, "MMM d, yyyy")}
                link={`/events/${event.slug}/info`}
              />
            ))
          ) : (
            <div className="flex items-center justify-center w-full min-h-[300px] md:col-span-2">
              <div className="flex flex-col items-center gap-3">
                <Icon
                  icon="mage:folder-cross"
                  width="100"
                  height="100"
                  color="#FFFFFF"
                />
                <p className="text-white text-lg">No upcoming events</p>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className=" container mx-auto bg-[#1D4263]  py-10">
        <div className="flex  items-center gap-3 justify-center">
          <Icon icon="twemoji:briefcase" width="24" height="24" />
          <h1 className="text-[#E6750C] text-2xl font-bold uppercase">
            Job Opportunities
          </h1>
        </div>
        <div className="px-5 grid grid-cols-1  md:gap-20 md:px-10 md:grid-cols-2 gap-5 py-10">
          {jobs.data.length > 0 ? (
            jobs.data.map((job) => (
              <CardComponent
                key={job.id}
                title={job.jobTitle}
                content={`Company: ${job.company}`}
                location={job.location}
                link={`/jobs/${job.id}`}
              />
            ))
          ) : (
            <div className="flex items-center justify-center w-full min-h-[300px] md:col-span-2">
              {/*<Loader2 className="h-20 animate-spin" />*/}
              <div className="flex flex-col items-center gap-3">
                <Icon
                  icon="mage:folder-cross"
                  width="100"
                  height="100"
                  color="#FFFFFF"
                />
                <p className="text-white text-lg">No jobs found</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export const CardComponent = ({
  title,
  link = "#",
  location,
  date,
  content,
}: {
  title: string;
  content: string;
  link?: string;
  date?: string;
  location?: string;
}) => {
  return (
    <Link href={link}>
      <Card>
        <CardHeader>
          <CardTitle className="font-bold text-xl text-[#E6750C]">
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {date ? (
            <div className="flex items-center gap-2">
              <Icon
                icon="fluent-emoji-flat:round-pushpin"
                width="24"
                height="24"
              />
              <p>{content}</p>
            </div>
          ) : (
            <p>{content}</p>
          )}
          {date && (
            <div className="flex items-center gap-2">
              <Icon icon="flat-color-icons:calendar" width="24" height="24" />
              <p>{date}</p>
            </div>
          )}
          {location && (
            <div className="flex items-center gap-2">
              <Icon
                icon="fluent-emoji-flat:round-pushpin"
                width="24"
                height="24"
              />
              <p>{location}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
};
