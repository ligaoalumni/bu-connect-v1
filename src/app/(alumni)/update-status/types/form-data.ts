import { AddressData } from "@/types";
import { OccupationStatus } from "@prisma/client";

export interface FormData {
  employmentStatus: OccupationStatus | string;
  industryInfo?: string;
  locationInfo: {
    selectedLocation?: AddressData;
  };
  alumniInfo: {
    isAlumni: string;
    institution: string;
    graduationYear: string;
    degree: string;
    currentRole: string;
  };
  personalInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  additionalInfo: {
    comments: string;
  };
}

export const initialFormData: FormData = {
  employmentStatus: "",
  industryInfo: undefined,
  locationInfo: {
    selectedLocation: undefined, // AddressData or undefined
  },
  alumniInfo: {
    isAlumni: "",
    institution: "",
    graduationYear: "",
    degree: "",
    currentRole: "",
  },
  personalInfo: {
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  },
  additionalInfo: {
    comments: "",
  },
};

export const industries = [
  "Technology & Software",
  "Healthcare & Medical",
  "Finance & Banking",
  "Education & Training",
  "Manufacturing & Engineering",
  "Retail & E-commerce",
  "Marketing & Advertising",
  "Consulting & Professional Services",
  "Real Estate & Construction",
  "Media & Entertainment",
  "Non-profit & Government",
  "Transportation & Logistics",
];
