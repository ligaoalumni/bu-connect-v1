"use client";

import { useState, useEffect } from "react";
import { Loader2, Users } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Applicant, Pagination } from "@/types";
import { readAlumniAction, readApplicantsAction } from "@/actions";
import ApplicantDetailsModal from "./applicant-details";
import { toast } from "sonner";
import { User as PUser } from "@prisma/client";

interface ApplicantsListProps {
  recruitmentId: number;
}

type User = Omit<PUser, "rate"> & { rate?: number };

export function ApplicantsList({ recruitmentId }: ApplicantsListProps) {
  // State for applicants data and pagination
  const [data, setData] = useState<Applicant[]>([]);
  const [total, setTotal] = useState(0);
  const [applicant, setApplicant] = useState<User | null>(null);
  const [pagination, setPagination] = useState<Pagination>({
    page: 0,
    limit: 10,
  });
  const [isFetchingApplicant, setIsFetchingApplicant] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Calculate total pages (note: page is 0-indexed in state)
  const totalPages = Math.ceil(total / pagination.limit);

  // Fetch applicants data when pagination changes
  const fetchApplicants = async () => {
    // Skip fetch if we're on the initial page and already have data

    setIsLoading(true);
    try {
      // API expects 1-indexed page, but our state is 0-indexed

      const response = await readApplicantsAction({
        pagination: {
          ...pagination,
          page: pagination.page,
        },
        id: recruitmentId,
      });
      setData(response.data);
      setTotal(response.count);
    } catch (error) {
      console.error("Error fetching applicants:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchApplicants();
  }, [recruitmentId, pagination]);

  // Handle page change
  const handlePageChange = (newPage: number) => {
    setPagination((prev) => ({
      ...prev,
      page: newPage,
    }));
  };

  // Generate page numbers array
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxPageButtons = 5;

    // Convert to 1-indexed for display
    const currentPage = pagination.page + 1;

    if (totalPages <= maxPageButtons) {
      // Show all pages if total pages are less than max buttons
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Show a subset of pages with current page in the middle when possible
      let startPage = Math.max(1, currentPage - Math.floor(maxPageButtons / 2));
      let endPage = startPage + maxPageButtons - 1;

      if (endPage > totalPages) {
        endPage = totalPages;
        startPage = Math.max(1, endPage - maxPageButtons + 1);
      }

      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
      }

      // Add ellipsis indicators
      if (startPage > 1) {
        pageNumbers.unshift(-1); // -1 represents ellipsis
        pageNumbers.unshift(1); // Always show first page
      }

      if (endPage < totalPages) {
        pageNumbers.push(-2); // -2 represents ellipsis
        pageNumbers.push(totalPages); // Always show last page
      }
    }

    return pageNumbers;
  };

  const pageNumbers = getPageNumbers();
  // Convert 0-indexed page to 1-indexed for display
  const displayPage = pagination.page + 1;
  // Check if there are more pages
  const hasMore = displayPage < totalPages;

  async function handleFetchApplicant(id: number) {
    try {
      setIsFetchingApplicant(true);
      const user = await readAlumniAction(id);
      setApplicant(user);
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch applicant details", {
        description: "Please try again later.",
        richColors: true,
        position: "top-center",
      });
    } finally {
      setIsFetchingApplicant(false);
    }
  }

  return (
    <>
      <Card className="w-full mt-6">
        <CardHeader>
          <CardTitle className="text-xl flex items-center">
            <Users className="mr-2 h-5 w-5" /> Applicants
            <Badge variant="secondary" className="ml-2">
              {total}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center min-h-[200px]">
              <Loader2 className="animate-spin" />
            </div>
          ) : total > 0 ? (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>First Name</TableHead>
                    <TableHead>Last Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Batch</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading
                    ? // Loading skeleton rows
                      Array.from({ length: pagination.limit }).map(
                        (_, index) => (
                          <TableRow key={`skeleton-${index}`}>
                            <TableCell>
                              <Skeleton className="h-5 w-20" />
                            </TableCell>
                            <TableCell>
                              <Skeleton className="h-5 w-20" />
                            </TableCell>
                            <TableCell>
                              <Skeleton className="h-5 w-32" />
                            </TableCell>
                            <TableCell>
                              <Skeleton className="h-5 w-16" />
                            </TableCell>
                            <TableCell className="text-right">
                              <Skeleton className="h-8 w-16 ml-auto" />
                            </TableCell>
                          </TableRow>
                        ),
                      )
                    : // Actual data rows
                      data.map((applicant) => (
                        <TableRow key={applicant.id}>
                          <TableCell className="font-medium">
                            {applicant.firstName}
                          </TableCell>
                          <TableCell>{applicant.lastName}</TableCell>
                          <TableCell>{applicant.email}</TableCell>
                          <TableCell>Batch {applicant.batch}</TableCell>
                          <TableCell className="text-right">
                            <Button
                              disabled={isFetchingApplicant}
                              onClick={async () => {
                                toast.info(
                                  "Applicant details will be displayed shortly.",
                                  {
                                    description:
                                      "Please wait while we fetch the details.",
                                    richColors: true,
                                    position: "top-center",
                                  },
                                );
                                handleFetchApplicant(applicant.id);
                              }}
                              variant="ghost"
                              size="sm"
                            >
                              {isFetchingApplicant ? "Loading..." : "View"}
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                </TableBody>
              </Table>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center space-x-2 mt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(pagination.page - 1)}
                    disabled={pagination.page === 0 || isLoading}
                  >
                    Previous
                  </Button>

                  {pageNumbers.map((pageNumber, index) => {
                    if (pageNumber === -1 || pageNumber === -2) {
                      return (
                        <span key={`ellipsis-${index}`} className="px-2">
                          ...
                        </span>
                      );
                    }
                    return (
                      <Button
                        key={pageNumber}
                        variant={
                          displayPage === pageNumber ? "default" : "outline"
                        }
                        size="sm"
                        onClick={() => handlePageChange(pageNumber - 1)} // Convert 1-indexed display to 0-indexed state
                        disabled={isLoading}
                        className="w-9"
                      >
                        {pageNumber}
                      </Button>
                    );
                  })}

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(pagination.page + 1)}
                    disabled={!hasMore || isLoading}
                  >
                    Next
                  </Button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-6 text-muted-foreground">
              No applicants yet
            </div>
          )}
        </CardContent>
      </Card>
      {applicant && (
        <ApplicantDetailsModal
          loading={isFetchingApplicant}
          setLoading={setIsFetchingApplicant}
          applicant={applicant}
        />
      )}
    </>
  );
}

export function ApplicantsLoading() {
  return (
    <Card className="w-full mt-6">
      <CardHeader>
        <div className="flex items-center">
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-6 w-8 ml-2" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
        <div className="flex justify-center mt-4 space-x-2">
          <Skeleton className="h-9 w-20" />
          <Skeleton className="h-9 w-9" />
          <Skeleton className="h-9 w-9" />
          <Skeleton className="h-9 w-9" />
          <Skeleton className="h-9 w-20" />
        </div>
      </CardContent>
    </Card>
  );
}
