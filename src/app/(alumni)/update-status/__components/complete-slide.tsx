import { Check } from "lucide-react";
import type { FormData } from "../types/form-data";

interface CompleteSlideProps {
  formData: FormData;
}

export default function CompleteSlide({ formData }: CompleteSlideProps) {
  return (
    <div className="text-center space-y-6">
      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
        <Check className="w-10 h-10 text-green-600" />
      </div>
      <div>
        <h2 className="text-2xl font-bold mb-2">Alumni Status Updated!</h2>
        <p className="text-gray-600">
          Thank you for keeping your alumni profile current. Your information
          helps us better serve our alumni community.
        </p>
      </div>
      <div className="bg-gray-50 p-4 rounded-lg text-left">
        <h3 className="font-semibold mb-2">Update Summary:</h3>
        <div className="text-sm space-y-1">
          <p>
            <strong>Name:</strong> {formData.personalInfo.firstName}{" "}
            {formData.personalInfo.lastName}
          </p>
          <p>
            <strong>Email:</strong> {formData.personalInfo.email}
          </p>
          <p>
            <strong>Employment Status:</strong> {formData.employmentStatus}
          </p>
          {(formData.employmentStatus === "employed" ||
            formData.employmentStatus === "freelancer") && (
            <p>
              <strong>Industries:</strong>{" "}
              {formData.industryInfo.selectedIndustries.join(", ")}
              {formData.industryInfo.otherIndustry &&
                ` (Other: ${formData.industryInfo.otherIndustry})`}
            </p>
          )}
          {(formData.employmentStatus === "unemployed" ||
            formData.employmentStatus === "student") && (
            <p>
              <strong>Location:</strong>{" "}
              {formData.locationInfo.selectedLocation || "Not specified"}
            </p>
          )}
          <p>
            <strong>Alumni Status:</strong>{" "}
            {formData.alumniInfo.isAlumni === "yes" ? "Yes" : "No"}
          </p>
          {formData.alumniInfo.isAlumni === "yes" &&
            formData.alumniInfo.institution && (
              <p>
                <strong>Institution:</strong> {formData.alumniInfo.institution}
              </p>
            )}
        </div>
      </div>
    </div>
  );
}
