"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import type { FormData } from "../types/form-data";

interface PersonalSlideProps {
  formData: FormData;
  updateFormData: (updates: Partial<FormData>) => void;
}

export default function PersonalSlide({
  formData,
  updateFormData,
}: PersonalSlideProps) {
  const handlePersonalFieldChange = (field: string, value: string) => {
    updateFormData({
      personalInfo: {
        ...formData.personalInfo,
        [field]: value,
      },
    });
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName">First Name *</Label>
          <Input
            id="firstName"
            value={formData.personalInfo.firstName}
            onChange={(e) =>
              handlePersonalFieldChange("firstName", e.target.value)
            }
            placeholder="Enter your first name"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName">Last Name *</Label>
          <Input
            id="lastName"
            value={formData.personalInfo.lastName}
            onChange={(e) =>
              handlePersonalFieldChange("lastName", e.target.value)
            }
            placeholder="Enter your last name"
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Email Address *</Label>
        <Input
          id="email"
          type="email"
          value={formData.personalInfo.email}
          onChange={(e) => handlePersonalFieldChange("email", e.target.value)}
          placeholder="Enter your email address"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="phone">Phone Number</Label>
        <Input
          id="phone"
          type="tel"
          value={formData.personalInfo.phone}
          onChange={(e) => handlePersonalFieldChange("phone", e.target.value)}
          placeholder="Enter your phone number"
        />
      </div>
    </div>
  );
}
