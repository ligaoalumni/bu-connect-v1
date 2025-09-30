"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { industries } from "../types/form-data";
import { RadioGroup, RadioGroupItem } from "@/components";
import { useState } from "react";

interface IndustrySlideProps {
  values: {
    industry?: string;
    company?: string;
    jobTitle?: string;
    years?: string;
  };
  handleChange: (values: IndustrySlideProps["values"]) => void;
}

export default function IndustrySlide({
  values,
  handleChange,
}: IndustrySlideProps) {
  const industry = values.industry && industries.includes(values.industry);
  const [isOther, setIsOther] = useState(!!industry);

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <Label>Which industries are you currently working in? *</Label>
        <RadioGroup
          defaultValue={values.industry}
          onValueChange={(v) => {
            handleChange({ ...values, industry: v });
            if (v === "") {
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
              <RadioGroupItem id="other-industry" value="" />
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
              value={values.industry}
              onChange={(v) =>
                handleChange({ ...values, industry: v.target.value })
              }
              placeholder="Enter your industry"
            />
          </div>
        )}

        <div className="mt-3">
          <Label htmlFor="company">Company</Label>
          <Input
            id="company"
            value={values.company}
            onChange={(v) =>
              handleChange({ ...values, company: v.target.value })
            }
            placeholder="Enter your industry"
          />
        </div>
        <div className="mt-3">
          <Label htmlFor="jobTitle">Job Title</Label>
          <Input
            id="jobTitle"
            value={values.jobTitle}
            onChange={(v) =>
              handleChange({ ...values, jobTitle: v.target.value })
            }
            placeholder="Enter your job"
          />
        </div>
        <div className="mt-3">
          <Label htmlFor="years">
            Years to get this job (if this job is related to your program)
          </Label>
          <Input
            id="years"
            value={values.years}
            onChange={(v) => {
              handleChange({ ...values, years: Number(v.target.value) });
            }}
            // pattern="\d*"
            inputMode="numeric"
            placeholder=""
          />
        </div>
      </div>
    </div>
  );
}
