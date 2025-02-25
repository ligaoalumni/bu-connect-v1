import { AspectRatio, Button, RichTextEditor } from "@/components";
import { readEvent } from "@/models";
import { format, formatDate, isSameDay } from "date-fns";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import React from "react";

async function getEvent(slug: string) {
	const event = await readEvent(slug);

	if (!event) {
		notFound();
	}

	return event;
}

export default async function Event({ params }: { params: { slug: string } }) {
	const { slug } = await params;
	const event = await getEvent(slug);

	const isOneDay = isSameDay(
		event.startDate,
		event?.endDate || event.startDate
	);
	const startDate = formatDate(
		event.startDate,
		isOneDay ? "MMMM d, yyyy" : "MMMM d,"
	);
	const endDate = formatDate(event!.endDate!, "- MMMM dd, yyyy");
	const date = `${startDate}${isOneDay ? "" : endDate}`;

	return (
		<div className="space-y-3">
			<div className="flex justify-between items-center">
				<h1 className="text-3xl font-medium">{event.name}</h1>
				<Link href={`/events/${event.slug}/edit`}>
					<Button>Edit</Button>
				</Link>
			</div>
			<div className="grid md:grid-cols-10 md:gap-5 lg:gap-8 gap-3 xl:gap-10">
				<div className="md:col-span-6  ">
					{event?.coverImg && (
						<AspectRatio ratio={16 / 9} className="bg-muted   shrink  ">
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
				<div className="md:col-span-4 space-y-4">
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
			</div>
		</div>
	);
}
