import { readUsersUpdatedInLastDaysAction } from "@/actions";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components";
import { formatAddress } from "@/lib";
import { BarChart3, Users } from "lucide-react";
import { EngagementStatistics } from "./engagement-stats";
import {
  getEmploymentStatisticsAction,
  getEngagementStatisticsAction,
} from "@/actions/stats";
import { EmploymentStatistics } from "./employment-stat";
import { Suspense } from "react";
import Link from "next/link";

async function EmploymentTab() {
  try {
    const employmentData = await getEmploymentStatisticsAction();
    return <EmploymentStatistics data={employmentData} />;
  } catch {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Employment Statistics</CardTitle>
          <CardDescription>
            Track alumni employment across industries and regions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex items-center justify-center">
            <BarChart3 className="h-16 w-16 text-muted-foreground" />
            <p className="ml-4 text-muted-foreground">
              Unable to load employment statistics. Please check your database
              connection.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }
}

async function EngagementTab() {
  try {
    const engagementData = await getEngagementStatisticsAction();
    return <EngagementStatistics data={engagementData} />;
  } catch {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Alumni Engagement</CardTitle>
          <CardDescription>
            Track alumni participation in events and programs
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex items-center justify-center">
            <BarChart3 className="h-16 w-16 text-muted-foreground" />
            <p className="ml-4 text-muted-foreground">
              Unable to load engagement analytics. Please check your database
              connection.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }
}

function LoadingCard({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <p className="ml-4 text-muted-foreground">Loading analytics...</p>
        </div>
      </CardContent>
    </Card>
  );
}

export default async function DiffViewTabs() {
  const recentAlumni = await readUsersUpdatedInLastDaysAction();

  return (
    <section className="mt-6">
      <Tabs defaultValue="recent">
        <div className="flex items-center justify-between mb-4">
          <TabsList>
            <TabsTrigger value="recent">Recent Alumni</TabsTrigger>
            <TabsTrigger value="engagement">Engagement</TabsTrigger>
            <TabsTrigger value="employment">Employment</TabsTrigger>
          </TabsList>
          <Button asChild variant="outline" size="sm">
            <Link href="/admin/alumni">
              <Users className="mr-2 h-4 w-4" />
              View All Alumni
            </Link>
          </Button>
        </div>
        <TabsContent value="recent" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recently Updated Alumni Profiles</CardTitle>
              <CardDescription>
                Alumni who have updated their profiles in the last 30 days
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentAlumni.map((alumni) => (
                  <div
                    key={alumni.id}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage
                          src={alumni.avatar || ""}
                          alt={alumni.firstName + " " + alumni.lastName}
                        />
                        <AvatarFallback>
                          {alumni.firstName.charAt(0)}
                          {alumni.lastName.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">
                          {alumni.firstName} {alumni.lastName}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Class of {alumni.batch}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm">{alumni.company}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatAddress(alumni.address)?.address || "No address"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            {/*<CardFooter>
              <Button variant="ghost" size="sm" className="w-full">
                Load More
              </Button>
            </CardFooter>*/}
          </Card>
        </TabsContent>

        <TabsContent value="employment">
          <Suspense
            fallback={
              <LoadingCard
                title="Employment Statistics"
                description="Track alumni employment across industries and regions"
              />
            }
          >
            <EmploymentTab />
          </Suspense>
        </TabsContent>

        <TabsContent value="engagement">
          <Suspense
            fallback={
              <LoadingCard
                title="Alumni Engagement"
                description="Track alumni participation in events and programs"
              />
            }
          >
            <EngagementTab />
          </Suspense>
        </TabsContent>
      </Tabs>
    </section>
  );
}
