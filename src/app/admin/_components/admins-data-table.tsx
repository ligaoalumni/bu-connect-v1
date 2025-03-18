"use client";
import React, { useCallback, useEffect, useState } from "react";
import DataTable from "./table";
import { ColumnDef } from "@tanstack/react-table";
import {
	Avatar,
	AvatarFallback,
	AvatarImage,
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
import { toast } from "sonner";
import { UserTableData } from "@/types";
import { readUsers } from "@/models";
import { userStatusColorMap } from "@/constant";
import AdminDetailsModal from "./admin-details-modal";

export default function AdminsDataTable() {
	const [data, setData] = useState<UserTableData[]>([]);
	const [total, setTotal] = useState(0);
	const [pagination, setPagination] = React.useState({
		pageIndex: 0, //initial page index
		pageSize: 10, //default page size
	});
	const [viewAdmin, setViewAdmin] = useState<UserTableData | null>(null);
	const [loading, setLoading] = useState(false);

	const columns: ColumnDef<UserTableData>[] = [
		{
			id: "id",
			header: "#",
			cell: ({ row }) => row.index + 1,
			enableHiding: false,
			enableSorting: true,
		},
		{
			accessorKey: "avatar",
			enableHiding: true,
			enableSorting: false,
			header: () => <p className="max-w-fit">Photo</p>,
			cell: ({ row }) => {
				return (
					<Avatar className="h-8 w-8">
						<AvatarFallback>
							<p className=" uppercase">
								{row.original.firstName[0]}
								{row.original.lastName[0]}
							</p>
						</AvatarFallback>
						<AvatarImage src={row.original.avatar || ""} />
					</Avatar>
				);
			},
		},
		{
			accessorKey: "firstName",
			enableHiding: false,
			enableSorting: true,
			header: ({ column }) => {
				return (
					<Button
						variant="ghost"
						onClick={() =>
							column.toggleSorting(column.getIsSorted() === "asc")
						}>
						First Name
						<ArrowUpDown />
					</Button>
				);
			},
			cell: ({ row }) => {
				return <p className="min-w-[100px]">{row.original.firstName}</p>;
			},
		},
		{
			accessorKey: "lastName",
			enableHiding: false,
			enableSorting: true,
			header: ({ column }) => {
				return (
					<Button
						variant="ghost"
						onClick={() =>
							column.toggleSorting(column.getIsSorted() === "asc")
						}>
						Last Name
						<ArrowUpDown />
					</Button>
				);
			},
			cell: ({ row }) => {
				return <p className="min-w-[100px]">{row.original.lastName}</p>;
			},
		},
		{
			accessorKey: "email",
			enableHiding: false,
			enableSorting: true,
			header: ({ column }) => {
				return (
					<Button
						variant="ghost"
						onClick={() =>
							column.toggleSorting(column.getIsSorted() === "asc")
						}>
						Email
						<ArrowUpDown />
					</Button>
				);
			},
			cell: ({ row }) => {
				return <p className="min-w-[100px]">{row.original.email}</p>;
			},
		},
		{
			accessorKey: "status",
			header: "Status",
			enableHiding: true,
			enableSorting: true,
			cell: ({ row }) => {
				return (
					<Badge
						className="capitalize min-w-[80px] max-w-[80px]  flex justify-center "
						variant={userStatusColorMap[row.original.status]}>
						{row.original.status.toLowerCase()}
					</Badge>
				);
			},
		},
		// {
		// 	accessorKey: "endDate",
		// 	header: "Status",
		// 	cell: ({ row }) =>
		// 		getEventStatus({
		// 			endDate: row.original.endDate || row.original.startDate,
		// 			startDate: row.original.startDate,
		// 			startTime: row.original.startTime,
		// 			endTime: row.original.endTime,
		// 		}),
		// },
		// {
		// 	accessorKey: "startDate",
		// 	header: "Date",
		// 	enableHiding: true,
		// 	cell: ({ row }) => {
		// 		const oneDay = isSameDay(
		// 			row.original.startDate,
		// 			row.original.endDate || row.original.startDate
		// 		);
		// 		const startDate = formatDate(
		// 			new Date(row.original.startDate),
		// 			oneDay ? "MMM dd, yyyy" : "MMM dd "
		// 		);
		// 		const endDate = formatDate(
		// 			new Date(row.original.endDate!),
		// 			"MMM dd, yyyy"
		// 		);
		// 		return (
		// 			<p className="min-w-[100px]">
		// 				{oneDay ? startDate : `${startDate} to ${endDate}`}
		// 			</p>
		// 		);
		// 	},
		// },
		// {
		// 	accessorKey: "startTime",
		// 	header: "Time",
		// 	enableHiding: true,
		// 	cell: ({ row }) => {
		// 		const startTime = format(new Date(row.original.startTime), "hh:mm a");
		// 		const endTime = format(new Date(row.original.endTime), "hh:mm a");

		// 		return <p className="min-w-[100px]">{`${startTime} - ${endTime}`} </p>;
		// 	},
		// },

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
							<DropdownMenuItem
								onClick={() => setViewAdmin(row.original)}
								className="cursor-pointer">
								<Info />
								View Details
							</DropdownMenuItem>
							<DropdownMenuItem
								asChild
								className="  cursor-pointer flex items-center dark:text-white">
								<Link
									// href={`/admin/events/${row.original.slug}/edit`}
									href={"#"}
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
				const users = await readUsers({
					filter,
					role: ["ADMIN"],
					pagination: {
						limit: pagination.pageSize,
						page: pagination.pageIndex,
					},
				});

				setData(users.data);
				setTotal(users.count);
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
				filterName="email"
				rowCount={total}
				loading={loading}
				handleSearch={handleFetchData}
			/>
			{viewAdmin && (
				<AdminDetailsModal
					user={viewAdmin}
					closeModal={() => setViewAdmin(null)}
				/>
			)}
		</>
	);
}
