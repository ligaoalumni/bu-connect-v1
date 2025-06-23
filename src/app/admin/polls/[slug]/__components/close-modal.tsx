"use client";

import { updatePollStatusAction } from "@/actions";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";

interface ClosePollModal {
  pollId: number;
}

export function ClosePollModal({ pollId }: ClosePollModal) {
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  async function handelClosePoll() {
    try {
      setLoading(true);

      await updatePollStatusAction(pollId, "COMPLETED");

      toast.success("Poll closed successfully", {
        description: "Your poll has been successfully closed.",
        richColors: true,
        position: "top-center",
      });
      setIsOpen(false);
    } catch {
      toast.error("Failed to close poll", {
        description: "Please try again later.",
        richColors: true,
        position: "top-center",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <AlertDialog onOpenChange={setIsOpen} open={isOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="destructive">Close Poll</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirm Poll Closure</AlertDialogTitle>
          <AlertDialogDescription>
            Closing this poll will finalize its results and prevent further
            submissions. This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading} popoverTargetAction="hide">
            Cancel
          </AlertDialogCancel>
          <Button
            variant="destructive"
            disabled={loading}
            onClick={handelClosePoll}
          >
            {loading ? "Loading..." : "Continue"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
