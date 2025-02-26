import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
	const cookieStore = cookies();
	const json = await req.json();

	console.log(json);

	// // Set a cookie
	// cookieStore.set("myCookie", "cookieValue", {
	// 	httpOnly: true, // Secure flag for cookies
	// 	path: "/", // Make it accessible throughout the app
	// 	maxAge: 60 * 60 * 24 * 7, // 1 week expiration
	// 	sameSite: "Strict", // Secure cookie policy
	// });

	return NextResponse.json({ message: "Cookie set successfully" });
};
