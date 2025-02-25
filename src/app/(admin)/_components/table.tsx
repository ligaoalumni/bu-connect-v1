"use client";

import { useState } from "react";
import {
	ColumnFiltersState,
	SortingState,
	VisibilityState,
	flexRender,
	getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	useReactTable,
} from "@tanstack/react-table";
import { ChevronDown } from "lucide-react";
import {
	Button,
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuTrigger,
	Input,
	ScrollArea,
	ScrollBar,
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components";
import { DataTableProps } from "@/types";
import { PaginationButton } from "./data-table-pagination";
import { PageSizeSelector } from "./page-size-selector";
import { useSearchParams } from "next/navigation";

export default function DataTable<TData, TValue>({
	columns,
	data,
	rowCount,
	pagination,
	filterName = "name",
}: DataTableProps<TData, TValue>) {
	const [sorting, setSorting] = useState<SortingState>([]);
	const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
	const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
	const searchParams = useSearchParams();

	const currentPage = Number(searchParams.get("page")) || 1;
	const pageSize = Number(searchParams.get("limit")) || 10;

	const table = useReactTable({
		data: data ?? [],
		columns,
		onSortingChange: setSorting,
		onColumnFiltersChange: setColumnFilters,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		onColumnVisibilityChange: setColumnVisibility,
		manualPagination: true,
		rowCount,
		initialState: {
			pagination,
		},
		state: {
			sorting,
			columnFilters,
			columnVisibility,
			pagination,
		},
	});

	return (
		<ScrollArea className="w-full border md:border p-2 md:p-2 rounded-lg max-w-[320px]  sm:min-w-[600px] sm:max-w-full mx-auto whitespace-nowrap overflow-x-auto">
			<div className="w-full">
				<div className="flex items-center py-4">
					<Input
						placeholder={`Filter ${filterName}...`}
						value={
							(table.getColumn(filterName)?.getFilterValue() as string) ?? ""
						}
						onChange={(event) =>
							table.getColumn(filterName)?.setFilterValue(event.target.value)
						}
						className="max-w-sm"
					/>
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="outline" className="ml-auto">
								Columns <ChevronDown />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end">
							{table
								.getAllColumns()
								.filter((column) => column.getCanHide())
								.map((column) => {
									return (
										<DropdownMenuCheckboxItem
											key={column.id}
											className="capitalize"
											checked={column.getIsVisible()}
											onCheckedChange={(value) =>
												column.toggleVisibility(!!value)
											}>
											{column.id}
										</DropdownMenuCheckboxItem>
									);
								})}
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
				<div className="rounded-md border">
					<Table>
						<TableHeader>
							{table.getHeaderGroups().map((headerGroup) => (
								<TableRow key={headerGroup.id}>
									{headerGroup.headers.map((header) => {
										return (
											<TableHead key={header.id}>
												{header.isPlaceholder
													? null
													: flexRender(
															header.column.columnDef.header,
															header.getContext()
													  )}
											</TableHead>
										);
									})}
								</TableRow>
							))}
						</TableHeader>
						<TableBody>
							{table.getRowModel().rows?.length ? (
								table.getRowModel().rows.map((row) => (
									<TableRow
										key={row.id}
										data-state={row.getIsSelected() && "selected"}>
										{row.getVisibleCells().map((cell) => (
											<TableCell key={cell.id}>
												{flexRender(
													cell.column.columnDef.cell,
													cell.getContext()
												)}
											</TableCell>
										))}
									</TableRow>
								))
							) : (
								<TableRow>
									<TableCell
										colSpan={columns.length}
										className="h-24 text-center">
										No results.
									</TableCell>
								</TableRow>
							)}
						</TableBody>
					</Table>
				</div>
				<div className="flex mt-5  gap-2 justify-center sm:justify-between   flex-wrap sm:flex-nowrap    items-center">
					<PageSizeSelector currentPageSize={pageSize} total={rowCount} />
					<div>
						<PaginationButton
							currentPage={currentPage}
							pageSize={pageSize}
							totalPages={
								pagination.pageSize > 0
									? Math.floor(rowCount / pagination.pageSize)
									: 0
							}
						/>
					</div>
				</div>
			</div>

			<ScrollBar className="md:hidden block " orientation="horizontal" />
		</ScrollArea>
	);
}
