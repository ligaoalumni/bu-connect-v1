"use client";

import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import type { FormData } from "../types/form-data";
import { OccupationStatus } from "@prisma/client";

interface EmploymentSlideProps {
  formData: FormData;
  updateFormData: (updates: Partial<FormData>) => void;
}

export default function EmploymentSlide({
  formData,
  updateFormData,
}: EmploymentSlideProps) {
  const updateEmploymentStatus = (value: string) => {
    updateFormData({
      employmentStatus: value,
      // Reset conditional data when employment status changes
      industryInfo:
        value === "employed" || value === "freelancer"
          ? formData.industryInfo
          : "",
      locationInfo:
        value === "unemployed" || value === "student"
          ? formData.locationInfo
          : {
              selectedLocation: {
                address: "",
                lat: 14.5995,
                lng: 120.9842,
              },
            },
    });
  };

  // Transform OccupationStatus into an array
  const occupationStatusArray = Object.values(
    OccupationStatus,
  ) as OccupationStatus[];

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <Label>What is your current employment status? *</Label>
        <RadioGroup
          value={formData.employmentStatus}
          onValueChange={updateEmploymentStatus}
        >
          {occupationStatusArray.map((status, index) => (
            <div
              key={`${index}-${status}`}
              className="flex items-center space-x-2"
            >
              <RadioGroupItem value={status} id={status} />
              <Label
                htmlFor={status}
                className="flex items-center gap-2 capitalize"
              >
                {status.replaceAll("_", " ").toLowerCase()}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>
    </div>
  );
}
