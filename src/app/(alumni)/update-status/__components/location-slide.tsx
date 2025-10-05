"use client";

import { Label } from "@/components/ui/label";

import { LoaderComponent } from "@/components";
import { AddressData } from "@/types";
import dynamic from "next/dynamic";

interface LocationSlideProps {
  location: AddressData | undefined;
  handleUpdateLocaton: (data: AddressData) => void;
}

const LocationPicker = dynamic(
  () => import("@/components").then((mod) => mod.LocationPicker),
  {
    loading: LoaderComponent,
  },
);

export default function LocationSlide({
  location,
  handleUpdateLocaton,
}: LocationSlideProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <Label>Where are you currently located? *</Label>
        <LocationPicker onChange={handleUpdateLocaton} value={location} />
      </div>
    </div>
  );
}
