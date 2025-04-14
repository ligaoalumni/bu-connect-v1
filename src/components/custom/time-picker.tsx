"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface TimePickerProps {
	date: Date | undefined;
	setDate: (date: Date | undefined) => void;
	className?: string;
}

export function TimePicker({ date, setDate, className }: TimePickerProps) {
	// Initialize with current time if no date provided
	const [hour, setHour] = React.useState(() => {
		const h = date
			? date.getHours() % 12 || 12
			: new Date().getHours() % 12 || 12;
		return h.toString().padStart(2, "0");
	});

	const [minute, setMinute] = React.useState(() => {
		const m = date ? date.getMinutes() : new Date().getMinutes();
		return m.toString().padStart(2, "0");
	});

	const [period, setPeriod] = React.useState<"AM" | "PM">(() => {
		const hours = date ? date.getHours() : new Date().getHours();
		return hours >= 12 ? "PM" : "AM";
	});

	// Generate hours (01-12)
	const hours = React.useMemo(
		() =>
			Array.from({ length: 12 }, (_, i) => (i + 1).toString().padStart(2, "0")),
		[]
	);

	// Generate minutes (00, 15, 30, 45)
	const minutes = React.useMemo(
		() =>
			Array.from({ length: 4 }, (_, i) => (i * 15).toString().padStart(2, "0")),
		[]
	);
	// const minutes = React.useMemo(
	// 	() => Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, "0")),
	// 	[]
	// );

	const updateDate = React.useCallback(
		(hour: string, minute: string, period: "AM" | "PM") => {
			const newDate = new Date(date || new Date());
			const isPM = period === "PM";
			const hours = Number.parseInt(hour);

			newDate.setHours(
				isPM ? (hours === 12 ? 12 : hours + 12) : hours === 12 ? 0 : hours,
				Number.parseInt(minute)
			);

			setDate(newDate);
		},
		[setDate, date]
	);

	const handleHourChange = (newHour: string) => {
		setHour(newHour);
		updateDate(newHour, minute, period);
	};

	const handleMinuteChange = (newMinute: string) => {
		setMinute(newMinute);
		updateDate(hour, newMinute, period);
	};

	const handlePeriodChange = () => {
		const newPeriod = period === "AM" ? "PM" : "AM";
		setPeriod(newPeriod);
		updateDate(hour, minute, newPeriod);
	};

	return (
		<div className={cn("flex items-center gap-1", className)}>
			<Select value={hour} onValueChange={handleHourChange}>
				<SelectTrigger className="w-[60px]">
					<SelectValue placeholder="Hour" />
				</SelectTrigger>
				<SelectContent>
					{hours.map((hour) => (
						<SelectItem key={hour} value={hour}>
							{hour}
						</SelectItem>
					))}
				</SelectContent>
			</Select>

			<span className="text-sm text-muted-foreground">:</span>

			<Select value={minute} onValueChange={handleMinuteChange}>
				<SelectTrigger className="w-[60px]">
					<SelectValue placeholder="Minute" />
				</SelectTrigger>
				<SelectContent>
					{minutes.map((minute) => (
						<SelectItem key={minute} value={minute}>
							{minute}
						</SelectItem>
					))}
				</SelectContent>
			</Select>

			<Button
				variant="outline"
				size="sm"
				type="button"
				className="w-[40px]"
				onClick={handlePeriodChange}>
				{period}
			</Button>
		</div>
	);
}
