import type { FormData } from "../types/form-data";

export const validateStep = (stepId: string, formData: FormData): string[] => {
  const errors: string[] = [];

  switch (stepId) {
    case "welcome":
      // No validation needed for welcome step
      break;

    case "employment":
      if (!formData.employmentStatus) {
        errors.push("Please select your current employment status");
      }
      break;

    case "industry":
      if (!formData.industryInfo) {
        errors.push("Please select industry");
      }
      break;

    case "location":
      if (!formData.locationInfo.selectedLocation.address.trim()) {
        errors.push("Please enter your current location");
      }
      break;

    case "personal":
      if (!formData.personalInfo.firstName.trim()) {
        errors.push("Please enter your first name");
      }
      if (!formData.personalInfo.lastName.trim()) {
        errors.push("Please enter your last name");
      }
      if (!formData.personalInfo.email.trim()) {
        errors.push("Please enter your email address");
      } else if (!/\S+@\S+\.\S+/.test(formData.personalInfo.email)) {
        errors.push("Please enter a valid email address");
      }
      break;

    case "additional":
      // No required fields for additional info
      break;

    default:
      break;
  }

  return errors;
};
