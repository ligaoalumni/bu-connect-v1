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
import { ArrowUpDown, Info, MoreHorizontal, Pencil } from "lucide-react";
import { toast } from "sonner";
import VerifyAlumniModal from "./verify-alumni-modal";
import { readAlumniAccounts } from "@/actions/alumni-account";
import { AlumniAccount } from "@prisma/client";

export default function AlumniAccountsDataTable() {
	const [data, setData] = useState<AlumniAccount[]>([]);
	const [total, setTotal] = useState(0);
	const [verifyAlumni, setVerifyAlumni] = useState<AlumniAccount | null>(null);
	const [pagination, setPagination] = React.useState({
		pageIndex: 0, //initial page index
		pageSize: 10, //default page size
	});
	const [alumniAccount, setAlumniAccount] = useState<AlumniAccount | null>(
		null
	);
	const [loading, setLoading] = useState(false);

	const columns: ColumnDef<AlumniAccount>[] = [
		{
			id: "id",
			header: "#",
			cell: ({ row }) => row.index + 1,
			enableHiding: false,
			enableSorting: true,
		},
		{
			accessorKey: "LRN",
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

			enableSorting: false,
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
								onClick={() => setAlumniAccount(row.original)}
								className="cursor-pointer">
								<Info />
								View Details
							</DropdownMenuItem>
							<DropdownMenuItem
								onClick={() => setVerifyAlumni(row.original)}
								className="  cursor-pointer flex items-center dark:text-white">
								<Pencil />
								Update Status
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
				const data = await readAlumniAccounts(
					{
						filter,
						pagination: {
							limit: pagination.pageSize,
							page: pagination.pageIndex,
						},
					},
					true
				);

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
					closeModal={() => setAlumniAccount(null)}
				/>
			)} */}
			{verifyAlumni && (
				<VerifyAlumniModal
					alumni={verifyAlumni}
					closeModal={() => {
						setVerifyAlumni(null);
					}}
				/>
			)}
		</>
	);
}
