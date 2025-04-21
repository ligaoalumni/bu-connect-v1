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
import { getEventStatus } from "@/lib/event";
import { EventWithPagination } from "@/types";
import { eventStatusColorMap } from "@/constant";
import { Button } from "../ui/button";
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

	return (
		<Card className="overflow-hidden transition-all hover:shadow-md">
			<div className="relative h-48 w-full overflow-hidden">
				<Image
					fill
					src={event.coverImg || "/images/placeholder.jpg"}
					alt={event.name}
					className={`${
						event.coverImg ? "object-contain" : "object-cover"
					} h-full w-full `}
				/>
				{event.showStatus && (
					<Badge
						variant={eventStatusColorMap[status]}
						className="absolute right-3 top-3">
						{status}
					</Badge>
				)}
			</div>

			{!event.imageOnly && (
				<>
					<CardHeader className=" ">
						<h3 className="text-xl font-semibold line-clamp-2">{event.name}</h3>
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
							<Button className="bg-emerald-600 hover:bg-emerald-500">
								Join Event
							</Button>
						)}
					</CardContent>
					{event.interested > 0 ||
						(event.alumni > 0 && (
							<CardFooter className="flex items-center justify-between pt-2 border-t">
								<div className="flex items-center gap-4">
									{status == "Upcoming Event" && event.interested > 0 && (
										<div className="flex flex-col">
											<div className="flex flex-col">
												<span className="text-xs text-muted-foreground">
													Interested
												</span>
												<span className="font-medium">{event.interested}</span>
											</div>
											<Button>Join</Button>
										</div>
									)}
									{event.alumni > 0 && (
										<div className="flex flex-col">
											<span className="text-xs text-muted-foreground">
												{status === "Past Event" ? "Attended" : "Alumni"}
											</span>
											<span className="font-medium">{event.alumni}</span>
										</div>
									)}
								</div>
							</CardFooter>
						))}
				</>
			)}
		</Card>
	);
}
