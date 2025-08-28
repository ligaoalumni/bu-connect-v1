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
import { OldAccount } from "@prisma/client";
import { formatDate } from "date-fns";
import { readOldAccountsAction } from "@/actions/old-account";

export default function OldAlumniDataTable() {
  const [data, setData] = useState<OldAccount[]>([]);
  const [total, setTotal] = useState(0);
  const [, setUpdateAdmin] = useState<OldAccount | null>(null);
  const [pagination, setPagination] = React.useState({
    pageIndex: 0, //initial page index
    pageSize: 10, //default page size
  });
  const [, setViewAdmin] = useState<OldAccount | null>(null);
  const [loading, setLoading] = useState(false);

  const columns: ColumnDef<OldAccount>[] = [
    {
      id: "id",
      header: "#",
      cell: ({ row }) => row.index + 1,
      enableHiding: false,
      enableSorting: true,
    },
    {
      accessorKey: "firstName",
      enableHiding: false,
      enableSorting: true,
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
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
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
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
      accessorKey: "birthDate",
      header: "Birth Date",
      enableHiding: true,
      enableSorting: true,
      cell: ({ row }) => {
        return formatDate(row.original.birthDate, "MMM dd, yyyy");
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
              <DropdownMenuItem
                onClick={() => setViewAdmin(row.original)}
                className="cursor-pointer"
              >
                <Info />
                View Details
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setUpdateAdmin(row.original)}
                className="  cursor-pointer flex items-center "
              >
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
        const users = await readOldAccountsAction({
          filter,
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
    [pagination],
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
    </>
  );
}
