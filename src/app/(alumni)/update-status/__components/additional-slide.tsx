"use client";

import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { FormData } from "../types/form-data";

interface AdditionalSlideProps {
  formData: FormData;
  updateFormData: (updates: Partial<FormData>) => void;
}

export default function AdditionalSlide({
  formData,
  updateFormData,
}: AdditionalSlideProps) {
  const handleCommentsChange = (value: string) => {
    updateFormData({
      additionalInfo: {
        comments: value,
      },
    });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="comments">Additional Updates or Comments</Label>
        <Textarea
          id="comments"
          value={formData.additionalInfo.comments}
          onChange={(e) => handleCommentsChange(e.target.value)}
          placeholder="Any career updates, achievements, or other information you'd like to share with the alumni network?"
          rows={4}
        />
      </div>
    </div>
  );
}
