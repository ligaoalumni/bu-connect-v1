"use client";
import { applyToRecruitmentAction } from "@/actions";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  Button,
} from "@/components";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function ApplyDialog({
  recruitmentId,
  recruitment,
  eventTitle,
  alreadyApplied = false,
  isAllowedToApply = false,
}: {
  recruitmentId: number;
  eventTitle: string;
  recruitment: string;
  alreadyApplied?: boolean;
  isAllowedToApply?: boolean;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [applied, setApplied] = useState(alreadyApplied);
  async function handleApply() {
    try {
      setIsLoading(true);
      // LOGIC: Apply to the recruitment
      await applyToRecruitmentAction(recruitmentId);
      setApplied(true);
      setIsOpen(false);
      toast.success("Successfully applied to the recruitment", {
        description: `You have successfully applied to the ${recruitment} recruitment`,
        richColors: true,
        position: "top-center",
      });
    } catch (error) {
      toast.error("Something went wrong!", {
        description: `Failed to apply as a ${recruitment} recruitment. Please try again later.`,
        richColors: true,
        position: "top-center",
      });
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    setApplied(alreadyApplied);
  }, [alreadyApplied]);

  return (
    <AlertDialog open={isOpen}>
      <AlertDialogTrigger
        asChild
        disabled={applied}
        className="disabled:opacity-100 "
      >
        <Button
          onClick={() => setIsOpen(true)}
          size="lg"
          className="w-full md:max-w-[200px] disabled:cursor-not-allowed disabled:opacity-60"
          disabled={!isAllowedToApply}
        >
          {applied
            ? "Already applied"
            : isAllowedToApply
              ? "Apply now"
              : "Not allowed to applly"}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Are you sure applying as {recruitment}?
          </AlertDialogTitle>
          <AlertDialogDescription>
            You are applying to {eventTitle} as {recruitment}. This action
            cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            onClick={() => setIsOpen(false)}
            disabled={isLoading}
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleApply}
            disabled={isLoading}
            className="min-w-[120px]"
          >
            {isLoading ? "Applying..." : "Apply"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
