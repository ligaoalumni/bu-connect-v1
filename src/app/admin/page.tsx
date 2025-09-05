import { DashboardEventSectionSkeleton } from "./_components/dashboard-event-section";
import { lazy, Suspense } from "react";
import DashboardOverview from "./_components/dashboard-overview";
import DiffViewTabs from "./_components/diff-view-tabs";

const DashboardEventSection = lazy(
  () => import("./_components/dashboard-event-section"),
);

export default async function Dashboard() {
  return (
    <div className="flex  w-full  ">
      <div className="flex-1">
        <div className="grid gap-3">
          {/* Today's Events Section */}
          <Suspense fallback={<DashboardEventSectionSkeleton />}>
            <DashboardEventSection />
          </Suspense>

          {/* Overview */}
          <DashboardOverview />

          {/* Tabs for different views */}
          <DiffViewTabs />
        </div>
      </div>
    </div>
  );
}
