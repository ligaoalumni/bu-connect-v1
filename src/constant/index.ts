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

export const superAdminRoutes = [
	"/admin/admins",
	"/admin/admins/add-new-admin",
];
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
