"use client";

import { useAuth } from "@/contexts";
import Link from "next/link";
import React from "react";
import { Button } from "../ui/button";
import { QRCodeScanner } from "./qr-code-scanner";
import { usePathname } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";

interface EventInfoHeaderProps {
  eventTitle: string;
  eventSlug: string;
  eventId: number;
  status: string;
}

export default function EventInfoHeader({
  eventTitle,
  eventId,
  eventSlug,
  status,
}: EventInfoHeaderProps) {
  const { user } = useAuth();
  const path = usePathname();

  return (
    <div className="flex justify-between items-center">
      <div className="flex items-center gap-4">
        <TooltipProvider>
          <Tooltip delayDuration={300}>
            <TooltipTrigger asChild>
              <Button size="icon" asChild>
                <Link
                  href={
                    user?.role
                      ? user.role === "ALUMNI"
                        ? "/events"
                        : "/admin/events"
                      : `/events`
                  }
                >
                  <ChevronLeft />
                </Link>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>Back</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <h1 className="text-3xl font-medium">{eventTitle}</h1>
      </div>

      {user && user.role !== "ALUMNI" && path.includes("/admin") && (
        <div className="flex items-center gap-2">
          {status === "Upcoming Event" && (
            <Link href={`/admin/events/${eventSlug}/edit`}>
              <Button>Edit</Button>
            </Link>
          )}
          {status === "Ongoing Event" && <QRCodeScanner eventId={eventId} />}
        </div>
      )}
    </div>
  );
}
