"use client";

import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Briefcase, User, GraduationCap } from "lucide-react";
import type { FormData } from "../types/form-data";

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
          : { selectedIndustries: [], otherIndustry: "" },
      locationInfo:
        value === "unemployed" || value === "student"
          ? formData.locationInfo
          : { selectedLocation: "" },
    });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <Label>What is your current employment status? *</Label>
        <RadioGroup
          value={formData.employmentStatus}
          onValueChange={updateEmploymentStatus}
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="employed" id="employed" />
            <Label htmlFor="employed" className="flex items-center gap-2">
              <Briefcase className="w-4 h-4" />
              Currently Employed
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="unemployed" id="unemployed" />
            <Label htmlFor="unemployed" className="flex items-center gap-2">
              <User className="w-4 h-4" />
              Currently Unemployed
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="student" id="student" />
            <Label htmlFor="student" className="flex items-center gap-2">
              <GraduationCap className="w-4 h-4" />
              Student (Further Studies)
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="freelancer" id="freelancer" />
            <Label htmlFor="freelancer" className="flex items-center gap-2">
              <Briefcase className="w-4 h-4" />
              Freelancer/Self-Employed
            </Label>
          </div>
        </RadioGroup>
      </div>
    </div>
  );
}
