"use client";
import React from "react";
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
import { Info, MoreHorizontal, Pencil } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getEventStatus } from "@/lib/event";

export default function EventsDataTable({
	currentPage = 0,
	pageSize = 10,
	data,
	total,
}: {
	currentPage: number;
	pageSize: number;
	total: number;
	data: EventWithPagination[];
}) {
	const [pagination, setPagination] = React.useState({
		pageIndex: currentPage, //initial page index
		pageSize: pageSize, //default page size
	});
	const router = useRouter();

	const columns: ColumnDef<EventWithPagination>[] = [
		// {
		// 	id: "id",
		// 	header: "#",
		// 	cell: ({ row }) => row.index + 1,
		// 	enableHiding: false,
		// 	enableSorting: true,
		// },
		{
			accessorKey: "name",
			header: "Event Name",
			enableHiding: false,
			enableSorting: true,
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
								<Link href={`/events/${row.original.slug}/info`}>
									<Info />
									View Details
								</Link>
							</DropdownMenuItem>
							<DropdownMenuItem
								asChild
								className="  cursor-pointer flex items-center dark:text-white">
								<Link
									href={`/events/${row.original.slug}/edit`}
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

	return (
		<DataTable
			pagination={pagination}
			setPagination={setPagination}
			columns={columns}
			filterName="name"
			data={data}
			rowCount={total}
			handleFilterChange={(queries) => {
				router.push(`/events?${queries}`);
			}}
		/>
	);
}
