export interface EmploymentStats {
  totalAlumni: number;
  employedCount: number;
  unemployedCount: number;
  selfEmployedCount: number;
  postGradStudentCount: number;
  employmentRate: number;
  industryDistribution: Array<{
    industry: string;
    count: number;
    percentage: number;
  }>;
  occupationDistribution: Array<{
    occupation: string;
    count: number;
  }>;
  batchEmploymentStats: Array<{
    batch: number;
    employed: number;
    total: number;
    rate: number;
  }>;
}

export interface EngagementStats {
  totalEvents: number;
  totalAttendees: number;
  averageAttendanceRate: number;
  eventParticipation: Array<{
    eventName: string;
    attendees: number;
    interested: number;
    date: string;
  }>;
  batchEngagement: Array<{
    batch: number;
    eventsAttended: number;
    totalEvents: number;
    engagementRate: number;
  }>;
  monthlyEngagement: Array<{
    month: string;
    events: number;
    attendees: number;
  }>;
  topEngagedAlumni: Array<{
    name: string;
    eventsAttended: number;
    batch: number;
  }>;
}
