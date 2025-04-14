import { getEventStatus } from "@/lib/event";
import { User } from "@prisma/client";
export * from "./blur-data";

// 1. Specify protected and public routes
export const adminRoutes = [
	"/admin",
	"/admin/alumni",
	"/admin/alumni/records",
	"/admin/alumni/records/add",
	"/admin/events",
	"/admin/events/add-new-event",
	"/admin/settings",
	"/admin/account-info",
];

export const sharedRoutes = ["/verify-account"];

export const superAdminRoutes = ["/admin/list", "/admin/list/add-new"];
export const alumniRoutes = ["/account"];

export const authRoutes = ["/login", "/signup"];

export const publicRoutes = alumniRoutes.concat(["/", "/events"]);

export const eventStatusColorMap: Record<
	ReturnType<typeof getEventStatus>,
	"default" | "destructive" | "secondary" | "outline"
> = {
	"Ongoing Event": "secondary",
	"Upcoming Event": "default",
	"Past Event": "secondary",
	"Unknown Status": "destructive",
};

export const userStatusColorMap: Record<
	User["status"],
	"default" | "destructive" | "secondary" | "outline"
> = {
	ACTIVE: "default",
	BLOCKED: "destructive",
	PENDING: "outline",
	DELETED: "destructive",
};

export const seniorHighStrands = [
	"NA - Not Applicable",
	"ACADEMIC - ABM",
	"ACADEMIC - HUMSS",
	"ACADEMIC - STEM",
	"ACADEMIC - GAS",
	"TVL - ICT",
	"TVL - Home Economics",
	"TVL - Agri-Fishery Arts",
	"TVL - Industrial Arts",
	"SPORTS - Sports Track",
	"ARTS AND DESIGN - Arts and Design Track",
];

export const alumniLabel: Record<User["gender"], string> = {
	FEMALE: "Alumna",
	MALE: "Alumnus",
	PREFER_NOT_TO_SAY: "Alumnus",
};
