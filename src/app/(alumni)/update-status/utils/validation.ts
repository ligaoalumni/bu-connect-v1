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
      if (formData.industryInfo.selectedIndustries.length === 0) {
        errors.push("Please select at least one industry");
      }
      if (
        formData.industryInfo.selectedIndustries.includes("Other") &&
        !formData.industryInfo.otherIndustry.trim()
      ) {
        errors.push("Please specify the other industry");
      }
      break;

    case "location":
      if (!formData.locationInfo.selectedLocation.trim()) {
        errors.push("Please enter your current location");
      }
      break;

    case "alumni":
      if (!formData.alumniInfo.isAlumni) {
        errors.push("Please specify if you are an alumni");
      }
      if (formData.alumniInfo.isAlumni === "yes") {
        if (!formData.alumniInfo.institution.trim()) {
          errors.push("Please enter your institution name");
        }
        if (!formData.alumniInfo.graduationYear.trim()) {
          errors.push("Please enter your graduation year");
        }
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
