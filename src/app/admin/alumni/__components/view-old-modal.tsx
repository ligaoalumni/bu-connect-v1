"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Button,
  Badge,
} from "@/components";
import { OldAccount } from "@prisma/client";
import { formatDate } from "date-fns";
import Link from "next/link";

interface OldAlumniViewModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  student: OldAccount | null;
}

export function OldAlumniViewModal({
  open,
  onOpenChange,
  student,
}: OldAlumniViewModalProps) {
  if (!student) return null;

  const getFullName = () => {
    const parts = [
      student.firstName,
      student.middleName,
      student.lastName,
    ].filter(Boolean);
    return parts.join(" ");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Student Details</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Header with name and ID */}
          <div className="text-center border-b pb-4">
            <h3 className="text-xl font-semibold text-foreground">
              {getFullName()}
            </h3>
            <p className="text-sm text-muted-foreground">
              ID: {student.studentId}
            </p>
          </div>

          {/* Student Information Grid */}
          <div className="grid gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  First Name
                </label>
                <p className="text-foreground font-medium">
                  {student.firstName}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Last Name
                </label>
                <p className="text-foreground font-medium">
                  {student.lastName}
                </p>
              </div>
            </div>
            <div className="grid grid-col-2 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Middle Name
                </label>
                <p className="text-foreground font-medium">
                  {student.middleName || "-"}
                </p>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Birth Date
                </label>
                <p className="text-foreground font-medium">
                  {formatDate(student.birthDate, "MMM dd, yyyy")}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Program
                </label>
                <div className="mt-1">
                  <Badge variant="secondary" className="text-sm">
                    {student.program}
                  </Badge>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Batch
                </label>
                <p className="text-foreground font-medium">{student.batch}</p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Close
            </Button>
            <Button asChild>
              <Link href={`/admin/alumni/old/${student.studentId}`}>
                Edit Student
              </Link>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
