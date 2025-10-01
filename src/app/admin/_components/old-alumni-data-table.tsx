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
import { ArrowUpDown, Info, MoreHorizontal, Pencil, Trash } from "lucide-react";
import { toast } from "sonner";
import { OldAccount } from "@prisma/client";
import { formatDate } from "date-fns";
import {
  deleteOldAccountAction,
  readOldAccountsAction,
} from "@/actions/old-account";
import Link from "next/link";
import { OldAlumniViewModal } from "../alumni/__components/view-old-modal";
import { DeleteModal } from "./delete-modal";

export default function OldAlumniDataTable() {
  const [filterBatch, setFilterBatch] = useState<string | undefined>(undefined);
  const [data, setData] = useState<OldAccount[]>([]);
  const [total, setTotal] = useState(0);
  const [onOpen, onOpenChange] = useState(false);
  const [oldAcc, setOldAcc] = useState<OldAccount | null>(null);
  const [pagination, setPagination] = React.useState({
    pageIndex: 0, //initial page index
    pageSize: 10, //default page size
  });
  const [toDelete, setToDelete] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);
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
                onClick={() => {
                  setOldAcc(row.original);
                  onOpenChange(true);
                }}
                className="cursor-pointer"
              >
                <Info />
                View
              </DropdownMenuItem>
              <DropdownMenuItem
                asChild
                className="  cursor-pointer flex items-center "
              >
                <Link href={`/admin/alumni/old/${row.original.studentId}`}>
                  <Pencil />
                  Edit
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                asChild
                className="  cursor-pointer flex items-center "
              >
                <Button
                  variant="ghost"
                  className="w-full text-destructive flex items-center justify-start"
                  onClick={() => setToDelete(row.original.id)}
                >
                  <Trash />
                  Delete
                </Button>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const handleFetchData = useCallback(
    async ({ filter, batch }: { filter?: string; batch?: string } = {}) => {
      try {
        setLoading(true);
        const users = await readOldAccountsAction({
          filter,
          pagination: {
            limit: pagination.pageSize,
            page: pagination.pageIndex,
          },
          batch: batch === "all" ? undefined : batch,
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
    handleFetchData({ batch: filterBatch });
  }, [handleFetchData, filterBatch]);

  const currentYear = new Date().getFullYear() - 1;
  const years = Array.from({ length: 75 }, (_, i) => currentYear - i).map((s) =>
    s.toString(),
  );

  return (
    <>
      <DataTable
        optionLabel={
          !!filterBatch && filterBatch !== "all"
            ? `Batch ${filterBatch}`
            : "All Batches"
        }
        options={years}
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
      <OldAlumniViewModal
        open={onOpen}
        onOpenChange={onOpenChange}
        student={oldAcc}
      />
      {toDelete && (
        <DeleteModal
          description={`Are you sure you want to delete this old alumni data? This action cannot be undone.`}
          id={toDelete}
          onClose={() => setToDelete(null)}
          onDelete={async () => {
            try {
              setDeleting(true);

              await deleteOldAccountAction(toDelete);

              toast.success("Old alumni data deleted successfully.", {
                description: "The old alumni data has been removed.",
                richColors: true,
                position: "top-center",
                duration: 5000,
              });
              setData((pData) => pData.filter((d) => d.id !== toDelete));
              setToDelete(null);
            } catch (error) {
              toast.error(
                "Failed to delete alumni account. Please try again.",
                {
                  description: (error as Error).message,
                  richColors: true,
                  position: "top-center",
                  duration: 5000,
                },
              );
            } finally {
              setDeleting(false);
            }
          }}
          title="Delete Old data"
          deleteBTNTitle="Confirm Delete"
          loading={deleting}
        />
      )}
    </>
  );
}
