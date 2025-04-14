import { Calendar } from "lucide-react";
import { format } from "date-fns";
import { Button, Card, CardContent, CardFooter, Skeleton } from "@/components";
import { readOngoingEvent } from "@/models";
import DashboardEventCard, { NoCurrentEvent } from "./dashboard-card-event";

export default async function DashboardEventSection() {
	const events = await readOngoingEvent();
	const today = new Date();
	const currentDate = format(today, "MMMM d, yyyy");
	const dayName = format(today, "EEEE");

	return (
		<section>
			<div className="flex items-center justify-between mb-4">
				<div className="flex items-end gap-2">
					<h2 className="text-2xl font-bold tracking-tight">
						Today&apos;s Events
					</h2>
					<div className="hidden md:block h-8 w-[2px] dark:bg-white/90  bg-black/50" />
					<span className="hidden md:block  dark:text-white/90 text-md text-black/50">
						{dayName}, {currentDate}
					</span>
				</div>
				<Link href="/admin/events">
					<Button variant="outline" size="sm">
						<Calendar className="mr-2 h-4 w-4" />
						View All Events
					</Button>
				</Link>
			</div>

			<div className="grid gap-4 md:grid-cols-2">
				{events.ongoing ? (
					<DashboardEventCard {...events.ongoing} />
				) : (
					<NoCurrentEvent />
				)}
				{events.nextEvent ? (
					<DashboardEventCard {...events.nextEvent} upcoming />
				) : (
					<NoCurrentEvent upcoming />
				)}
			</div>
		</section>
	);
}

import React from "react";
import Link from "next/link";

export function DashboardEventSectionSkeleton() {
	return (
		<div className="">
			<div className="flex items-center justify-between">
				<div className="flex items-end gap-2 pb-4">
					<Skeleton className="h-6 w-48 rounded-lg" />
					<div className="hidden md:block h-8 w-[2px] bg-black/50" />
					<Skeleton className="hidden md:block h-4 w-32 rounded-lg" />
				</div>
				<Skeleton className="h-8 w-32" />
			</div>
			<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
				<Card>
					<CardContent className="pt-6">
						<div className="flex justify-between items-start mb-2">
							<div>
								<Skeleton className="h-6 w-32 mb-2" />
								<Skeleton className="h-4 w-40" />
							</div>
							<Skeleton className="h-6 w-20" />
						</div>

						<div className="space-y-4 mt-4">
							<div className="flex items-center">
								<Skeleton className="h-4 w-4 mr-2 rounded-full" />
								<Skeleton className="h-4 w-40" />
							</div>

							<div className="flex items-center">
								<Skeleton className="h-4 w-4 mr-2 rounded-full" />
								<Skeleton className="h-4 w-48" />
							</div>

							<div className="flex items-center justify-between">
								<div className="flex items-center">
									<Skeleton className="h-4 w-4 mr-2 rounded-full" />
									<Skeleton className="h-4 w-20" />
								</div>
								<Skeleton className="h-4 w-16" />
							</div>
						</div>
					</CardContent>

					<CardFooter className="pb-6 pt-2">
						<Skeleton className="h-10 w-full" />
					</CardFooter>
				</Card>

				<Card>
					<CardContent className="pt-6">
						<div className="flex justify-between items-start mb-2">
							<div>
								<Skeleton className="h-6 w-28 mb-2" />
								<Skeleton className="h-4 w-36" />
							</div>
							<Skeleton className="h-6 w-24" />
						</div>

						<div className="space-y-4 mt-4">
							<div className="flex items-center">
								<Skeleton className="h-4 w-4 mr-2 rounded-full" />
								<Skeleton className="h-4 w-36" />
							</div>

							<div className="flex items-center">
								<Skeleton className="h-4 w-4 mr-2 rounded-full" />
								<Skeleton className="h-4 w-52" />
							</div>

							<div className="flex items-center justify-between">
								<div className="flex items-center">
									<Skeleton className="h-4 w-4 mr-2 rounded-full" />
									<Skeleton className="h-4 w-24" />
								</div>
								<Skeleton className="h-4 w-16" />
							</div>
						</div>
					</CardContent>

					<CardFooter className="pb-6 pt-2">
						<Skeleton className="h-10 w-full" />
					</CardFooter>
				</Card>
			</div>
		</div>
	);
}
