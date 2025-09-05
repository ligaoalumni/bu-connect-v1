import { prisma } from "@/lib";
import { EmploymentStats, EngagementStats } from "@/types";
import { OccupationStatus } from "@prisma/client";

export async function getEmploymentStatistics(): Promise<EmploymentStats> {
  try {
    // Get total alumni count
    const totalAlumni = await prisma.user.count({
      where: { role: "ALUMNI" },
    });

    // Get employment status counts
    const employmentCounts = await prisma.user.groupBy({
      by: ["occupationStatus"],
      where: { role: "ALUMNI" },
      _count: true,
    });

    const employed =
      employmentCounts.find(
        (e) => e.occupationStatus === OccupationStatus.EMPLOYED,
      )?._count || 0;
    const unemployed =
      employmentCounts.find(
        (e) => e.occupationStatus === OccupationStatus.UNEMPLOYED,
      )?._count || 0;
    const selfEmployed =
      employmentCounts.find(
        (e) => e.occupationStatus === OccupationStatus.SELF_EMPLOYED,
      )?._count || 0;
    const postGradStudent =
      employmentCounts.find(
        (e) => e.occupationStatus === OccupationStatus.POST_GRADUATE_STUDENT,
      )?._count || 0;

    const employmentRate =
      totalAlumni > 0 ? ((employed + selfEmployed) / totalAlumni) * 100 : 0;

    // Get industry distribution
    const industryData = await prisma.user.groupBy({
      by: ["industry"],
      where: {
        role: "ALUMNI",
        industry: { not: null },
        occupationStatus: {
          in: [OccupationStatus.EMPLOYED, OccupationStatus.SELF_EMPLOYED],
        },
      },
      _count: true,
    });

    const industryDistribution = industryData
      .filter((item) => item.industry)
      .map((item) => ({
        industry: item.industry || "Unknown",
        count: item._count,
        percentage: totalAlumni > 0 ? (item._count / totalAlumni) * 100 : 0,
      }))
      .sort((a, b) => b.count - a.count);

    // Get occupation distribution
    const occupationData = await prisma.user.groupBy({
      by: ["currentOccupation"],
      where: {
        role: "ALUMNI",
        currentOccupation: { not: null },
        occupationStatus: {
          in: [OccupationStatus.EMPLOYED, OccupationStatus.SELF_EMPLOYED],
        },
      },
      _count: true,
    });

    const occupationDistribution = occupationData
      .filter((item) => item.currentOccupation)
      .map((item) => ({
        occupation: item.currentOccupation || "Unknown",
        count: item._count,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10); // Top 10 occupations

    // Get batch employment statistics
    const batchData = await prisma.user.groupBy({
      by: ["batch", "occupationStatus"],
      where: {
        role: "ALUMNI",
        batch: { not: null },
      },
      _count: true,
    });

    const batchStats = new Map<number, { employed: number; total: number }>();

    batchData.forEach((item) => {
      if (item.batch) {
        if (!batchStats.has(item.batch)) {
          batchStats.set(item.batch, { employed: 0, total: 0 });
        }
        const stats = batchStats.get(item.batch)!;
        stats.total += item._count;
        if (
          item.occupationStatus === OccupationStatus.EMPLOYED ||
          item.occupationStatus === OccupationStatus.SELF_EMPLOYED
        ) {
          stats.employed += item._count;
        }
      }
    });

    const batchEmploymentStats = Array.from(batchStats.entries())
      .map(([batch, stats]) => ({
        batch,
        employed: stats.employed,
        total: stats.total,
        rate: stats.total > 0 ? (stats.employed / stats.total) * 100 : 0,
      }))
      .sort((a, b) => b.batch - a.batch);

    return {
      totalAlumni,
      employedCount: employed,
      unemployedCount: unemployed,
      selfEmployedCount: selfEmployed,
      postGradStudentCount: postGradStudent,
      employmentRate,
      industryDistribution,
      occupationDistribution,
      batchEmploymentStats,
    };
  } catch (error) {
    console.error("Error fetching employment statistics:", error);
    throw new Error("Failed to fetch employment statistics");
  }
}

export async function getEngagementStatistics(): Promise<EngagementStats> {
  // Get total events
  const totalEvents = await prisma.event.count();

  // Get total unique attendees
  const totalAttendees = await prisma.user.count({
    where: {
      role: "ALUMNI",
      eventsAttended: { some: {} },
    },
  });

  // Get event participation data
  const events = await prisma.event.findMany({
    include: {
      alumni: true,
      interested: true,
    },
    orderBy: { startDate: "desc" },
  });

  const eventParticipation = events.map((event) => ({
    eventName: event.name,
    attendees: event.alumni.length,
    interested: event.interested.length,
    date: event.startDate.toISOString().split("T")[0],
  }));

  // Calculate average attendance rate
  const totalPossibleAttendance =
    totalEvents * (await prisma.user.count({ where: { role: "ALUMNI" } }));
  const totalActualAttendance = eventParticipation.reduce(
    (sum, event) => sum + event.attendees,
    0,
  );
  const averageAttendanceRate =
    totalPossibleAttendance > 0
      ? (totalActualAttendance / totalPossibleAttendance) * 100
      : 0;

  // Get batch engagement statistics
  const batchEngagementData = await prisma.user.findMany({
    where: {
      role: "ALUMNI",
      batch: { not: null },
    },
    select: {
      batch: true,
      eventsAttended: { select: { id: true } },
    },
  });

  const batchEngagementMap = new Map<
    number,
    { attended: number; total: number }
  >();

  batchEngagementData.forEach((user) => {
    if (user.batch) {
      if (!batchEngagementMap.has(user.batch)) {
        batchEngagementMap.set(user.batch, { attended: 0, total: 0 });
      }
      const stats = batchEngagementMap.get(user.batch)!;
      stats.total += 1;
      stats.attended += user.eventsAttended.length;
    }
  });

  const batchEngagement = Array.from(batchEngagementMap.entries())
    .map(([batch, stats]) => ({
      batch,
      eventsAttended: stats.attended,
      totalEvents: totalEvents * stats.total, // Total possible attendance for this batch
      engagementRate:
        stats.total > 0 && totalEvents > 0
          ? (stats.attended / (totalEvents * stats.total)) * 100
          : 0,
    }))
    .sort((a, b) => b.batch - a.batch);

  // Get monthly engagement (last 12 months)
  const twelveMonthsAgo = new Date();
  twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);

  const monthlyEvents = await prisma.event.findMany({
    where: {
      startDate: { gte: twelveMonthsAgo },
    },
    include: {
      alumni: true,
    },
  });

  const monthlyEngagementMap = new Map<
    string,
    { events: number; attendees: number }
  >();

  monthlyEvents.forEach((event) => {
    const monthKey = event.startDate.toISOString().substring(0, 7); // YYYY-MM format
    if (!monthlyEngagementMap.has(monthKey)) {
      monthlyEngagementMap.set(monthKey, { events: 0, attendees: 0 });
    }
    const stats = monthlyEngagementMap.get(monthKey)!;
    stats.events += 1;
    stats.attendees += event.alumni.length;
  });

  const monthlyEngagement = Array.from(monthlyEngagementMap.entries())
    .map(([month, stats]) => ({
      month,
      events: stats.events,
      attendees: stats.attendees,
    }))
    .sort((a, b) => a.month.localeCompare(b.month));

  // Get top engaged alumni
  const topEngagedAlumni = await prisma.user.findMany({
    where: { role: "ALUMNI" },
    select: {
      firstName: true,
      lastName: true,
      batch: true,
      eventsAttended: { select: { id: true } },
    },
    orderBy: {
      eventsAttended: { _count: "desc" },
    },
    take: 10,
  });

  const topEngaged = topEngagedAlumni.map((user) => ({
    name: `${user.firstName} ${user.lastName}`,
    eventsAttended: user.eventsAttended.length,
    batch: user.batch || 0,
  }));

  return {
    totalEvents,
    totalAttendees,
    averageAttendanceRate,
    eventParticipation,
    batchEngagement,
    monthlyEngagement,
    topEngagedAlumni: topEngaged,
  };
}
