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
import {
  ArrowUpDown,
  MoreHorizontal,
  ShieldEllipsis,
  Trash,
} from "lucide-react";
import { toast } from "sonner";
import AlumniDetailsSheet from "./alumni-details-sheet";
import { readAlumniAccounts } from "@/actions/alumni-account";
import { AlumniDataTableColumns } from "@/types";
import { User } from "@prisma/client";
import { DeleteModal } from "./delete-modal";
import { deleteAlumniAction } from "@/actions";

export default function AlumniAccountsDataTable() {
  const [data, setData] = useState<User[]>([]);
  const [total, setTotal] = useState(0);
  const [pagination, setPagination] = React.useState({
    pageIndex: 0, //initial page index
    pageSize: 10, //default page size
  });
  const [alumniAccount, setAlumniAccount] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [toDelete, setToDelete] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);

  const columns: ColumnDef<AlumniDataTableColumns>[] = [
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
      enableSorting: true,
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Student ID
            <ArrowUpDown />
          </Button>
        );
      },
      cell: ({ row }) => {
        return (
          <p className="min-w-[100px]">{row.original.studentId || "N/A"}</p>
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
      accessorKey: "email",
      enableHiding: false,
      enableSorting: true,
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
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
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Batch
            <ArrowUpDown />
          </Button>
        );
      },
      cell: ({ row }) => {
        return <p className="min-w-[100px]">{row.original.batch}</p>;
      },
    },
    // {
    // 	accessorKey: "alumniId",

    // 	enableSorting: false,
    // 	header: ({ column }) => {
    // 		return (
    // 			<Button
    // 				variant="ghost"
    // 				onClick={() =>
    // 					column.toggleSorting(column.getIsSorted() === "asc")
    // 				}>
    // 				Batch
    // 				<ArrowUpDown />
    // 			</Button>
    // 		);
    // 	},
    // 	cell: ({ row }) => {
    // 		return <p className="min-w-[100px]">{row.original.graduationYear}</p>;
    // 	},
    // },

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
              {/* <DropdownMenuItem
								onClick={() => setAlumniAccount(row.original)}
								className="cursor-pointer">
								<Info />
								View Details
							</DropdownMenuItem> */}
              <DropdownMenuItem
                onClick={() => setAlumniAccount(row.original.id)}
                className="  cursor-pointer flex items-center "
              >
                <ShieldEllipsis />
                View Full Details
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
    async (filter?: string) => {
      try {
        setLoading(true);
        const data = await readAlumniAccounts({
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
        filterName="name"
        rowCount={total}
        loading={loading}
        handleSearch={handleFetchData}
      />
      {alumniAccount && (
        <AlumniDetailsSheet
          id={alumniAccount}
          closeSheet={() => setAlumniAccount(null)}
        />
      )}
      {toDelete && (
        <DeleteModal
          description={`Are you sure you want to delete this alumni account? This action cannot be undone.`}
          id={toDelete}
          onClose={() => setToDelete(null)}
          onDelete={async () => {
            try {
              setDeleting(true);

              await deleteAlumniAction(toDelete);

              toast.success("Alumni account deleted successfully.", {
                description: "The alumni account has been removed.",
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
          title="Delete Alumni"
          deleteBTNTitle="Confirm Delete"
          loading={deleting}
        />
      )}
    </>
  );
}
