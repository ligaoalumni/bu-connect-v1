"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { type FormData, industries } from "../types/form-data";

interface IndustrySlideProps {
  formData: FormData;
  updateFormData: (updates: Partial<FormData>) => void;
}

export default function IndustrySlide({
  formData,
  updateFormData,
}: IndustrySlideProps) {
  const handleIndustryChange = (industry: string, checked: boolean) => {
    const currentIndustries = formData.industryInfo.selectedIndustries;
    const newIndustries = checked
      ? [...currentIndustries, industry]
      : currentIndustries.filter((i) => i !== industry);

    updateFormData({
      industryInfo: {
        ...formData.industryInfo,
        selectedIndustries: newIndustries,
      },
    });
  };

  const handleOtherIndustryChange = (value: string) => {
    updateFormData({
      industryInfo: {
        ...formData.industryInfo,
        otherIndustry: value,
      },
    });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <Label>
          Which industries are you currently working in? (Select all that apply)
          *
        </Label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-64 overflow-y-auto">
          {industries.map((industry) => (
            <div key={industry} className="flex items-center space-x-2">
              <Checkbox
                id={industry}
                checked={formData.industryInfo.selectedIndustries.includes(
                  industry,
                )}
                onCheckedChange={(checked) =>
                  handleIndustryChange(industry, checked as boolean)
                }
              />
              <Label htmlFor={industry} className="text-sm">
                {industry}
              </Label>
            </div>
          ))}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="other-industry"
              checked={formData.industryInfo.selectedIndustries.includes(
                "Other",
              )}
              onCheckedChange={(checked) =>
                handleIndustryChange("Other", checked as boolean)
              }
            />
            <Label htmlFor="other-industry" className="text-sm">
              Other
            </Label>
          </div>
        </div>

        {formData.industryInfo.selectedIndustries.includes("Other") && (
          <div className="space-y-2">
            <Label htmlFor="otherIndustry">
              Please specify other industry: *
            </Label>
            <Input
              id="otherIndustry"
              value={formData.industryInfo.otherIndustry}
              onChange={(e) => handleOtherIndustryChange(e.target.value)}
              placeholder="Enter your industry"
            />
          </div>
        )}
      </div>
    </div>
  );
}
