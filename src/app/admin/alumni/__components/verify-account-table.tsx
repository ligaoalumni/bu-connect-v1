"use client";
import React, { useCallback, useEffect, useState } from "react";
import DataTable from "../../_components/table";
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
import { User } from "@prisma/client";
import { formatDate } from "date-fns";
import Link from "next/link";
import { getOldAccountsToVerifyAction } from "@/actions";

export default function VerifyAccountDataTable() {
  const [filterBatch, setFilterBatch] = useState<string | undefined>(undefined);
  const [data, setData] = useState<User[]>([]);
  const [total, setTotal] = useState(0);
  const [onOpen, onOpenChange] = useState(false);
  const [oldAcc, setOldAcc] = useState<User | null>(null);
  const [pagination, setPagination] = React.useState({
    pageIndex: 0, //initial page index
    pageSize: 10, //default page size
  });
  const [loading, setLoading] = useState(false);

  const columns: ColumnDef<User>[] = [
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
      accessorKey: "batch",
      header: "Batch",
      enableHiding: true,
      enableSorting: true,
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
                asChild
                className="  cursor-pointer flex items-center "
              >
                <Link href={`/admin/alumni/old/verify/${row.original.id}`}>
                  <Pencil />
                  Verify
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const handleFetchData = useCallback(
    async ({ filter }: { filter?: string } = {}) => {
      try {
        setLoading(true);
        const users = await getOldAccountsToVerifyAction({
          filter,
          pagination: {
            limit: pagination.pageSize,
            page: pagination.pageIndex,
          },
        });

        setData((users.data as User[]) || []);
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
    handleFetchData({ filter: filterBatch });
  }, [handleFetchData, filterBatch]);

  return (
    <>
      <DataTable
        onOptionChange={setFilterBatch}
        optionValue={filterBatch}
        pagination={pagination}
        setPagination={setPagination}
        columns={columns}
        data={data}
        // filterName="email"
        rowCount={total}
        loading={loading}
      />
    </>
  );
}
