import { NextRequest, NextResponse } from "next/server";

import { cookies } from "next/headers";
import { decrypt } from "@/lib";
import {
	adminRoutes,
	alumniRoutes,
	authRoutes,
	sharedRoutes,
	superAdminRoutes,
} from "./constant";

const protectedRoutes = adminRoutes
	.concat(superAdminRoutes)
	.concat(alumniRoutes)
	.concat(sharedRoutes);

export default async function middleware(req: NextRequest) {
	// 2. Check if the current route is protected or public
	const path = req.nextUrl.pathname;
	const isAlumniRoute = alumniRoutes.includes(path);
	const isProtectedRoute = protectedRoutes.includes(path);
	const isAuthRoute = authRoutes.includes(path);
	const isSuperAdminRoute = superAdminRoutes.includes(path);
	const isAdminRoute = adminRoutes.includes(path);
	// 3. Decrypt the session from the cookie
	const cookie = (await cookies()).get("session")?.value;
	const session = await decrypt(cookie);

	if (session && !session.verified && path !== "/verify-account") {
		console.log(new Date().toISOString(), "Session not verified");
		return NextResponse.redirect(new URL("/verify-account", req.nextUrl));
	}

	// if (
	// 	session &&
	// 	session.role === "ALUMNI" &&
	// 	isAlumniRoute &&
	// 	!session.alumniId
	// ) {
	// 	return NextResponse.redirect(new URL("/set-up-account", req.nextUrl));
	// }

	// 4. Redirect to /login if the user is not authenticated
	if (isProtectedRoute && !cookie && !session) {
		return NextResponse.redirect(new URL("/login", req.nextUrl));
	}

	if (superAdminRoutes)
		if (isAuthRoute && !!session) {
			// 5. Redirect to /dashboard if the user is authenticated
			const url = session.role === "ADMIN" ? "/" : "/admin";
			return NextResponse.redirect(new URL(url, req.nextUrl));
		}

	if (
		session &&
		session.role === "ALUMNI" &&
		(isSuperAdminRoute || isAdminRoute)
	) {
		return NextResponse.redirect(new URL("/unauthorized", req.nextUrl));
	}

	if (session && session.role === "ADMIN" && isSuperAdminRoute) {
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
