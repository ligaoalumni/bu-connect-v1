"use client";
import React, { Dispatch, SetStateAction } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { User as PUser } from "@prisma/client";
import { formatAddress } from "@/lib";

interface ApplicantDetailsModalProps {
  applicant: Omit<PUser, "rate"> & {
    rate?: number;
  };
  setApplicant: Dispatch<SetStateAction<
    Omit<PUser, "rate"> & { rate?: number }
  > | null>;
  loading: boolean;
}

const ApplicantDetailsModal: React.FC<ApplicantDetailsModalProps> = ({
  applicant,
  setApplicant,
  loading,
}) => {
  return (
    <Dialog open={!!applicant}>
      <DialogContent showCloseButton>
        <DialogHeader>
          <DialogTitle>Applicant Details</DialogTitle>
          <DialogDescription>
            Detailed information about the applicant.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <strong>Name:</strong> {applicant?.firstName} {applicant?.lastName}
          </div>
          <div>
            <strong>Email:</strong> {applicant?.email}
          </div>
          <div>
            <strong>Phone:</strong>{" "}
            {applicant?.contactNumber || (
              <span className="italic text-stone-500">No data</span>
            )}
          </div>
          <div>
            <strong>Address:</strong>{" "}
            {applicant?.address ? (
              formatAddress(applicant.address).address || (
                <span className="italic text-stone-500">No data</span>
              )
            ) : (
              <span className="italic text-stone-500">No data</span>
            )}
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button onClick={() => setApplicant(null)} variant="secondary">
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ApplicantDetailsModal;
