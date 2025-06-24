"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import type { FormData } from "../types/form-data";

interface AlumniSlideProps {
  formData: FormData;
  updateFormData: (updates: Partial<FormData>) => void;
}

export default function AlumniSlide({
  formData,
  updateFormData,
}: AlumniSlideProps) {
  const handleAlumniStatusChange = (value: string) => {
    updateFormData({
      alumniInfo: {
        ...formData.alumniInfo,
        isAlumni: value,
      },
    });
  };

  const handleAlumniFieldChange = (field: string, value: string) => {
    updateFormData({
      alumniInfo: {
        ...formData.alumniInfo,
        [field]: value,
      },
    });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <Label>Are you an alumni of any educational institution? *</Label>
        <RadioGroup
          value={formData.alumniInfo.isAlumni}
          onValueChange={handleAlumniStatusChange}
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="yes" id="alumni-yes" />
            <Label htmlFor="alumni-yes">Yes, I am an alumni</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="no" id="alumni-no" />
            <Label htmlFor="alumni-no">No, I am not an alumni</Label>
          </div>
        </RadioGroup>
      </div>

      {formData.alumniInfo.isAlumni === "yes" && (
        <div className="space-y-4 border-t pt-4">
          <div className="space-y-2">
            <Label htmlFor="institution">Institution Name *</Label>
            <Input
              id="institution"
              value={formData.alumniInfo.institution}
              onChange={(e) =>
                handleAlumniFieldChange("institution", e.target.value)
              }
              placeholder="Enter your institution name"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="degree">Degree/Program</Label>
              <Input
                id="degree"
                value={formData.alumniInfo.degree}
                onChange={(e) =>
                  handleAlumniFieldChange("degree", e.target.value)
                }
                placeholder="e.g., Bachelor of Science"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="graduationYear">Graduation Year *</Label>
              <Input
                id="graduationYear"
                type="number"
                min="1950"
                max={new Date().getFullYear() + 10}
                value={formData.alumniInfo.graduationYear}
                onChange={(e) =>
                  handleAlumniFieldChange("graduationYear", e.target.value)
                }
                placeholder="e.g., 2020"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="currentRole">Current Role/Position</Label>
            <Input
              id="currentRole"
              value={formData.alumniInfo.currentRole}
              onChange={(e) =>
                handleAlumniFieldChange("currentRole", e.target.value)
              }
              placeholder="e.g., Software Engineer, Student, etc."
            />
          </div>
        </div>
      )}
    </div>
  );
}
