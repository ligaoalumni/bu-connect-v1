import { AspectRatio } from "@radix-ui/react-aspect-ratio";
import Image from "next/image";
import React from "react";
import { format } from "date-fns";
import { EventPartialRelation } from "@/types";
import EventInfoHeader from "./event-info-header";
import dynamic from "next/dynamic";
import { LoaderComponent } from "./loader";

const RichTextEditor = dynamic(
  () => import("./rich-text-editor").then((mod) => mod.RichTextEditor),
  {
    loading: LoaderComponent,
  },
);
const InterestedAlumniSection = dynamic(
  () =>
    import("./interested-alumni-section").then(
      (mod) => mod.InterestedAlumniSection,
    ),
  {
    loading: LoaderComponent,
  },
);
const EventCommentsSection = dynamic(
  () =>
    import("./event-comments-section").then((mod) => mod.EventCommentsSection),
  {
    loading: LoaderComponent,
  },
);
const AttendantsSection = dynamic(() => import("./attendants-section"), {});

interface EventInfoProps {
  event: EventPartialRelation;
  date: string;
  status: string;
}

export function EventInfo({ event, date, status }: EventInfoProps) {
  return (
    <div className="space-y-3">
      <EventInfoHeader
        eventId={event.id}
        eventSlug={event.slug}
        status={status}
        eventTitle={event.name}
      />
      <div
        className="grid md:grid-cols-10 md:gap-5 lg:gap-8 gap-3 xl:gap-10"
        style={{ gridAutoFlow: "dense" }}
      >
        <div className="md:col-span-6  ">
          {event?.coverImg && (
            <AspectRatio
              ratio={16 / 9}
              className="bg-black/5 rounded-lg dark:bg-white/5  shrink  "
            >
              <Image
                alt={`${event.name} cover`}
                src={event.coverImg}
                fill
                className="object-contain h-full w-full rounded-md   "
              />
            </AspectRatio>
          )}
          <RichTextEditor content={event.content} />
        </div>
        <div className="md:col-span-4 space-y-4   max-h-fit  ">
          <div>
            <h3 className="text-gray-600 dark:text-gray-200">Status:</h3>
            <p className="font-medium text-lg">{status}</p>
          </div>
          <div>
            <h3 className="text-gray-600 dark:text-gray-200">When:</h3>
            <p className="font-medium text-lg">{date}</p>
          </div>
          <div>
            <h3 className="text-gray-600 dark:text-gray-200">Time:</h3>
            <p className="font-medium text-lg">
              {format(event.startTime, "HH:mm a")} -{" "}
              {format(event.endTime, "hh:mm a")}
            </p>
          </div>
          <div>
            <h3 className="text-gray-600 dark:text-gray-200">Where:</h3>
            <p className="font-medium text-lg">{event.location}</p>
          </div>
        </div>

        <div className="md:col-span-6 md:order-1 order-2 ">
          <EventCommentsSection id={event.id} eventSlug={event.slug} />
        </div>
        <div className="md:col-span-4 order-1 md:order-2  ">
          {status === "Ongoing Event" || status === "Past Event" ? (
            <AttendantsSection eventSlug={event.slug} />
          ) : (
            <InterestedAlumniSection eventSlug={event.slug} />
          )}
        </div>
      </div>
    </div>
  );
}
