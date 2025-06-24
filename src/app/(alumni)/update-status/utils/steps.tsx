import type { FormData } from "../types/form-data";
import {
  User,
  Briefcase,
  GraduationCap,
  MapPin,
  Building,
  Check,
} from "lucide-react";

export const getSteps = (formData: FormData) => {
  const baseSteps = [
    {
      id: "welcome",
      title: "Alumni Status Update",
      subtitle: "Help us keep your alumni profile up to date",
      icon: <GraduationCap className="w-8 h-8" />,
    },
    {
      id: "employment",
      title: "Current Employment Status",
      subtitle: "What's your current professional situation?",
      icon: <Briefcase className="w-8 h-8" />,
    },
  ];

  // Add conditional step based on employment status
  if (
    formData.employmentStatus === "employed" ||
    formData.employmentStatus === "freelancer"
  ) {
    baseSteps.push({
      id: "industry",
      title: "Industry Information",
      subtitle: "Which industries are you currently working in?",
      icon: <Building className="w-8 h-8" />,
    });
  } else if (
    formData.employmentStatus === "unemployed" ||
    formData.employmentStatus === "student"
  ) {
    baseSteps.push({
      id: "location",
      title: "Current Location",
      subtitle: "Where are you currently based?",
      icon: <MapPin className="w-8 h-8" />,
    });
  }

  baseSteps.push(
    {
      id: "alumni",
      title: "Alumni Information",
      subtitle: "Update your educational background details",
      icon: <GraduationCap className="w-8 h-8" />,
    },
    {
      id: "personal",
      title: "Contact Information",
      subtitle: "Ensure we have your current contact details",
      icon: <User className="w-8 h-8" />,
    },
    {
      id: "additional",
      title: "Additional Updates",
      subtitle: "Any other information you'd like to share?",
      icon: <User className="w-8 h-8" />,
    },
    {
      id: "complete",
      title: "Status Updated!",
      subtitle: "Your alumni profile has been successfully updated",
      icon: <Check className="w-8 h-8" />,
    },
  );

  return baseSteps;
};
