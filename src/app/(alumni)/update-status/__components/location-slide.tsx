"use client";

import { Label } from "@/components/ui/label";
import type { FormData } from "../types/form-data";
import { LocationPicker } from "@/components";

interface LocationSlideProps {
  formData: FormData;
  updateFormData: (updates: Partial<FormData>) => void;
}

export default function LocationSlide(
  {
    // formData,
    // updateFormData,
  }: LocationSlideProps,
) {
  // const handleLocationChange = (value: string) => {
  //   updateFormData({
  //     locationInfo: {
  //       selectedLocation: value,
  //     },
  //   });
  // };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <Label>Where are you currently located? *</Label>
        <LocationPicker onChange={() => {}} value={undefined} />
      </div>
    </div>
  );
}
