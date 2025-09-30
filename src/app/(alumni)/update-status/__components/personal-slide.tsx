"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import type { FormData } from "../types/form-data";
import { genderOptions, nationalities, philippineReligions } from "@/constant";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components";

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
          <Label htmlFor="middleName">Middle Name *</Label>
          <Input
            id="middleName"
            value={formData.personalInfo.lastName}
            onChange={(e) =>
              handlePersonalFieldChange("middleName", e.target.value)
            }
            placeholder="Enter your middle name"
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

        <div className="space-y-2">
          <Label htmlFor="birthdate">Birth Date</Label>
          <Input
            id="birthdate"
            type="date"
            value={
              formData.personalInfo.birthDate
                ? formData.personalInfo.birthDate.split("T")[0] // Extract just the date part
                : ""
            }
            onChange={(e) =>
              handlePersonalFieldChange("birthDate", e.target.value)
            }
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="nationality">Nationality</Label>
          <Select
            value={formData.personalInfo.nationality}
            onValueChange={(value) =>
              handlePersonalFieldChange("nationality", value)
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select your nationality" />
            </SelectTrigger>
            <SelectContent>
              {nationalities.map((nationality) => (
                <SelectItem key={nationality} value={nationality}>
                  {nationality}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="religion">Religion</Label>
          <Select
            value={formData.personalInfo.religion}
            onValueChange={(value) =>
              handlePersonalFieldChange("religion", value)
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select your religion" />
            </SelectTrigger>
            <SelectContent>
              {philippineReligions.map((religion) => (
                <SelectItem key={religion} value={religion}>
                  {religion}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="gender">Gender</Label>
          <Select
            value={formData.personalInfo.gender}
            onValueChange={(value) =>
              handlePersonalFieldChange("gender", value)
            }
          >
            <SelectTrigger className=" ">
              <SelectValue placeholder="Select your gender" />
            </SelectTrigger>
            <SelectContent>
              {genderOptions.map((gender) => (
                <SelectItem key={gender} value={gender} className="capitalize">
                  {gender.slice(0, 1)}
                  {gender.split("_").join(" ").toLocaleLowerCase().slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
