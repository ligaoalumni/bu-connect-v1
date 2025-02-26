"use client";
import React, { useCallback, useEffect, useState } from "react";
import DataTable from "./table";
import { ColumnDef } from "@tanstack/react-table";
import { EventWithPagination } from "@/types";
import { format, formatDate, isSameDay } from "date-fns";
import {
	Button,
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuTrigger,
} from "@/components";
import { ArrowUpDown, Info, MoreHorizontal, Pencil } from "lucide-react";
import Link from "next/link";
import { getEventStatus } from "@/lib/event";
import { readEventsAction } from "@/actions";
import { toast } from "sonner";

export default function EventsDataTable() {
	const [data, setData] = useState<EventWithPagination[]>([]);
	const [total, setTotal] = useState(0);
	const [pagination, setPagination] = React.useState({
		pageIndex: 0, //initial page index
		pageSize: 10, //default page size
	});
	const [loading, setLoading] = useState(false);

	const columns: ColumnDef<EventWithPagination>[] = [
		{
			id: "id",
			header: "#",
			cell: ({ row }) => row.index + 1,
			enableHiding: false,
			enableSorting: true,
		},
		{
			accessorKey: "name",
			enableHiding: false,
			enableSorting: true,
			header: ({ column }) => {
				return (
					<Button
						variant="ghost"
						onClick={() =>
							column.toggleSorting(column.getIsSorted() === "asc")
						}>
						Event
						<ArrowUpDown />
					</Button>
				);
			},
			cell: ({ row }) => {
				return <p className="min-w-[100px]">{row.original.name}</p>;
			},
		},
		{
			accessorKey: "location",
			header: "Location",
			enableHiding: true,
			enableSorting: true,
			cell: ({ row }) => {
				return <p className="min-w-[100px]">{row.original.location}</p>;
			},
		},
		{
			accessorKey: "endDate",
			header: "Status",
			cell: ({ row }) =>
				getEventStatus({
					endDate: row.original.endDate || row.original.startDate,
					startDate: row.original.startDate,
					startTime: row.original.startTime,
					endTime: row.original.endTime,
				}),
		},
		{
			accessorKey: "startDate",
			header: "Date",
			enableHiding: true,
			cell: ({ row }) => {
				const oneDay = isSameDay(
					row.original.startDate,
					row.original.endDate || row.original.startDate
				);
				const startDate = formatDate(
					new Date(row.original.startDate),
					oneDay ? "MMM dd, yyyy" : "MMM dd "
				);
				const endDate = formatDate(
					new Date(row.original.endDate!),
					"MMM dd, yyyy"
				);
				return (
					<p className="min-w-[100px]">
						{oneDay ? startDate : `${startDate} to ${endDate}`}
					</p>
				);
			},
		},
		{
			accessorKey: "startTime",
			header: "Time",
			enableHiding: true,
			cell: ({ row }) => {
				const startTime = format(new Date(row.original.startTime), "hh:mm a");
				const endTime = format(new Date(row.original.endTime), "hh:mm a");

				return <p className="min-w-[100px]">{`${startTime} - ${endTime}`} </p>;
			},
		},

		{
			id: "actions",
			enableHiding: false,
			cell: ({ row }) => {
				return (
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="ghost" className="h-8 w-8 p-0">
								<span className="sr-only">Open menu</span>
								<MoreHorizontal />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end">
							<DropdownMenuLabel>Actions</DropdownMenuLabel>
							<DropdownMenuItem asChild className="cursor-pointer">
								<Link href={`/admin/events/${row.original.slug}/info`}>
									<Info />
									View Details
								</Link>
							</DropdownMenuItem>
							<DropdownMenuItem
								asChild
								className="  cursor-pointer flex items-center dark:text-white">
								<Link
									href={`/admin/events/${row.original.slug}/edit`}
									className="text-blue-500   ">
									<Pencil />
									Edit Event
								</Link>
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				);
			},
		},
	];

	const handleFetchData = useCallback(
		async (filter?: string) => {
			try {
				setLoading(true);
				const events = await readEventsAction({
					filter,
					pagination: {
						limit: pagination.pageSize,
						page: pagination.pageIndex,
					},
				});

				setData(events.data);
				setTotal(events.count);
			} catch (error) {
				toast.error(`Failed to fetch events`, {
					description: (error as Error).message,
					richColors: true,
					position: "top-center",
					duration: 5000,
				});
			} finally {
				setLoading(false);
			}
		},
		[pagination]
	);

	useEffect(() => {
		handleFetchData();
	}, [handleFetchData]);

	return (
		<DataTable
			pagination={pagination}
			setPagination={setPagination}
			columns={columns}
			data={data}
			filterName="events"
			rowCount={total}
			loading={loading}
			handleSearch={handleFetchData}
		/>
	);
}
