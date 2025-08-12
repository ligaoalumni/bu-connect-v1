import type { FormData } from "../types/form-data";
import { Gender, OccupationStatus } from "@prisma/client";
import { formatDate } from "date-fns";
import { getGenderLabel } from "@/lib";

interface ReviewSlideProps {
  formData: FormData;
}

export default function ReviewSlide({ formData }: ReviewSlideProps) {
  return (
    <div className="text-center space-y-6">
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
            <strong>Address:</strong>{" "}
            {formData.locationInfo.selectedLocation?.address}
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
