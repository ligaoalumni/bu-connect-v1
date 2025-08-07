"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { industries } from "../types/form-data";
import { RadioGroup, RadioGroupItem } from "@/components";
import { useState } from "react";

interface IndustrySlideProps {
  value: string | undefined;
  handleChange: (updates: string | undefined) => void;
}

export default function IndustrySlide({
  value,
  handleChange,
}: IndustrySlideProps) {
  const [isOther, setIsOther] = useState(false);

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <Label>Which industries are you currently working in? *</Label>
        <RadioGroup
          defaultValue={value}
          onValueChange={(v) => {
            handleChange(v);
            if (v === "other") {
              setIsOther(true);
            } else {
              setIsOther(false);
            }
          }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-64 overflow-y-auto">
            {industries.map((industry) => (
              <div key={industry} className="flex items-center space-x-2">
                <RadioGroupItem id={industry} value={industry} />
                <Label htmlFor={industry} className="text-sm">
                  {industry}
                </Label>
              </div>
            ))}
            <div className="flex items-center space-x-2">
              <RadioGroupItem id="other-industry" value="other" />
              <Label htmlFor="other-industry" className="text-sm">
                Other
              </Label>
            </div>
          </div>
        </RadioGroup>

        {isOther && (
          <div className="space-y-2">
            <Label htmlFor="otherIndustry">
              Please specify other industry: *
            </Label>
            <Input
              id="otherIndustry"
              value={value}
              onChange={(v) => handleChange(v.target.value)}
              placeholder="Enter your industry"
            />
          </div>
        )}
      </div>
    </div>
  );
}
