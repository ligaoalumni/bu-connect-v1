"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ArrowLeft, ArrowRight, AlertCircle, Loader2 } from "lucide-react";

// Import slide __components
import EmploymentSlide from "./__components/employment-slide";
import IndustrySlide from "./__components/industry-slide";
import LocationSlide from "./__components/location-slide";
import PersonalSlide from "./__components/personal-slide";
import ReviewSlide from "./__components/review-slide";

// Import types and validation
import { type FormData, initialFormData } from "./types/form-data";
import { validateStep } from "./utils/validation";
import { getSteps } from "./utils/steps";
import { useSearchParams } from "next/navigation";
import { Gender, OccupationStatus } from "@prisma/client";
import { getInformation, updateProfileStatusAction } from "@/actions";
import { AddressData } from "@/types";
import { formatAddress, parseAddress } from "@/lib";
import PostStudiesSlide from "./__components/post-studies-slide";
import Link from "next/link";
import { toast } from "sonner";

export default function AlumniStatusUpdateForm() {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [isAnimating, setIsAnimating] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const [loading, setIsLoading] = useState(false);

  const params = useSearchParams();

  const status = params.get("status") as OccupationStatus | null;

  const occupations = Object.values(OccupationStatus) as OccupationStatus[];

  useEffect(() => {
    // GET USER INFO
    (async () => {
      setIsLoading(true);
      const user = await getInformation();

      if (user) {
        const address: AddressData = parseAddress(JSON.stringify(user.address));

        setFormData((prevData) => ({
          ...prevData,
          id: user.id,
          locationInfo: {
            selectedLocation: address ? formatAddress(address) : undefined,
          },
          personalInfo: {
            firstName: user.firstName,
            lastName: user.lastName,
            phone: user.contactNumber?.toString() || "",
            birthDate: user.birthDate.toISOString() || "",
            gender: user.gender || "",
            nationality: user.nationality || "",
            religion: user.religion || "",
          },
          company: user.company || "",
          industryInfo: user.industry || "",
          jobTitle: user.jobTitle || "",
          postStudy: user.postStudyUniversity || "",
          employmentStatus: status || "",
        }));
      }

      setTimeout(() => {
        setIsLoading(false);
      }, 2000);
    })();
  }, [status]);

  if (
    !status ||
    !occupations.includes(params.get("status") as OccupationStatus)
  ) {
    window.history.back();
  }

  const steps = getSteps(formData);

  const nextStep = async () => {
    if (currentStep === steps.length - 2) {
      try {
        await updateProfileStatusAction(formData.id, {
          currentOccupation: formData.employmentStatus as OccupationStatus,
          firstName: formData.personalInfo.firstName,
          lastName: formData.personalInfo.lastName,
          birthDate: formData.personalInfo.birthDate,
          company: formData.company,
          industry: formData.industryInfo,
          gender: formData.personalInfo.gender as Gender,
          address: formData.locationInfo.selectedLocation,
          religion: formData.personalInfo.religion,
          contactNumber: formData.personalInfo.phone,
          nationality: formData.personalInfo.nationality,
          jobTitle: formData.jobTitle,
          middleName: formData.personalInfo.middleName,
        });

        toast.success("Your information has been successfully submitted!", {
          description: "Thank you for updating your status.",
          position: "top-center",
          richColors: true,
        });
        setIsAnimating(true);
        setTimeout(() => {
          setCurrentStep(currentStep + 1);
          setValidationErrors([]);
          setIsAnimating(false);
        }, 150);
      } catch {
        toast.error(
          "An error occurred while submitting your information. Please try again.",
          {
            description: "If the problem persists, contact support.",
            position: "top-center",
            richColors: true,
          },
        );
      }
    } else {
      const errors = validateStep(steps[currentStep].id, formData);
      setValidationErrors(errors);

      if (errors.length === 0 && currentStep < steps.length - 1) {
        setIsAnimating(true);
        setTimeout(() => {
          setCurrentStep(currentStep + 1);
          setValidationErrors([]);
          setIsAnimating(false);
        }, 150);
      }
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentStep(currentStep - 1);
        setValidationErrors([]);
        setIsAnimating(false);
      }, 150);
    }
  };

  const updateFormData = (updates: Partial<FormData>) => {
    setFormData((prev) => ({ ...prev, ...updates }));
    if (validationErrors.length > 0) {
      setValidationErrors([]);
    }
  };

  const progress = ((currentStep + 1) / steps.length) * 100;

  const renderStepContent = () => {
    const stepId = steps[currentStep]?.id;

    switch (stepId) {
      case "employment":
        return (
          <EmploymentSlide
            formData={formData}
            updateFormData={updateFormData}
          />
        );

      case "post-study":
        return (
          <PostStudiesSlide
            value={formData.postStudy}
            handleUniversityChange={(value) => {
              setFormData((prev) => ({ ...prev, postStudy: value! }));
              setValidationErrors([]);
            }}
          />
        );

      case "industry":
        return (
          <IndustrySlide
            values={{
              company: formData.company,
              industry: formData.industryInfo,
              jobTitle: formData.jobTitle,
            }}
            handleChange={(values) => {
              setFormData((prev) => ({
                ...prev,
                industryInfo: values.industry!,
                company: values.company!,
                jobTitle: values.jobTitle!,
              }));
              setValidationErrors([]);
            }}
          />
        );

      case "location":
        return (
          <LocationSlide
            location={
              formData.locationInfo.selectedLocation
                ? formatAddress(formData.locationInfo.selectedLocation)
                : undefined
            }
            handleUpdateLocaton={(value: AddressData) => {
              setFormData((prev) => ({
                ...prev,
                locationInfo: { selectedLocation: value },
              }));
              setValidationErrors([]);
            }}
          />
        );

      case "personal":
        return (
          <PersonalSlide formData={formData} updateFormData={updateFormData} />
        );

      case "review":
        return <ReviewSlide formData={formData} />;

      case "complete":
        return;
      default:
        return null;
    }
  };

  const canProceed = validationErrors.length === 0;

  if (loading)
    return (
      <div className="w-full min-h-[75dvh] flex items-center justify-center">
        <Loader2 className="animate-spin h-16 w-16" />
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">
              Step {currentStep + 1} of {steps.length}
            </span>
            <span className="text-sm font-medium text-gray-600">
              {Math.round(progress)}% Complete
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Form Card */}
        <Card className="shadow-xl border-0">
          <CardContent className="p-8">
            {/* Step Header */}
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <div className="text-blue-600">{steps[currentStep].icon}</div>
              </div>
              <h1 className="text-2xl font-bold mb-2">
                {steps[currentStep].title}
              </h1>
              <p className="text-gray-600">{steps[currentStep].subtitle}</p>
            </div>

            {/* Validation Errors */}
            {validationErrors.length > 0 && (
              <Alert className="mb-6 border-red-200 bg-red-50">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-800">
                  <ul className="list-disc list-inside space-y-1">
                    {validationErrors.map((error, index) => (
                      <li key={index}>{error}</li>
                    ))}
                  </ul>
                </AlertDescription>
              </Alert>
            )}

            {/* Form Content with Animation */}
            <div
              className={`transition-all duration-300 ${
                isAnimating
                  ? "opacity-0 transform translate-x-4"
                  : "opacity-100 transform translate-x-0"
              }`}
            >
              {renderStepContent()}
            </div>

            {/* Navigation Buttons */}
            {/* {currentStep > 0 && currentStep < steps.length - 1 && ( */}

            <div
              className={`flex justify-between mt-8 pt-6  ${currentStep < steps.length - 1 ? "border-t" : ""}`}
            >
              {currentStep > 0 && currentStep < steps.length - 1 && (
                <Button variant="outline" onClick={prevStep}>
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Previous
                </Button>
              )}
              {currentStep < steps.length - 1 && (
                <Button
                  className={currentStep === 0 ? "ml-auto" : ""}
                  onClick={nextStep}
                  disabled={!canProceed}
                >
                  {currentStep === steps.length - 2 ? "Submit" : "Next"}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              )}
            </div>

            {currentStep === steps.length - 1 && (
              <div className="flex justify-center mt-8 pt-6 border-t">
                <Button asChild variant="outline">
                  <Link href="/">Return to feed</Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Step Indicators */}
        <div className="flex justify-center mt-6 space-x-2">
          {steps.map((_, index) => (
            <div
              key={index}
              className={`w-3 h-3 rounded-full transition-colors ${
                index <= currentStep ? "bg-blue-600" : "bg-gray-300"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
