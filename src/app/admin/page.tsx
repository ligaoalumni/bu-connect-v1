import { DashboardEventSectionSkeleton } from "./_components/dashboard-event-section";
import DashboardOverview from "./_components/dashboard-overview";
import DiffViewTabs from "./_components/diff-view-tabs";
import dynamic from "next/dynamic";

const DashboardEventSection = dynamic(
  () => import("./_components/dashboard-event-section"),
  {
    loading: DashboardEventSectionSkeleton,
  },
);

export default async function Dashboard() {
  return (
    <div className="flex  w-full  ">
      <div className="flex-1">
        <div className="grid gap-3">
          {/* Today's Events Section */}
          <DashboardEventSection />

          {/* Overview */}
          <DashboardOverview />

          {/* Tabs for different views */}
          <DiffViewTabs />
        </div>
      </div>
    </div>
  );
}
