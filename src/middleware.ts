import { NextRequest, NextResponse } from "next/server";

import { cookies } from "next/headers";
import { decrypt } from "@/lib/session";

// 1. Specify protected and public routes
const adminRoutes = [
	"/dashboard",
	"/alumni",
	"/events",
	"/events/add-new-event",
	"/settings",
	"/account-info",
];
const superAdminRoutes = ["/admins", "/admins/add-new-admin"];
const alumniRoutes = ["/account"];
const protectedRoutes = adminRoutes
	.concat(superAdminRoutes)
	.concat(alumniRoutes);
const authRoutes = ["/login", "/signup"];

export default async function middleware(req: NextRequest) {
	// 2. Check if the current route is protected or public
	const path = req.nextUrl.pathname;
	const isAlumniRoute = alumniRoutes.includes(path);
	const isProtectedRoute = protectedRoutes.includes(path);
	const isAuthRoute = authRoutes.includes(path);
	const isAdminAndSuperAdminRoute = superAdminRoutes
		.concat(adminRoutes)
		.includes(path);
	// 3. Decrypt the session from the cookie
	const cookie = (await cookies()).get("session")?.value;
	const session = await decrypt(cookie);

	if (
		session &&
		session.role === "ALUMNI" &&
		isAlumniRoute &&
		!session.alumniId
	) {
		console.log("asdasd");
		return NextResponse.redirect(new URL("/set-up-account", req.nextUrl));
	}

	// 4. Redirect to /login if the user is not authenticated
	if (isProtectedRoute && !cookie && !session) {
		return NextResponse.redirect(new URL("/login", req.nextUrl));
	}

	// 5. Redirect to /dashboard if the user is authenticated
	if (isAuthRoute && !!session) {
		const url = session.role === "ADMIN" ? "/" : "/dashboard";
		return NextResponse.redirect(new URL(url, req.nextUrl));
	}

	if (session && session.role === "ALUMNI" && isAdminAndSuperAdminRoute) {
		return NextResponse.redirect(new URL("/unauthorized", req.nextUrl));
	}

	if (session && session.role !== "ALUMNI" && isAlumniRoute) {
		return NextResponse.redirect(new URL("/unauthorized", req.nextUrl));
	}

	return NextResponse.next();
}

// Routes Middleware should not run on
export const config = {
	matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
