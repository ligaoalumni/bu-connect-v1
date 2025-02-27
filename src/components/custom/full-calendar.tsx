"use client";

import * as React from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { CustomButtonInput } from "@fullcalendar/core/index.js";
import { Events, EventWithPagination } from "@/types";
import Link from "next/link";
import { getEventDescription } from "@/lib/event";
import { getHours, getMinutes, isSameMonth } from "date-fns";

// Sample events data

export function FCalendar({ events }: { events: Events }) {
	const calendarRef = React.useRef<any>(null);
	const [weekends, setWeekends] = React.useState(true);

	// Custom toolbar component
	const renderToolbar = {
		left: "prev,next today",
		center: "title",
		right: "dayGridMonth,timeGridWeek,timeGridDay,listWeek",
	};

	// Custom button rendering
	const customButtons = {
		prev: {
			// text: <ChevronLeft className="h-4 w-4" />,
			icon: "chevron-left",
			click: () => {
				if (calendarRef.current) {
					if (isSameMonth(new Date(), calendarRef.current.getApi().getDate())) {
						return;
					}

					calendarRef.current.getApi().prev();
				}
			},
		} as CustomButtonInput,
		next: {
			icon: "chevron-right",
			click: () => {
				if (calendarRef.current) {
					calendarRef.current.getApi().next();
				}
			},
		} as CustomButtonInput,
		today: {
			text: "Today",
			click: () => {
				if (calendarRef.current) {
					calendarRef.current.getApi().today();
				}
			},
		},
	};

	// Handle view change
	// const handleViewChange = (newView: string) => {
	// 	if (calendarRef.current) {
	// 		const calendar = calendarRef.current.getApi();
	// 		calendar.changeView(newView);
	// 		setViewMode(newView);
	// 	}
	// };

	// Custom event rendering
	const renderEvent = (eventInfo: any) => {
		return (
			<Link
				href={`/events/${eventInfo.event.id}/info`}
				className="relative overflow-hidden p-2"
				suppressHydrationWarning>
				{/* <GripVertical className="h-3 w-3" /> */}
				<h1 className="block  ">{eventInfo.event.title}</h1>

				<p className="block  ">
					{getEventDescription({
						startDate: eventInfo.event.start,
						endDate: eventInfo.event.end,
						location: eventInfo.event.location,
						startTime: new Date(
							new Date().setHours(
								getHours(eventInfo.event.start),
								getMinutes(eventInfo.event.start),
								0,
								0
							)
						),
						endTime: new Date(
							new Date().setHours(
								getHours(eventInfo.event.end),
								getMinutes(eventInfo.event.end),
								0,
								0
							)
						),
						slug: eventInfo.event.id,
						name: eventInfo.event.title,
					} as EventWithPagination)}
				</p>
			</Link>
		);
	};

	const memoizedEvents = React.useMemo(() => {
		return (
			events.map((event) => ({
				...event,
				id: String(event.id),
				editable: false,
				durationEditable: false,
				interactive: true,
			})) ?? []
		);
	}, [events]);

	return (
		<Card>
			<CardHeader>
				<div className="flex items-center justify-between">
					<div className="space-y-1">
						<CardTitle className="text-2xl">Event Calendar</CardTitle>
						<CardDescription>
							Manage and view upcoming and past events seamlessly.
						</CardDescription>
					</div>
					<div className="flex items-center gap-4">
						<div className="flex items-center space-x-2">
							<Switch
								id="weekends"
								checked={weekends}
								onCheckedChange={setWeekends}
							/>
							<Label htmlFor="weekends">Show weekends</Label>
						</div>
						{/* <DropdownMenu>
							<DropdownMenuTrigger
								asChild
								className="md:flex justify-center hidden">
								<Button variant="outline" size="icon">
									{viewMode.includes("list") ? (
										<List className="h-4 w-4" />
									) : (
										<LayoutGrid className="h-4 w-4" />
									)}
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent align="end">
								<DropdownMenuItem
									onClick={() => handleViewChange("dayGridMonth")}>
									Month view
								</DropdownMenuItem>
								<DropdownMenuItem
									onClick={() => handleViewChange("timeGridWeek")}>
									Week view
								</DropdownMenuItem>
								<DropdownMenuItem
									onClick={() => handleViewChange("timeGridDay")}>
									Day view
								</DropdownMenuItem>
								<DropdownMenuItem onClick={() => handleViewChange("listWeek")}>
									List view
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu> */}
					</div>
				</div>
			</CardHeader>
			<CardContent>
				<style>
					{`
            .fc {
              --fc-border-color: hsl(var(--border));
              --fc-button-bg-color: transparent;
              --fc-button-border-color: hsl(var(--border));
              --fc-button-text-color: hsl(var(--foreground));
              --fc-button-hover-bg-color: hsl(var(--secondary));
              --fc-button-hover-border-color: hsl(var(--secondary));
              --fc-button-active-bg-color: hsl(var(--primary));
              --fc-button-active-border-color: hsl(var(--primary));
              --fc-event-bg-color: hsl(var(--primary));
              --fc-event-border-color: hsl(var(--primary));
              --fc-event-text-color: hsl(var(--primary-foreground));
              --fc-event-selected-overlay-color: rgba(0, 0, 0, 0.25);
              --fc-page-bg-color: hsl(var(--background));
              --fc-neutral-bg-color: hsl(var(--secondary));
              --fc-list-event-hover-bg-color: hsl(var(--secondary));
              --fc-today-bg-color: hsl(var(--secondary)/0.2);
              max-width: 100%;
              font-family: inherit;
            }

            .fc .fc-toolbar {
              flex-wrap: wrap;
              gap: 1rem;
            }

            .fc .fc-toolbar-title {
              font-size: 1.25rem;
              font-weight: 600;
            }

            .fc .fc-button {
              padding: 0.5rem 1rem;
              font-weight: 500;
              border-radius: var(--radius);
              height: 2.5rem;
              min-width: 2.5rem;
              display: inline-flex;
              align-items: center;
              justify-content: center;
            }

            .fc .fc-button-group {
              border-radius: var(--radius);
              overflow: hidden;
            }

            .fc .fc-button-primary:not(:disabled):active,
            .fc .fc-button-primary:not(:disabled).fc-button-active {
              color: hsl(var(--primary-foreground));
            }

            .fc .fc-button-primary:disabled {
              opacity: 0.5;
              cursor: not-allowed;
            }

            .fc .fc-daygrid-day.fc-day-today,
            .fc .fc-timegrid-col.fc-day-today {
              background-color: hsl(var(--secondary)/0.2) !important;
            }

            .fc .fc-daygrid-day-frame {
              padding: 0.25rem;
            }

            .fc .fc-list-sticky .fc-list-day > * {
              background-color: hsl(var(--background));
            }

            .fc .fc-list-event:hover td {
              background-color: hsl(var(--secondary)/0.5);
            }

            @media (max-width: 768px) {
              .fc .fc-toolbar {
                justify-content: flex-start;
              }

              .fc .fc-toolbar-title {
                font-size: 1rem;
              }

              .fc .fc-button {
                padding: 0.25rem 0.5rem;
              }
            }
          `}
				</style>
				<FullCalendar
					ref={calendarRef}
					plugins={[
						dayGridPlugin,
						timeGridPlugin,
						interactionPlugin,
						listPlugin,
					]}
					initialView="dayGridMonth"
					headerToolbar={renderToolbar}
					customButtons={customButtons}
					events={memoizedEvents}
					eventContent={renderEvent}
					weekends={weekends}
					editable={false}
					selectable={false}
					selectMirror={true}
					dayMaxEvents={true}
					weekNumbers={true}
					// nowIndicator={true}
					height={"80vh"}
					stickyHeaderDates={true}
					views={{
						dayGridMonth: {
							titleFormat: { year: "numeric", month: "long" },
						},
						timeGridWeek: {
							titleFormat: { year: "numeric", month: "long", day: "numeric" },
						},
						timeGridDay: {
							titleFormat: { year: "numeric", month: "long", day: "numeric" },
						},
						listWeek: {
							titleFormat: { year: "numeric", month: "long" },
						},
					}}
				/>
			</CardContent>
		</Card>
	);
}

export default FCalendar;
