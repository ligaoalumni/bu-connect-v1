"use client";

import { Label } from "@/components/ui/label";

import { LocationPicker } from "@/components";
import { AddressData } from "@/types";

interface LocationSlideProps {
  location: AddressData | undefined;
  handleUpdateLocaton: (data: AddressData) => void;
}

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
