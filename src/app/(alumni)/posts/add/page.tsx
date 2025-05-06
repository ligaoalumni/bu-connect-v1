import { Card, CardContent, CardHeader, CardTitle } from "@/components";
import React from "react";
import { PostForm } from "../__components/post-form";

export default function Page() {
	return (
		<div className="container mx-auto py-10">
			<Card>
				<CardHeader>
					<CardTitle>Create Post</CardTitle>
				</CardHeader>
				<CardContent>
					<PostForm />
				</CardContent>
			</Card>
		</div>
	);
}
