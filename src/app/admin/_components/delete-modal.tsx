"use client1";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface DeleteModalProps {
  id: number;
  onDelete: VoidFunction;
  onClose: VoidFunction;
  title: string;
  description: string;
  deleteBTNTitle?: string;
  loading?: boolean;
}

export function DeleteModal({
  onClose,
  onDelete,
  id,
  title,
  deleteBTNTitle,
  loading = false,
  description,
}: DeleteModalProps) {
  return (
    <Dialog open={!!id} modal>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button
              variant="ghost"
              onClick={onClose}
              disabled={loading}
              className="!border-destructive bg-destructive hover:text-white !border !hover:border-destructive  hover:bg-destructive  text-white !outline-none !ring-0"
            >
              Cancel
            </Button>
          </DialogClose>
          <Button
            type="button"
            variant="ghost"
            className="border-primary border hover:bg-primary  hover:text-white"
            disabled={loading}
            onClick={onDelete}
          >
            {loading ? "Deleting..." : deleteBTNTitle || "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
