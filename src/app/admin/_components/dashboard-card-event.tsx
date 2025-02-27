import {
	Badge,
	Button,
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components";
import { DashboardEvent } from "@/types";
import { IconClipboardCheck } from "@tabler/icons-react";
import { Calendar, MapPin } from "lucide-react";
import Link from "next/link";
import React from "react";

export default function DashboardEventCard({
	attendees,
	date,
	id,
	location,
	name,
	slug,
	time,
	upcoming = false,
}: DashboardEvent & {
	upcoming?: boolean;
}) {
	return (
		<Card key={id}>
			<CardHeader className="pb-2">
				<div className="flex items-center justify-between">
					<CardTitle>{name}</CardTitle>
					<Badge variant={upcoming ? "outline" : "default"}>
						{upcoming ? "Next Event" : "Ongoing"}
					</Badge>
				</div>
				<CardDescription>{time}</CardDescription>
			</CardHeader>
			<CardContent>
				<div className="flex items-center text-sm  gap-2">
					<MapPin className="h-4 w-4 text-muted-foreground " />
					<span>{location}</span>
				</div>
				<div className="mt-2 flex items-center text-sm  gap-2">
					<Calendar className=" h-4 w-4 text-muted-foreground" />
					<span>{date}</span>
				</div>
				<div className="mt-2 flex items-center text-sm justify-between  ">
					<div className="flex items-center justify-start gap-[0.4rem] ">
						<IconClipboardCheck className=" h-[1.125rem] w-[1.125rem] text-muted-foreground" />
						<span>{upcoming ? "Interested" : "Attendance"}</span>
					</div>
					{attendees ? (
						<span className="font-medium">{attendees} alumni</span>
					) : (
						<i className="text-gray-400">No Data yet</i>
					)}
				</div>
			</CardContent>
			<CardFooter>
				<Button asChild variant="outline" size="sm" className="w-full">
					<Link href={`/admin/events/${slug}/info`}>Manage Event</Link>
				</Button>
			</CardFooter>
		</Card>
	);
}

export function NoCurrentEvent({ upcoming = false }: { upcoming?: boolean }) {
	return (
		<Card>
			<CardContent className="flex flex-col items-center justify-center py-10">
				<Calendar className="h-10 w-10 text-muted-foreground mb-4" />
				<p className="text-lg font-medium">
					{upcoming
						? "Upcoming event details will be updated soon"
						: "No events scheduled for today"}
				</p>
				<p className="text-sm text-muted-foreground mt-1">
					{upcoming
						? "Keep an eye on the calendar for updates"
						: "Check the calendar for upcoming events"}
				</p>
			</CardContent>
		</Card>
	);
}
