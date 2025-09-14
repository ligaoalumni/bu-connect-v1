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
import Link from "next/link";
import { readAnnouncementsAction } from "@/actions";
import { toast } from "sonner";
import { Announcement } from "@prisma/client";
import { useAuth } from "@/contexts";

export default function AnnouncementsDataTable() {
  const { user } = useAuth();
  const [data, setData] = useState<Announcement[]>([]);
  const [total, setTotal] = useState(0);
  const [pagination, setPagination] = React.useState({
    pageIndex: 0, //initial page index
    pageSize: 10, //default page size
  });
  const [loading, setLoading] = useState(false);

  const columns: ColumnDef<Announcement>[] = [
    {
      id: "id",
      header: "#",
      cell: ({ row }) => row.index + 1,
      enableHiding: false,
      enableSorting: true,
    },
    {
      accessorKey: "title",
      enableHiding: false,
      enableSorting: true,
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Title
            <ArrowUpDown />
          </Button>
        );
      },
      cell: ({ row }) => {
        return <p className="min-w-[100px]">{row.original.title}</p>;
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
                <Link
                  href={
                    user?.role === "ALUMNI"
                      ? `/announcements/${row.original.slug}`
                      : `/admin/announcements/${row.original.slug}/info`
                  }
                >
                  <Info />
                  View Details
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                asChild
                className="  cursor-pointer flex items-center "
              >
                <Link
                  href={
                    user?.role === "ALUMNI"
                      ? `/announcements/${row.original.slug}/edit`
                      : `/admin/announcements/${row.original.slug}/edit`
                  }
                  className="text-blue-500   "
                >
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
        const events = await readAnnouncementsAction({
          filter,
          pagination: {
            limit: pagination.pageSize,
            page: pagination.pageIndex,
          },
          id: user?.id,
        });

        setData(events.data);
        setTotal(events.count);
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
    [pagination, user?.id],
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
      filterName="title"
      rowCount={total}
      loading={loading}
      handleSearch={handleFetchData}
    />
  );
}
