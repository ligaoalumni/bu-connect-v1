import {
  getEmploymentStatistics,
  getEngagementStatistics,
} from "@/repositories/statistics";

export async function getEmploymentStatisticsAction() {
  try {
    return await getEmploymentStatistics();
  } catch (error) {
    console.error("Error reading statistics:", error);
    throw new Error("Failed to fetch statistics");
  }
}

export async function getEngagementStatisticsAction() {
  try {
    return await getEngagementStatistics();
  } catch (error) {
    console.error("Error reading statistics:", error);
    throw new Error("Failed to fetch statistics");
  }
}
