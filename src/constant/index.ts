import { getEventStatus } from "@/lib/event";

// 1. Specify protected and public routes
export const adminRoutes = [
	"/admin",
	"/admin/alumni",
	"/admin/events",
	"/admin/events/add-new-event",
	"/admin/settings",
	"/admin/account-info",
];
export const superAdminRoutes = [
	"/admin/admins",
	"/admin/admins/add-new-admin",
];
export const alumniRoutes = ["/account"];

export const authRoutes = ["/login", "/signup"];

export const publicRoutes = alumniRoutes.concat([
	"/",
	"/all-events",
	"/past-events",
	"/ongoing-events",
]);

export const eventStatusColorMap: Record<
	ReturnType<typeof getEventStatus>,
	"default" | "destructive" | "secondary" | "outline"
> = {
	"Ongoing Event": "secondary",
	"Upcoming Event": "default",
	"Past Event": "secondary",
	"Unknown Status": "destructive",
};
