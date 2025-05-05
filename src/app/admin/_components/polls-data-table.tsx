"use client";

import React, { useCallback, useEffect, useState } from "react";
import DataTable from "./table";
import { ColumnDef } from "@tanstack/react-table";
import {
	Badge,
	Button,
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuTrigger,
} from "@/components";
import { ArrowUpDown, Info, MoreHorizontal, Pencil } from "lucide-react";
import Link from "next/link";
import { readPollsAction } from "@/actions";
import { toast } from "sonner";
import { Poll } from "@prisma/client";
import { JobStatusBadgeColorMap } from "@/constant";

export function PollsDataTable() {
	const [data, setData] = useState<Poll[]>([]);
	const [total, setTotal] = useState(0);
	const [pagination, setPagination] = React.useState({
		pageIndex: 0, //initial page index
		pageSize: 10, //default page size
	});
	const [loading, setLoading] = useState(false);

	const columns: ColumnDef<Poll>[] = [
		{
			id: "id",
			header: "#",
			cell: ({ row }) => row.index + 1,
			enableHiding: false,
			enableSorting: true,
		},
		{
			accessorKey: "question",
			enableHiding: false,
			enableSorting: true,
			header: ({ column }) => {
				return (
					<Button
						variant="ghost"
						onClick={() =>
							column.toggleSorting(column.getIsSorted() === "asc")
						}>
						Question
						<ArrowUpDown />
					</Button>
				);
			},
			cell: ({ row }) => {
				return <p className="min-w-[100px]">{row.original.question}</p>;
			},
		},
		{
			accessorKey: "status",
			header: "Status",
			enableHiding: true,
			cell: ({ row }) => {
				return (
					<div className="min-w-[100px] first-letter:uppercase">
						<Badge
							variant={JobStatusBadgeColorMap[row.original.status]}
							className="capitalize">
							{row.original.status.toLowerCase()}
						</Badge>
					</div>
				);
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
								<Link href={`/admin/polls/${row.original.id}`}>
									<Info />
									View Details
								</Link>
							</DropdownMenuItem>
							<DropdownMenuItem
								asChild
								className="  cursor-pointer flex items-center ">
								<Link
									href={`/admin/polls/${row.original.id}/edit`}
									className="text-blue-500   ">
									<Pencil />
									Edit Details
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
				const jobs = await readPollsAction({
					filter,
					pagination: {
						limit: pagination.pageSize,
						page: pagination.pageIndex,
					},
				});

				setData(jobs.data);
				setTotal(jobs.count);
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
