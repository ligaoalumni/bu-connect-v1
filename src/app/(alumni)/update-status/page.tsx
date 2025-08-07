"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ArrowLeft, ArrowRight, AlertCircle } from "lucide-react";

// Import slide __components
import EmploymentSlide from "./__components/employment-slide";
import IndustrySlide from "./__components/industry-slide";
import LocationSlide from "./__components/location-slide";
import PersonalSlide from "./__components/personal-slide";
import AdditionalSlide from "./__components/additional-slide";
import CompleteSlide from "./__components/complete-slide";

// Import types and validation
import { type FormData, initialFormData } from "./types/form-data";
import { validateStep } from "./utils/validation";
import { getSteps } from "./utils/steps";
import { useSearchParams } from "next/navigation";
import { OccupationStatus } from "@prisma/client";
import { getInformation } from "@/actions";
import { AddressData } from "@/types";

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
        const address: AddressData =
          typeof user.address === "string"
            ? JSON.parse(user.address)
            : user.address;

        setFormData((prevData) => ({
          ...prevData,
          locationInfo: {
            selectedLocation: address,
          },
          personalInfo: {
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            phone: user.contactNumber?.toString() || "",
          },
          employmentStatus: status || "",
          industryInfo: "",
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

  const nextStep = () => {
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

      case "industry":
        return (
          <IndustrySlide
            value={formData.industryInfo}
            handleChange={(value) =>
              setFormData((prev) => ({ ...prev, industryInfo: value! }))
            }
          />
        );

      case "location":
        return (
          <LocationSlide
            location={formData.locationInfo.selectedLocation}
            handleUpdateLocaton={(value: AddressData) =>
              setFormData((prev) => ({
                ...prev,
                locationInfo: { selectedLocation: value },
              }))
            }
          />
        );

      // case "alumni":
      //   return (
      //     <AlumniSlide formData={formData} updateFormData={updateFormData} />
      //   );

      case "personal":
        return (
          <PersonalSlide formData={formData} updateFormData={updateFormData} />
        );

      case "additional":
        return (
          <AdditionalSlide
            formData={formData}
            updateFormData={updateFormData}
          />
        );

      case "complete":
        return <CompleteSlide formData={formData} />;

      default:
        return null;
    }
  };

  const canProceed = validationErrors.length === 0;

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

            <div className="flex justify-between mt-8 pt-6 border-t">
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
                  Next
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              )}
            </div>

            {currentStep === steps.length - 1 && (
              <div className="flex justify-center mt-8 pt-6 border-t">
                <Button
                  onClick={() => window.location.reload()}
                  variant="outline"
                >
                  Update Another Profile
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
