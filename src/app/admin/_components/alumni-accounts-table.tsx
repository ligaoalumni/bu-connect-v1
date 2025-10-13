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
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
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
import { AlumniDataTableColumns, UpdatedAlumniData } from "@/types";
import { User } from "@prisma/client";
import { DeleteModal } from "./delete-modal";
import { deleteAlumniAction } from "@/actions";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { generatedUpdateAlumniReport } from "@/actions/report";

const currentYear = new Date().getFullYear() - 1; // Get the current year
const years = Array.from({ length: 75 }, (_, i) => currentYear - i); // Create a range of years for the last 50 years

export default function AlumniAccountsDataTable() {
  const [data, setData] = useState<User[]>([]);
  const [total, setTotal] = useState(0);
  const [pagination, setPagination] = React.useState({
    pageIndex: 0, //initial page index
    pageSize: 10, //default page size
  });
  const [generatingPdf, setGeneratingPdf] = useState(false);
  const [toPrintData, setToPrintData] = useState<UpdatedAlumniData[]>([]);
  const [alumniAccount, setAlumniAccount] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [toDelete, setToDelete] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [selectedBatch, setSelectedBatch] = useState<string>("all");

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
          batch: selectedBatch !== "all" ? Number(selectedBatch) : undefined,
        });
        const udpatedData = await generatedUpdateAlumniReport(
          selectedBatch !== "all" ? Number(selectedBatch) : undefined,
        );

        setToPrintData(udpatedData);
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
    [pagination, selectedBatch],
  );

  useEffect(() => {
    handleFetchData();
  }, [handleFetchData]);

  function generateAlumniPDF(alumniData: UpdatedAlumniData[]) {
    setGeneratingPdf(true);
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    let yPosition = 20;

    // Header
    doc.setFontSize(20);
    doc.setFont("helvetica", "bold");
    doc.text("Alumni Information Report", pageWidth / 2, yPosition, {
      align: "center",
    });

    yPosition += 10;
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100);
    doc.text(
      `Generated on: ${new Date().toLocaleDateString()}`,
      pageWidth / 2,
      yPosition,
      { align: "center" },
    );

    yPosition += 15;

    // Summary Section
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0);
    doc.text("Summary", 14, yPosition);

    yPosition += 7;
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`Total Alumni: ${alumniData.length}`, 14, yPosition);

    yPosition += 6;
    const uniqueBatches = new Set(alumniData.map((a) => a.batch)).size;
    doc.text(`Total Batches: ${uniqueBatches}`, 14, yPosition);

    yPosition += 6;
    const uniqueIndustries = new Set(alumniData.map((a) => a.industry)).size;
    doc.text(`Total Industries: ${uniqueIndustries}`, 14, yPosition);

    yPosition += 12;

    // Table Section
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("Alumni Details", 14, yPosition);

    yPosition += 5;

    // Create table data
    const tableData = alumniData.map((alumni) => [
      alumni.name,
      alumni.batch,
      alumni.course,
      alumni.company,
      alumni.jobTitle,
      alumni.industry,
      `${alumni.years} yrs`,
    ]);

    autoTable(doc, {
      startY: yPosition,
      head: [
        [
          "Name",
          "Batch",
          "Course",
          "Company",
          "Job Title",
          "Industry",
          "Yrs(To get the job)",
        ],
      ],
      body: tableData,
      theme: "striped",
      headStyles: {
        fillColor: [41, 128, 185],
        textColor: 255,
        fontStyle: "bold",
        fontSize: 9,
      },
      bodyStyles: {
        fontSize: 8,
        textColor: 50,
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245],
      },
      margin: { top: 10, left: 14, right: 14 },
      columnStyles: {
        0: { cellWidth: 30 },
        1: { cellWidth: 18 },
        2: { cellWidth: 35 },
        3: { cellWidth: 30 },
        4: { cellWidth: 30 },
        5: { cellWidth: 25 },
        6: { cellWidth: 15 },
      },
    });

    // Add new page for detailed information
    doc.addPage();
    yPosition = 20;

    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Detailed Alumni Information", 14, yPosition);

    yPosition += 10;

    // Detailed information for each alumni
    alumniData.forEach((alumni, index) => {
      // Check if we need a new page
      if (yPosition > pageHeight - 60) {
        doc.addPage();
        yPosition = 20;
      }

      doc.setFontSize(11);
      doc.setFont("helvetica", "bold");
      doc.text(`${index + 1}. ${alumni.name}`, 14, yPosition);

      yPosition += 6;
      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");

      const details = [
        `Batch: ${alumni.batch}`,
        `Course: ${alumni.course}`,
        `Current Occupation: ${alumni.currentOccupation}`,
        `Job Title: ${alumni.jobTitle}`,
        `Company: ${alumni.company}`,
        `Industry: ${alumni.industry}`,
        `Post-Study University: ${alumni.postStudyUniversity}`,
        `Years of Experience: ${alumni.years}`,
      ];

      details.forEach((detail) => {
        doc.text(detail, 20, yPosition);
        yPosition += 5;
      });

      yPosition += 5;
    });

    // Add page numbers
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(150);
      doc.text(`Page ${i} of ${pageCount}`, pageWidth / 2, pageHeight - 10, {
        align: "center",
      });
    }

    // Save the PDF
    doc.save(`Alumni_Report_${new Date().toISOString().split("T")[0]}.pdf`);
    setGeneratingPdf(false);
  }

  return (
    <>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-medium">Alumni Data</h1>
          <p className="text-gray-400">Manage Alumni data.</p>
        </div>

        <div className="flex gap-2">
          <Select
            disabled={generatingPdf || loading}
            value={selectedBatch}
            onValueChange={setSelectedBatch}
          >
            <SelectTrigger className="lg:w-[180px]">
              <SelectValue placeholder="Filter by batch" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Batch</SelectLabel>
                <SelectItem key={"all"} value={"all"}>
                  All Batches
                </SelectItem>
                {years.map((year) => (
                  <SelectItem key={year} value={year.toString()}>
                    {year}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          <Button
            disabled={loading || generatingPdf}
            onClick={() => generateAlumniPDF(toPrintData)}
          >
            {generatingPdf ? "Generating..." : "Generate Report"}
          </Button>
        </div>
      </div>
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
