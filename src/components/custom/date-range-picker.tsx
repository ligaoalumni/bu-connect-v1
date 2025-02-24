"use client";

import * as React from "react";
import { add, format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { DateRange } from "react-day-picker";

export function DateTimePicker() {
	const [date, setDate] = React.useState<Date>();

	/**
	 * carry over the current time when a user clicks a new day
	 * instead of resetting to 00:00
	 */
	const handleSelect = (newDay: Date | undefined) => {
		if (!newDay) return;
		if (!date) {
			setDate(newDay);
			return;
		}
		const diff = newDay.getTime() - date.getTime();
		const diffInDays = diff / (1000 * 60 * 60 * 24);
		const newDateFull = add(date, { days: Math.ceil(diffInDays) });
		setDate(newDateFull);
	};

	return (
		<Popover>
			<PopoverTrigger asChild>
				<Button
					variant={"outline"}
					className={cn(
						"w-[280px] justify-start text-left font-normal",
						!date && "text-muted-foreground"
					)}>
					<CalendarIcon className="mr-2 h-4 w-4" />
					{date ? format(date, "PPP HH:mm:ss") : <span>Pick a date</span>}
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-auto p-0">
				<Calendar
					mode="single"
					selected={date}
					onSelect={(d) => handleSelect(d)}
					initialFocus
				/>
			</PopoverContent>
		</Popover>
	);
}

export function DatePickerWithRange({
	className,
	handleValue,
}: React.HTMLAttributes<HTMLDivElement> & {
	handleValue: (date: DateRange) => void;
}) {
	const [date, setDate] = React.useState<DateRange | undefined>(undefined);

	return (
		<div className={cn("grid gap-2", className)}>
			<Popover>
				<PopoverTrigger asChild>
					<Button
						id="date"
						variant={"outline"}
						className={cn(
							"w-full justify-start text-left font-normal",
							!date && "text-muted-foreground"
						)}>
						<CalendarIcon />
						{date?.from ? (
							date.to ? (
								<>
									{format(date.from, "LLL dd, y")} -{" "}
									{format(date.to, "LLL dd, y")}
								</>
							) : (
								format(date.from, "LLL dd, y")
							)
						) : (
							<span>Pick a date</span>
						)}
					</Button>
				</PopoverTrigger>
				<PopoverContent className="w-full p-0" align="center">
					<Calendar
						initialFocus
						mode="range"
						defaultMonth={date?.from}
						selected={date}
						onSelect={(value) => {
							if (value) {
								setDate(value);
								handleValue(value);
							}
						}}
						numberOfMonths={2}
					/>
				</PopoverContent>
			</Popover>
		</div>
	);
}
