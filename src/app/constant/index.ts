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

export const publicRoutes = alumniRoutes.concat(["/"]);
