import { OccupationStatus } from "@prisma/client";
import type { FormData } from "../types/form-data";
import {
  User,
  Briefcase,
  MapPin,
  Building,
  Check,
  GraduationCap,
  CheckCircle,
} from "lucide-react";
import { IconDetails } from "@tabler/icons-react";

export const getSteps = (formData: FormData) => {
  const baseSteps = [
    // {
    //   id: "welcome",
    //   title: "Alumni Status Update",
    //   subtitle: "Help us keep your alumni profile up to date",
    //   icon: <GraduationCap className="w-8 h-8" />,
    // },
    {
      id: "employment",
      title: "Current Employment Status",
      subtitle: "What's your current professional situation?",
      icon: <Briefcase className="w-8 h-8" />,
    },
  ];

  if (formData.employmentStatus === OccupationStatus.POST_GRADUATE_STUDENT) {
    baseSteps.push({
      id: "post-study",
      title: "Post Study Information",
      subtitle: "Which university are you currently studying at?",
      icon: <GraduationCap className="h-8 w-8" />,
    });
  }

  // Add conditional step based on employment status
  if (
    formData.employmentStatus === OccupationStatus.EMPLOYED ||
    formData.employmentStatus === OccupationStatus.SELF_EMPLOYED
  ) {
    baseSteps.push({
      id: "industry",
      title: "Industry Information",
      subtitle: "Which industries are you currently working in?",
      icon: <Building className="w-8 h-8" />,
    });
  }

  baseSteps.push(
    {
      id: "personal",
      title: "Contact Information",
      subtitle: "Ensure we have your current contact details",
      icon: <User className="w-8 h-8" />,
    },
    {
      id: "location",
      title: "Current Location",
      subtitle: "Where are you currently based?",
      icon: <MapPin className="w-8 h-8" />,
    },

    {
      id: "review",
      title: "Review",
      subtitle:
        "Review and update existing data to keep it accurate and up to date.",
      icon: <IconDetails className="w-8 h-8" />,
    },
    {
      id: "complete",
      title: "Update Completed!",
      subtitle: "Your changes have been successfully applied and saved.",
      icon: <CheckCircle className="w-8 h-8 text-green-600" />,
    },
  );

  return baseSteps;
};
