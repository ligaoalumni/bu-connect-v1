"use client";

import React, { useCallback, useEffect, useState } from "react";
import DataTable from "./table";
import { ColumnDef } from "@tanstack/react-table";
import {
	Button,
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuTrigger,
} from "@/components";
import { ArrowUpDown, Info, MoreHorizontal } from "lucide-react";
import { toast } from "sonner";
import { readAlumniRecords } from "@/actions/alumni-account";
import { Alumni } from "@prisma/client";

export default function AlumniDataTable() {
	const [data, setData] = useState<Alumni[]>([]);
	const [total, setTotal] = useState(0);
	const [pagination, setPagination] = React.useState({
		pageIndex: 0, //initial page index
		pageSize: 10, //default page size
	});
	const [alumni, setAlumni] = useState<Alumni | null>(null);
	const [loading, setLoading] = useState(false);

	console.log(JSON.stringify(data, null, 2));

	const columns: ColumnDef<Alumni>[] = [
		{
			id: "id",
			header: "#",
			cell: ({ row }) => row.index + 1,
			enableHiding: false,
			enableSorting: true,
		},
		{
			accessorKey: "studentId",
			enableHiding: false,
			enableSorting: false,
			header: ({ column }) => {
				return (
					<Button
						variant="ghost"
						onClick={() =>
							column.toggleSorting(column.getIsSorted() === "asc")
						}>
						Student ID
						<ArrowUpDown />
					</Button>
				);
			},
			cell: ({ row }) => {
				return <p className="min-w-[100px]">{row.original.studentId}</p>;
			},
		},
		{
			accessorKey: "lrn",
			enableHiding: false,
			enableSorting: true,
			header: ({ column }) => {
				return (
					<Button
						variant="ghost"
						onClick={() =>
							column.toggleSorting(column.getIsSorted() === "asc")
						}>
						LRN
						<ArrowUpDown />
					</Button>
				);
			},
			cell: ({ row }) => {
				return <p className="min-w-[100px]">{row.original.lrn}</p>;
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
			accessorKey: "graduationYear",
			enableHiding: false,
			enableSorting: true,
			header: ({ column }) => {
				return (
					<Button
						variant="ghost"
						onClick={() =>
							column.toggleSorting(column.getIsSorted() === "asc")
						}>
						Batch
						<ArrowUpDown />
					</Button>
				);
			},
			cell: ({ row }) => {
				return <p className="min-w-[100px]">{row.original.graduationYear}</p>;
			},
		},
		{
			accessorKey: "alumniId",
			enableHiding: false,
			enableSorting: false,
			header: ({ column }) => {
				return <p>Account</p>;
			},
			cell: ({ row }) => {
				if (!row.original.alumniId)
					return <p className="italic  text-gray-500">No data</p>;
				return <p className="min-w-[100px]">{row.original.alumniId}</p>;
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
								onClick={() => setAlumni(row.original)}
								className="cursor-pointer">
								<Info />
								View Details
							</DropdownMenuItem>
							{/* <DropdownMenuItem
								onClick={() => setVerifyAlumni(row.original)}
								className="  cursor-pointer flex items-center dark:text-white">
								<Pencil />
								Update Status
							</DropdownMenuItem> */}
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
				const data = await readAlumniRecords({
					filter,
					pagination: {
						limit: pagination.pageSize,
						page: pagination.pageIndex,
					},
				});

				setData(data.data);
				setTotal(data.count);
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
			{/* {viewAdmin && (
				<AdminDetailsModal
					user={viewAdmin}
					closeModal={() => setAlumni(null)}
				/>
			)} */}
			{/* {verifyAlumni && (
				<VerifyAlumniModal
					alumni={verifyAlumni}
					closeModal={() => {
						setVerifyAlumni(null);
					}}
				/>
			)} */}
		</>
	);
}
