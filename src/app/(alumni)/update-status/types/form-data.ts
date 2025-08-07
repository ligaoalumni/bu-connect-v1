import { AddressData } from "@/types";

export interface FormData {
  employmentStatus: string;
  industryInfo: {
    selectedIndustries: string[];
    otherIndustry: string;
  };
  locationInfo: {
    selectedLocation: AddressData;
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
  industryInfo: {
    selectedIndustries: [],
    otherIndustry: "",
  },
  locationInfo: {
    selectedLocation: {
      address: "",
      lat: 0,
      lng: 0,
    },
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
