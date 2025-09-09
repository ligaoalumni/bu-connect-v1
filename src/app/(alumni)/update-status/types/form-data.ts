import { AddressData } from "@/types";
import { OccupationStatus } from "@prisma/client";

export interface FormData {
  id: number;
  jobTitle?: string;
  employmentStatus: OccupationStatus | string;
  company?: string;
  industryInfo?: string;
  postStudy?: string;
  years?: number;
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
    phone: string;
    nationality: string;
    religion: string;
    gender: string;
    middleName?: string;
    birthDate: string; // ISO date string
  };
  additionalInfo: {
    comments: string;
  };
}

export const initialFormData: FormData = {
  id: 0,
  employmentStatus: "",
  industryInfo: undefined,
  company: "",
  postStudy: "",
  years: undefined,
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
    birthDate: "",
    gender: "",
    nationality: "",
    religion: "",
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
