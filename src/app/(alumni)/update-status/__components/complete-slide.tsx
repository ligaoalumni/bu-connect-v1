import { Check } from "lucide-react";
import type { FormData } from "../types/form-data";
import { Gender, OccupationStatus } from "@prisma/client";
import { formatDate } from "date-fns";
import { getGenderLabel } from "@/lib";

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
            <strong>Birth Date:</strong>{" "}
            {formatDate(formData.personalInfo.birthDate, "MMMM dd, yyyy")}
          </p>
          <p>
            <strong>Nationality:</strong> {formData.personalInfo.nationality}
          </p>
          <p>
            <strong>Phone Number:</strong> {formData.personalInfo.phone}
          </p>
          <p>
            <strong>Religion:</strong> {formData.personalInfo.religion}
          </p>
          <p>
            <strong>Gender:</strong>{" "}
            {getGenderLabel(formData.personalInfo.gender as Gender)}
          </p>
          <p>
            <strong>Employment Status:</strong>{" "}
            {formData.employmentStatus.slice(0, 1)}
            {formData.employmentStatus
              .toLowerCase()
              .slice(1)
              .split("_")
              .join(" ")}
          </p>

          {formData.employmentStatus === OccupationStatus.EMPLOYED && (
            <>
              <p>
                <strong>Company:</strong> {formData.company}
              </p>
              <p>
                <strong>Industry:</strong> {formData.industryInfo}
              </p>
            </>
          )}

          {formData.employmentStatus ===
            OccupationStatus.POST_GRADUATE_STUDENT && (
            <p>
              <strong>University/College:</strong>
              {formData.postStudy}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
