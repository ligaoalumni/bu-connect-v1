"use client";

import { Button } from "@/components/ui/button";
import { GraduationCap, ArrowRight } from "lucide-react";

interface WelcomeSlideProps {
  onNext?: () => void;
}

export default function WelcomeSlide({ onNext }: WelcomeSlideProps) {
  return (
    <div className="text-center space-y-6">
      <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
        <GraduationCap className="w-10 h-10 text-blue-600" />
      </div>
      <div>
        <h2 className="text-2xl font-bold mb-2">Update Your Alumni Status</h2>
        <p className="text-gray-600">
          Help us keep your alumni profile current by updating your employment
          status, location, and contact information
        </p>
      </div>
      {onNext && (
        <Button onClick={onNext} size="lg" className="w-full">
          Start Update
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      )}
    </div>
  );
}
