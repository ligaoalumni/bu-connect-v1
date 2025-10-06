"use client";
import {
  generateAttendantsReportActions,
  readAttendantsAction,
} from "@/actions";
import type { Attendant, PaginationResult } from "@/types";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { RefreshCw, UserX, Users } from "lucide-react";
import { Skeleton } from "../ui/skeleton";
import { jsPDF } from "jspdf";
import { autoTable } from "jspdf-autotable";
import { format, formatDate, isSameDay } from "date-fns";
import { useAuth } from "@/contexts";

interface AttendantsSectionProps {
  eventSlug: string;
}

export default function AttendantsSection({
  eventSlug,
}: AttendantsSectionProps) {
  const [data, setData] = useState<PaginationResult<Attendant>>({
    count: 0,
    data: [],
    hasMore: false,
  });
  const { user } = useAuth();
  const [loading, setLoading] = useState({
    initialFetch: true,
    fetchingMore: false,
  });
  const [pagination, setPagination] = useState({
    limit: 10,
    page: 0,
  });
  const [hasError, setHasError] = useState(false);

  const handleFetchMore = async ({
    fetchMore,
    refetch,
  }: { fetchMore?: boolean; refetch?: boolean } = {}) => {
    try {
      setLoading({
        initialFetch:
          (!fetchMore && data.data.length === 0) || refetch || false,
        fetchingMore: fetchMore || false,
      });
      setHasError(false);

      const response = await readAttendantsAction({
        slug: eventSlug,
        pagination: fetchMore
          ? { ...pagination, page: pagination.page + 1 }
          : pagination,
      });

      if (fetchMore) {
        setData((prev) => ({
          count: response.count,
          hasMore: response.hasMore,
          data: [...prev.data, ...response.data],
        }));
        setPagination((prev) => ({
          ...prev,
          page: prev.page + 1,
        }));
      } else {
        setData(response);
      }
    } catch {
      setHasError(true);
      toast.error("Error fetching attendants", {
        description: "Please try again later.",
        richColors: true,
        duration: 5000,
      });
    } finally {
      setLoading({
        initialFetch: false,
        fetchingMore: false,
      });
    }
  };

  const [isGenerating, setIsGenerating] = useState(false);

  const handleDownloadPDF = useCallback(async () => {
    setIsGenerating(true);
    try {
      const doc = new jsPDF();

      const event = await generateAttendantsReportActions(eventSlug);

      // Add title
      doc.setFontSize(20);
      doc.setTextColor(37, 99, 235); // Blue color
      doc.text(event.name, 14, 20);

      const isOneDay = isSameDay(
        event.startDate,
        event?.endDate || event.startDate,
      );
      const startDate = formatDate(
        event.startDate,
        isOneDay ? "MMMM d, yyyy" : "MMMM d,",
      );
      const endDate = formatDate(event!.endDate!, "- MMMM dd, yyyy");
      const date = `${startDate}${isOneDay ? "" : endDate}`;

      // Add event details
      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0);
      doc.text(`Date: ${date}`, 14, 30);

      doc.text(
        `Time: ${format(event.startTime, "HH:mm a")} - ${format(event.endTime, "hh:mm a")}`,
        14,
        36,
      );

      doc.text(`Location: ${event.location}`, 14, 42);
      doc.text(`Total Attendees: ${event.alumni.length || 0}`, 14, 48);

      // Add description
      // doc.setFontSize(9);
      // const splitContent = doc.splitTextToSize(event.content, 180);
      // doc.text(splitContent, 14, 56);

      // Add attendees table
      if (event.alumni.length === 0) {
        // Set box dimensions
        const boxX = 14;
        const boxY = 55;
        const boxWidth = 180; // use full page width minus margins
        const boxHeight = 30;

        // Background fill (light gray)
        doc.setFillColor(249, 250, 251); // Light gray background
        doc.rect(boxX, boxY, boxWidth, boxHeight, "F");

        // Border
        doc.setDrawColor(229, 231, 235); // Border color
        doc.rect(boxX, boxY, boxWidth, boxHeight, "S");

        // Centered text
        doc.setFontSize(12);
        doc.setTextColor(107, 114, 128); // Gray text

        const text = "No attendees registered for this event yet.";

        // Calculate center of the box
        const centerX = boxX + boxWidth / 2;
        const centerY = boxY + boxHeight / 2;

        // Add text centered
        doc.text(text, centerX, centerY, {
          align: "center",
          baseline: "middle",
        });
      } else {
        // Add attendees table
        const tableData = event.alumni.map((attendee) => [
          `${attendee.firstName} ${attendee.lastName}`,
          attendee.studentId || "-",
          attendee.course || "-",
          attendee.batch || "-",
          attendee.jobTitle || "-",
          attendee.company || "-",
        ]);

        autoTable(doc, {
          startY: 55,
          head: [
            ["Name", "Student ID", "Course", "Batch", "Job Title", "Company"],
          ],
          body: tableData,
          theme: "striped",
          headStyles: {
            fillColor: [37, 99, 235],
            textColor: [255, 255, 255],
            fontStyle: "bold",
          },
          styles: {
            fontSize: 8,
            cellPadding: 3,
          },
          columnStyles: {
            0: { cellWidth: 35 },
            1: { cellWidth: 30 },
            2: { cellWidth: 35 },
            3: { cellWidth: 15 },
            4: { cellWidth: 35 },
            5: { cellWidth: 35 },
          },
        });
      }
      // Save the PDF
      doc.save(`${event.slug}-attendees.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Failed to generate PDF. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  }, [eventSlug]);

  const handleRefresh = () => {
    setPagination({
      limit: 10,
      page: 0,
    });
    handleFetchMore({ refetch: true });
  };

  useEffect(() => {
    handleFetchMore();
  }, [eventSlug]);

  return (
    <div className="space-y-4 overflow-hidden break-words">
      <div className="flex items-center justify-between">
        <h1 className="font-medium text-lg flex items-center gap-2">
          <Users className="h-5 w-5" />
          Attendants
          {!loading.initialFetch && !hasError && (
            <span className="text-sm text-muted-foreground">
              ({data.count})
            </span>
          )}
        </h1>
        {!loading.initialFetch && (
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={
                loading.fetchingMore || loading.initialFetch || isGenerating
              }
            >
              <RefreshCw
                className={`h-4 w-4 mr-2 ${
                  loading.initialFetch || loading.fetchingMore
                    ? "animate-spin"
                    : ""
                }`}
              />
              Refresh
            </Button>
            {user?.role === "ALUMNI" ? null : (
              <Button
                disabled={
                  loading.fetchingMore || loading.initialFetch || isGenerating
                }
                onClick={handleDownloadPDF}
              >
                {isGenerating ? "Generating..." : "Generate Report"}{" "}
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Error State */}
      {hasError && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-6 flex flex-col items-center justify-center space-y-4 text-center">
          <UserX className="h-12 w-12 text-red-500" />
          <div>
            <h3 className="font-semibold text-red-700">
              Error fetching attendants
            </h3>
            <p className="text-red-600 mt-1">
              We couldn&apos;t load the attendant list. Please try again.
            </p>
          </div>
          <Button
            onClick={handleRefresh}
            variant="destructive"
            className="mt-2"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Try Again
          </Button>
        </div>
      )}

      {/* Initial Loading State */}
      {loading.initialFetch && !hasError && (
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, index) => (
            <AttendantSkeleton key={index} />
          ))}
        </div>
      )}

      {/* Content State */}
      {!loading.initialFetch && !hasError && (
        <>
          {data.data.length > 0 ? (
            <div className="space-y-3">
              <div className="space-y-3 divide-y divide-gray-100">
                {data.data.map((attendant) => (
                  <div className="pt-3 first:pt-0" key={attendant.email}>
                    <AttendantCard {...attendant} />
                  </div>
                ))}
              </div>

              {/* Load More Section */}
              {loading.fetchingMore && (
                <div className="pt-2 space-y-4">
                  {Array.from({ length: 3 }).map((_, index) => (
                    <AttendantSkeleton key={`more-${index}`} />
                  ))}
                </div>
              )}

              {data.hasMore && !loading.fetchingMore && (
                <div className="pt-4 flex justify-center">
                  <Button
                    variant="outline"
                    className={`w-full max-w-xs `}
                    disabled={loading.fetchingMore || isGenerating}
                    onClick={() => handleFetchMore({ fetchMore: true })}
                  >
                    {loading.fetchingMore ? (
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      "Load More Attendants"
                    )}
                  </Button>
                </div>
              )}

              {!data.hasMore && data.data.length > 5 && (
                <p className="text-center text-sm text-muted-foreground pt-2">
                  You&aspo;ve reached the end of the list
                </p>
              )}
            </div>
          ) : (
            <div className="rounded-lg border border-dashed p-8 flex flex-col items-center justify-center text-center">
              <Users className="h-10 w-10 text-muted-foreground mb-3" />
              <h3 className="font-medium">No attendants found</h3>
              <p className="text-sm text-muted-foreground mt-1">
                There are no attendants registered for this event yet.
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}

const AttendantCard = (attendant: Attendant) => {
  return (
    <div className="flex items-center gap-3 group hover:bg-gray-50 p-2 rounded-md transition-colors">
      <Avatar className="border">
        <AvatarImage
          src={attendant.avatar || ""}
          alt={`${attendant.firstName} ${attendant.lastName}`}
        />
        <AvatarFallback className="bg-primary/10 text-primary">
          {attendant.firstName[0]}
          {attendant.lastName[0]}
        </AvatarFallback>
      </Avatar>
      <div>
        <h3 className="font-medium group-hover:text-primary transition-colors">
          {attendant.firstName} {attendant.lastName}
        </h3>
        <p className="text-sm text-muted-foreground">
          {attendant.batch} {attendant.strand && `- ${attendant.strand}`}
        </p>
      </div>
    </div>
  );
};

const AttendantSkeleton = () => {
  return (
    <div className="flex items-center gap-3 p-2">
      <Skeleton className="h-10 w-10 rounded-full" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-3 w-24" />
      </div>
    </div>
  );
};
