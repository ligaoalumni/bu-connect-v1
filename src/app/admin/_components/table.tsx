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
import { ChevronDown, Search, X } from "lucide-react";
import {
  Button,
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  InputWithIcon,
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
import { DataTablePagination } from "./pagination";
import { LoadingOverlay } from "./loading-overlay";

export default function DataTable<TData, TValue, FOption>({
  columns,
  data,
  rowCount,
  pagination,
  setPagination,
  loading,
  handleSearch,
  filterName,
  onOptionChange,
  optionValue,
  options,
  optionLabel,
}: DataTableProps<TData, TValue, FOption>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [filterInput, setFilterInput] = useState("");

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
    onPaginationChange: setPagination,
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
    <ScrollArea className="w-full border md:border p-2 md:p-2 rounded-lg max-w-[90vw]   mx-auto whitespace-nowrap overflow-x-auto">
      <div className="w-full p-1">
        <div className="flex items-center justify-between py-4">
          <div className="flex items-center gap-2">
            {filterName && (
              <>
                <InputWithIcon
                  className=""
                  hasPadding
                  endIcon={
                    filterInput ? (
                      <X
                        className="h-4 w-4"
                        onClick={() => {
                          if (handleSearch) {
                            handleSearch("");
                            setFilterInput("");
                          }
                        }}
                      />
                    ) : undefined
                  }
                  inputProps={{
                    placeholder: `Filter by ${filterName}...`,
                    className: "max-w-sm",
                    value: filterInput,
                    onChange: (e) => setFilterInput(e.target.value),
                    onKeyUp: (e) => {
                      if (e.key === "Enter" && handleSearch && filterInput) {
                        handleSearch(filterInput);
                      }
                    },
                  }}
                />
                <Button
                  onClick={() => {
                    if (handleSearch && filterInput) {
                      handleSearch(filterInput);
                    }
                  }}
                  size="icon"
                  className="px-5"
                >
                  <Search />
                </Button>
              </>
            )}
          </div>
          <div className="flex gap-2">
            {options && (
              <DropdownMenu>
                <DropdownMenuTrigger disabled={loading} asChild>
                  <Button variant="outline" className="ml-auto">
                    {optionLabel ? optionLabel : "Filter"} <ChevronDown />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                  <DropdownMenuLabel>Select Batch</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuRadioGroup
                    value={optionValue}
                    onValueChange={(v) => {
                      if (onOptionChange) {
                        onOptionChange(v);
                      }
                    }}
                  >
                    <DropdownMenuRadioItem key={`all`} value={"all"}>
                      All
                    </DropdownMenuRadioItem>
                    {options.map((opt: any, index) => {
                      return (
                        <DropdownMenuRadioItem
                          key={`${index}-${opt}`}
                          value={opt.toString()}
                        >
                          {opt.toString()}
                        </DropdownMenuRadioItem>
                      );
                    })}
                  </DropdownMenuRadioGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
            <DropdownMenu>
              <DropdownMenuTrigger disabled={loading} asChild>
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
                        }
                      >
                        {column.id}
                      </DropdownMenuCheckboxItem>
                    );
                  })}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <div className="rounded-md border">
          <LoadingOverlay isLoading={loading}>
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
                                header.getContext(),
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
                      data-state={row.getIsSelected() && "selected"}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext(),
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center"
                    >
                      No results.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </LoadingOverlay>
        </div>
        <DataTablePagination total={rowCount} table={table} />
      </div>

      <ScrollBar className="md:hidden block " orientation="horizontal" />
    </ScrollArea>
  );
}
