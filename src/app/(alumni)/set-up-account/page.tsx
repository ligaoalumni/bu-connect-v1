import { getInformation } from "@/actions";
import { redirect, RedirectType } from "next/navigation";
import React from "react";

async function getInfo() {
	const user = await getInformation();

	if (!user) {
		redirect("/login", RedirectType.replace);
	}

	if (user.role === "ALUMNI" && user.alumni && user.alumni.id) {
		redirect("/", RedirectType.replace);
	}

	if (user && user.role !== "ALUMNI") {
		redirect("/dashboard", RedirectType.replace);
	}

	return user;
}

export default async function SetUpAccountPage() {
	await getInfo();

	return <div>SetUpAccountPage</div>;
}
