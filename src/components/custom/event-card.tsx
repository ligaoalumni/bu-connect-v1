"use client";

import { format } from "date-fns";
import { CalendarIcon, Clock, MapPin } from "lucide-react";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { getEventStatus } from "@/lib";
import { EventWithPagination } from "@/types";
import { eventStatusColorMap } from "@/constant";
import { Button } from "../ui/button";
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts";
import { toast } from "sonner";
import { addInterestEventAction } from "@/actions";
import Link from "next/link";
// import { AvatarGroup } from "@/components/ui/avatar-group"

interface EventCardProps extends EventWithPagination {
  showStatus?: boolean;
  imageOnly?: boolean;
}

export default function EventCard(event: EventCardProps) {
  // Format date and time
  const formattedDate = format(event.startDate, "MMM d, yyyy");
  const formattedStartTime = format(event.startTime, "h:mm a");
  const formattedEndTime = format(event.endTime, "h:mm a");
  const status = getEventStatus({
    endDate: event.endDate || event.startDate,
    startDate: event.startDate,
    endTime: event.endTime,
    startTime: event.startTime,
  });
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [isInterested, setIsInterested] = useState(
    event.interested.map((user) => user.id).includes(Number(user?.id)),
  );

  useEffect(() => {
    if (user?.id) {
      setIsInterested(
        event.interested.map((user) => user.id).includes(Number(user.id)),
      );
    }
  }, [event.interested, user]);

  async function handleInterest() {
    setLoading(true);
    try {
      setIsInterested(true);
      await addInterestEventAction(event.id);
    } catch (error) {
      setIsInterested(false);
      toast.error("Error joining event", {
        description:
          error instanceof Error ? error.message : "Please try again later",
        richColors: true,
        position: "top-center",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Link href={`/events/${event.slug}`} className="w-full">
      <Card className="overflow-hidden transition-all hover:shadow-md relative">
        {status === "Ongoing Event" && (
          <Badge className="absolute left-3 top-3 z-10 ">On going</Badge>
        )}
        <div className="relative h-96 w-full overflow-hidden">
          <Image
            fill
            src={event.coverImg || "/images/placeholder.jpg"}
            alt={event.name}
            className={`${
              event.coverImg ? "object-cover" : "object-cover"
            } h-full w-full `}
          />
          <h1 className="absolute left-3 right-3 bottom-5 text-2xl md:text-3xl font-bold md:font-extrabold text-white ">
            {event.name}
          </h1>
          {event.showStatus && (
            <Badge
              variant={eventStatusColorMap[status]}
              className="absolute right-3 top-3"
            >
              {status}
            </Badge>
          )}
        </div>

        {!event.imageOnly && (
          <>
            <CardHeader className=" ">
              <h3 className="text-xl font-semibold line-clamp-2">
                {event.name}
              </h3>
            </CardHeader>

            <CardContent className="space-y-3 pb-5">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <CalendarIcon className="h-4 w-4" />
                <span>{formattedDate}</span>
              </div>

              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>
                  {formattedStartTime} - {formattedEndTime}
                </span>
              </div>

              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span className="line-clamp-1">{event.location}</span>
              </div>

              {status === "Upcoming Event" && (
                <Button
                  disabled={loading}
                  onClick={!isInterested ? handleInterest : undefined}
                  className={` ${isInterested ? "bg-[#ffa629] hover:bg-[#ffa629]" : "bg-emerald-600 hover:bg-emerald-500"}`}
                >
                  {isInterested ? "Interested" : "Join"}
                </Button>
              )}
            </CardContent>
            {event._count.interested > 0 ||
              (event._count.alumni > 0 && (
                <CardFooter className="flex items-center justify-between pt-2 border-t">
                  <div className="flex items-center gap-4">
                    {status == "Upcoming Event" &&
                      event._count.interested > 0 && (
                        <div className="flex flex-col">
                          <div className="flex flex-col">
                            <span className="text-xs text-muted-foreground">
                              Interested
                            </span>
                            <span className="font-medium">
                              {event._count.interested}
                            </span>
                          </div>
                          <Button disabled={loading}>Join</Button>
                        </div>
                      )}
                    {event._count.alumni > 0 && (
                      <div className="flex flex-col">
                        <span className="text-xs text-muted-foreground">
                          {status === "Past Event"
                            ? "Attended"
                            : status === "Ongoing Event"
                              ? "Attendees"
                              : "Alumni"}
                        </span>
                        <span className="font-medium">
                          {event._count.alumni}
                        </span>
                      </div>
                    )}
                  </div>
                </CardFooter>
              ))}
          </>
        )}
      </Card>
    </Link>
  );
}
