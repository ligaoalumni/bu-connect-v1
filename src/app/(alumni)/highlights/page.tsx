import { readPollsAction } from "@/actions";
import { EmptyState } from "@/components";
import React from "react";
import { PollCard } from "./__components/poll-card";

export default async function Page() {
	const polls = await readPollsAction({
		status: ["OPEN"],
	});

	return (
		<div className="container mx-auto">
			<h1 className="text-2xl font-medium">Polls</h1>
			<div className="space-y-4 mt-5">
				{polls.data.length > 0 ? (
					polls.data.map((poll) => (
						<PollCard defaultPoll={poll} key={poll.id} />
					))
				) : (
					<EmptyState
						title="No polls available"
						description="Currently, there are no polls available. Please check back later."
						showRedirectButton={false}
					/>
				)}
			</div>
		</div>
	);
}
