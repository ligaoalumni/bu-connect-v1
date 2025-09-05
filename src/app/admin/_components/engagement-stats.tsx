"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { EngagementStats } from "@/types";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  LineChart,
  Line,
} from "recharts";

interface EngagementStatisticsProps {
  data: EngagementStats;
}

export function EngagementStatistics({ data }: EngagementStatisticsProps) {
  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Events</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.totalEvents}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active Alumni</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.totalAttendees}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Avg Attendance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {data.averageAttendanceRate.toFixed(1)}%
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Recent Events</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {data.eventParticipation.slice(0, 3).length}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Event Participation */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Event Participation</CardTitle>
            <CardDescription>
              Attendance and interest in recent events
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data.eventParticipation.slice(0, 8)}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="eventName"
                  angle={-45}
                  textAnchor="end"
                  height={80}
                  fontSize={12}
                />
                <YAxis />
                <Tooltip />
                <Bar
                  dataKey="attendees"
                  fill="hsl(var(--chart-1))"
                  name="Attendees"
                />
                <Bar
                  dataKey="interested"
                  fill="hsl(var(--chart-2))"
                  name="Interested"
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Batch Engagement */}
        <Card>
          <CardHeader>
            <CardTitle>Engagement by Batch</CardTitle>
            <CardDescription>
              Event participation rates across batches
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data.batchEngagement}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="batch" />
                <YAxis />
                <Tooltip
                  formatter={(value, name) => [
                    name === "engagementRate"
                      ? `${Number(value).toFixed(1)}%`
                      : value,
                    name === "engagementRate"
                      ? "Engagement Rate"
                      : "Events Attended",
                  ]}
                />
                <Bar
                  dataKey="engagementRate"
                  fill="hsl(var(--chart-3))"
                  name="engagementRate"
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Monthly Engagement Trend */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Monthly Engagement Trend</CardTitle>
            <CardDescription>
              Event activity and attendance over the last 12 months
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={data.monthlyEngagement}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="events"
                  stroke="hsl(var(--chart-4))"
                  strokeWidth={2}
                  name="Events"
                />
                <Line
                  type="monotone"
                  dataKey="attendees"
                  stroke="hsl(var(--chart-5))"
                  strokeWidth={2}
                  name="Total Attendees"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Top Engaged Alumni */}
      <Card>
        <CardHeader>
          <CardTitle>Most Engaged Alumni</CardTitle>
          <CardDescription>
            Alumni with highest event participation
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {data.topEngagedAlumni.slice(0, 5).map((alumni, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
              >
                <div>
                  <p className="font-medium">{alumni.name}</p>
                  <p className="text-sm text-muted-foreground">
                    Batch {alumni.batch}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold">{alumni.eventsAttended}</p>
                  <p className="text-sm text-muted-foreground">events</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
