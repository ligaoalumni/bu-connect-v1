"use client";

import type React from "react";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Image from "next/image";

interface ImageGalleryDialogProps {
  batchNumber: number;
  images: string[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ImageGalleryDialog({
  batchNumber,
  images,
  open,
  onOpenChange,
}: ImageGalleryDialogProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToPrevious = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1,
    );
  };

  const goToNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1,
    );
  };

  const handleThumbnailClick = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton
        className="sm:max-w-[800px] overflow-hidden"
      >
        <DialogHeader>
          <DialogTitle>Batch {batchNumber} Gallery</DialogTitle>
        </DialogHeader>

        <div className="mt-4 flex flex-col space-y-4">
          {/* Main image */}
          <div className="relative sm:max-w-[750px] aspect-video w-full overflow-hidden rounded-lg">
            <div className="relative h-full w-full">
              <Image
                fill
                src={images[currentIndex]}
                alt={`Batch ${batchNumber} image ${currentIndex + 1}`}
                className=" 	 "
              />
            </div>

            {images.length > 1 && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-black/50 text-white hover:bg-black/70"
                  onClick={goToPrevious}
                >
                  <ChevronLeft className="h-6 w-6" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-black/50 text-white hover:bg-black/70"
                  onClick={goToNext}
                >
                  <ChevronRight className="h-6 w-6" />
                </Button>
                <div className="absolute bottom-2 right-2 rounded-full bg-black/70 px-2 py-1 text-xs text-white">
                  {currentIndex + 1} / {images.length}
                </div>
              </>
            )}
          </div>

          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="flex max-w-[73dvw] sm:max-w-[750px] space-x-2 overflow-x-auto pb-2">
              {images.map((image, index) => (
                <div
                  key={index}
                  className={`relative h-16 w-24 shrink-0 cursor-pointer overflow-hidden rounded-md border-2 transition-all ${
                    index === currentIndex
                      ? "border-primary"
                      : "border-transparent"
                  }`}
                  onClick={() => handleThumbnailClick(index)}
                >
                  <Image
                    src={image}
                    fill
                    alt={`Thumbnail ${index + 1}`}
                    className="h-full w-full object-cover"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
