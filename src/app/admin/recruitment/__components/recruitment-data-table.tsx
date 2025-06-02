"use client";
import React, { useCallback, useEffect, useState } from "react";
import DataTable from "../../_components/table";
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
import { Info, MoreHorizontal, Pencil } from "lucide-react";
import { toast } from "sonner";
import { RecruitmentWithApplicants } from "@/types";
import { readRecruitmentListAction } from "@/actions";
import Link from "next/link";
export default function RecruitmentDataTable() {
	const [data, setData] = useState<RecruitmentWithApplicants[]>([]);
	const [total, setTotal] = useState(0);
	const [pagination, setPagination] = React.useState({
		pageIndex: 0, //initial page index
		pageSize: 10, //default page size
	});
	const [loading, setLoading] = useState(false);

	const columns: ColumnDef<RecruitmentWithApplicants>[] = [
		{
			id: "id",
			header: "#",
			cell: ({ row }) => row.index + 1,
			enableHiding: false,
			enableSorting: true,
		},
		{
			accessorKey: "title",
			enableHiding: true,
			enableSorting: false,
			header: () => <p className="max-w-fit">Title</p>,
			cell: ({ row }) => row.original.eventTitle,
		},
		{
			accessorKey: "status",
			header: "Status",
			enableHiding: true,
			enableSorting: true,
			cell: ({ row }) => {
				return (
					<Badge
						className="capitalize min-w-[80px] rounded-sm max-w-[80px]  flex justify-center "
						variant={
							row.original.status === "OPEN" ? "default" : "destructive"
						}>
						{row.original.status.toLowerCase()}
					</Badge>
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
								<Link href={`/admin/recruitment/${row.original.id}/info`}>
									<Info />
									View Details
								</Link>
							</DropdownMenuItem>
							<DropdownMenuItem
								asChild
								className="  cursor-pointer flex items-center ">
								<Link href={`/admin/recruitment/${row.original.id}/edit`}>
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
				const response = await readRecruitmentListAction({
					filter,
					pagination: {
						limit: pagination.pageSize,
						page: pagination.pageIndex,
					},
				});
				setData(response.data);
				setTotal(response.count);
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
		<>
			<DataTable
				pagination={pagination}
				setPagination={setPagination}
				columns={columns}
				data={data}
				filterName="title"
				rowCount={total}
				loading={loading}
				handleSearch={handleFetchData}
			/>
		</>
	);
}
