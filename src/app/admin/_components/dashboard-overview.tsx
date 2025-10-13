"use client";
import { LucideIcon } from "lucide-react";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components";
import { generatedUpdateAlumniReport } from "@/actions/report";
import { useState } from "react";
import {
  getEmploymentStatisticsAction,
  getEngagementStatisticsAction,
} from "@/actions/stats";
import {
  exportEmploymentStatsToPDF,
  generateAlumniPDF,
  exportEngagementToPDF,
} from "@/lib/export-pdf";
import { toast } from "sonner";

export default function DashboardOverview() {
  const [loading, setLoading] = useState(false);

  const handleGenerateAlumniPDF = async () => {
    try {
      setLoading(true);
      const data = await generatedUpdateAlumniReport();
      generateAlumniPDF(data);
    } catch {
      toast.error("Failed to generate PDF", {
        description: "Please try again later.",
        duration: 5000,
        position: "top-right",
        richColors: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateEmploymentPDF = async () => {
    try {
      setLoading(true);
      const data = await getEmploymentStatisticsAction();
      exportEmploymentStatsToPDF(data);
    } catch {
      toast.error("Failed to generate PDF", {
        description: "Please try again later.",
        duration: 5000,
        position: "top-right",
        richColors: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateEngagementPDF = async () => {
    try {
      setLoading(true);
      const data = await getEngagementStatisticsAction();
      exportEngagementToPDF(data);
    } catch {
      toast.error("Failed to generate PDF", {
        description: "Please try again later.",
        duration: 5000,
        position: "top-right",
        richColors: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="mt-6 flex justify-between items-center">
      <h2 className="text-2xl font-bold tracking-tight mb-4">Overview</h2>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button disabled={loading} variant="outline">
            {loading ? "Generating..." : "Generate Reports"}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end">
          <DropdownMenuLabel>Reports</DropdownMenuLabel>
          <DropdownMenuItem onClick={handleGenerateAlumniPDF}>
            Updated Alumni Report
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleGenerateEngagementPDF}>
            Engagement Report
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleGenerateEmploymentPDF}>
            Employment Report
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </section>
  );
}

export const OverviewCard = ({
  change,
  Icon,
  title,
  value,
}: {
  title: string;
  value: string;
  Icon: LucideIcon;
  change: string;
}) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {<Icon />}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground mt-1">
          <span
            className={
              change.startsWith("+") ? "text-green-500" : "text-primary"
            }
          >
            {change.split(":")[0]}
          </span>
          <span className="text-muted-foreground">{change.split(":")[1]}</span>
        </p>
      </CardContent>
    </Card>
  );
};
