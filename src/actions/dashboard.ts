"use server";
import { readDashboardOverview } from "@/repositories";

export const dashboardOverviewAction = async () => {
	try {
		return await readDashboardOverview();
	} catch (err) {
		console.log(err);
		throw new Error("Failed to fetch overview");
	}
};
