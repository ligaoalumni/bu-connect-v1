import { Avatar, AvatarFallback, AvatarImage, EmptyState } from "@/components";
import { readUsers } from "@/repositories";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import React from "react";

export default async function Page({
	params,
}: {
	params: Promise<{ slug: string }>;
}) {
	const { slug } = await params;

	const users = await readUsers({ batch: Number(slug) });
	// TODO: apply pagination
	return (
		<div>
			<div className="my-6">
				<h1 className="text-2xl font-bold">List of Alumni</h1>
				<h2 className="text-lg ">Batch {slug}</h2>
			</div>
			<div className="flex flex-col gap-4">
				{users.count > 0 ? (
					users.data.map((user) => (
						<div
							key={user.id}
							className="p-4 border rounded-md bg-[#2F61A0] flex items-center gap-5">
							<div>
								<Avatar className="h-24 w-24">
									{user.avatar ? (
										<AvatarImage src={user.avatar} />
									) : (
										<AvatarFallback className="text-2xl">
											{user.firstName.charAt(0)}
											{user.lastName.charAt(0)}
										</AvatarFallback>
									)}
								</Avatar>
							</div>
							<div>
								<h2 className="text-xl font-semibold text-white">
									{user.firstName} {user.lastName}
								</h2>
								<p className="text-white">{user.course}</p>
							</div>
							<div className="ml-auto flex items-center">
								<Link href={`/batch/${slug}/alumni/${user.id}`}>
									<ArrowRight className="h-12 w-12 text-white" />
								</Link>
							</div>
						</div>
					))
				) : (
					<EmptyState
						title={`Batch ${slug} has no records of alumni`}
						description="Please check back later or contact the admin for more information."
						redirectLabel="Go back"
						redirectPath="/batch"
					/>
				)}
			</div>
		</div>
	);
}
