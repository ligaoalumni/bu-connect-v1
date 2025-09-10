"use client";

import { Button, Iconify } from "@/components";
import { welcomeImageBlurData } from "@/constant";
import { Batch } from "@/types";
import Image from "next/image";
import Link from "next/link";
import { useState, useRef, MouseEvent } from "react";

export const BatchCard = (batch: Batch) => {
  return (
    <div className="flex flex-col  ">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-medium">Batch {batch.batch}</h3>
          <p className="text-sm text-stone-400">{batch.students} student(s)</p>
        </div>

        <div className="flex items-center gap-3">
          <Button asChild>
            <Link href={`/batch/${batch.batch}/gallery`}>Gallery</Link>
          </Button>
          <Button asChild>
            <Link href={`/batch/${batch.batch}/alumni`}>View Alumni</Link>
          </Button>
        </div>
      </div>

      {batch.images.length > 0 ? (
        <div className="mt-4">
          <ImageGallery batch={batch.batch} images={batch.images} />
        </div>
      ) : (
        <div className="py-5">
          <div className="mt-4 flex items-center justify-center">
            <Iconify icon="carbon:no-image" width="52" height="52" />
          </div>
          <p className="text-center text-sm text-stone-400">
            No images available for this batch.
          </p>
        </div>
      )}
    </div>
  );
};

export default function ImageGallery({
  batch,
  images,
}: {
  images: string[];
  batch: number;
}) {
  // Refs and state for drag functionality
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [startX, setStartX] = useState<number>(0);
  const [scrollLeft, setScrollLeft] = useState<number>(0);

  // Handle mouse down event to start dragging
  const handleMouseDown = (e: MouseEvent<HTMLDivElement>) => {
    if (!scrollContainerRef.current) return;

    setIsDragging(true);
    setStartX(e.pageX - scrollContainerRef.current.offsetLeft);
    setScrollLeft(scrollContainerRef.current.scrollLeft);
  };

  // Handle mouse move event while dragging
  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!isDragging || !scrollContainerRef.current) return;

    e.preventDefault();
    const x = e.pageX - scrollContainerRef.current.offsetLeft;
    const walk = (x - startX) * 1.5; // Scroll speed multiplier
    scrollContainerRef.current.scrollLeft = scrollLeft - walk;
  };

  // Handle ending the drag operation
  const handleDragEnd = () => {
    setIsDragging(false);
  };

  return (
    <div
      ref={scrollContainerRef}
      className={`flex items-center overflow-x-auto scrollbar-hide`}
      onMouseDown={handleMouseDown}
      onMouseMove={isDragging ? handleMouseMove : undefined}
      onMouseUp={handleDragEnd}
      onMouseLeave={handleDragEnd}
      style={{
        cursor: isDragging ? "grabbing" : "grab",
        userSelect: "none",
      }}
    >
      {images.map((image, index) => (
        <div
          key={index}
          className="relative mx-5 min-w-[240px] max-w-[240px] md:max-w-[300px] md:min-w-[300px] h-[280px] md:h-[320px]"
        >
          <Image
            height={300}
            width={300}
            blurDataURL={welcomeImageBlurData}
            src={image}
            alt={`Batch ${batch} Image #${index + 1}`}
            className="object-cover w-full h-full"
            draggable={false}
            unoptimized={image.startsWith("/api/placeholder")}
          />
        </div>
      ))}
    </div>
  );
}
