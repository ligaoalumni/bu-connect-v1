"use client";

import { useEffect, useState } from "react";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
	Button,
	RadioGroup,
	RadioGroupItem,
} from "@/components";
import { Label } from "@/components/ui/label";
import { Check, Loader2 } from "lucide-react";
import { Poll } from "@/types";
import { useAuth } from "@/contexts";
import { voteAction } from "@/actions";

export function PollCard({ defaultPoll }: { defaultPoll: Poll }) {
	const { user } = useAuth();
	const userId = Number(user?.id);
	const [poll, setPoll] = useState<Poll>(defaultPoll);

	const [selectedOption, setSelectedOption] = useState<number | null>(null);
	const [hasVoted, setHasVoted] = useState<boolean>(false);

	const [loading, setLoading] = useState<boolean>(false);

	const handleVote = async () => {
		if (selectedOption === null) return;
		// Create a copy of the poll to update
		const updatedPoll = { ...poll };
		// Find the selected option and add the vote
		const optionIndex = updatedPoll.options.findIndex(
			(opt) => opt.id === selectedOption
		);
		if (optionIndex !== -1) {
			try {
				setLoading(true);
				// Add the vote
				updatedPoll.options[optionIndex].votes.push({
					// optionId: selectedOption,
					userId: userId,
				});
				setPoll(updatedPoll);
				setHasVoted(true);
				await voteAction(selectedOption);
			} catch (error) {
				setPoll(defaultPoll);
				console.error("Error casting vote:", error);
			} finally {
				setLoading(false);
			}
		}
	};

	const getTotalVotes = () => {
		return poll.options.reduce(
			(total, option) => total + option.votes.length,
			0
		);
	};

	const getPercentage = (votes: number) => {
		const total = getTotalVotes();
		if (total === 0) return 0;
		return Math.round((votes / total) * 100);
	};

	useEffect(() => {
		// Check if the user's ID exists in any of the votes
		for (const option of poll.options) {
			const hasVotedForOption = option.votes.some(
				(vote) => vote.userId === userId
			);
			if (hasVotedForOption) {
				setHasVoted(true);
				setSelectedOption(option.id);
				break;
			}
		}
	}, [poll.options, userId]);

	return (
		<Card className="w-full  ">
			<CardHeader>
				<CardTitle className="text-2xl">{poll.question}</CardTitle>
				{/* <CardDescription>{poll.}</CardDescription> */}
			</CardHeader>
			<CardContent>
				{!hasVoted ? (
					<RadioGroup
						disabled={loading}
						value={selectedOption?.toString()}
						onValueChange={(value) =>
							setSelectedOption(Number.parseInt(value))
						}>
						<div className="space-y-4">
							{poll.options.map((option) => (
								<div
									key={option.id}
									className="flex items-center space-x-2 rounded-lg border p-4 transition-colors hover:bg-gray-100">
									<RadioGroupItem
										value={option.id.toString()}
										id={`option-${option.id}`}
									/>
									<Label
										htmlFor={`option-${option.id}`}
										className="flex-1 cursor-pointer font-medium">
										{option.content}
									</Label>
								</div>
							))}
						</div>
					</RadioGroup>
				) : (
					<div className="space-y-4">
						{poll.options.map((option) => {
							const voteCount = option.votes.length;
							const percentage = getPercentage(voteCount);
							const isSelected = option.id === selectedOption;

							return (
								<div key={option.id} className="space-y-2">
									<div className="flex items-center justify-between">
										<div className="flex items-center gap-2">
											{isSelected && (
												<div className="flex h-5 w-5 items-center justify-center rounded-full bg-green-500 text-white">
													<Check className="h-3 w-3" />
												</div>
											)}
											<span
												className={`font-medium ${
													isSelected ? "text-green-600" : ""
												}`}>
												{option.content}
											</span>
										</div>
										<span className="text-sm text-gray-500">
											{voteCount} {voteCount === 1 ? "vote" : "votes"} (
											{percentage}%)
										</span>
									</div>
									<div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
										<div
											className={`h-full rounded-full ${
												isSelected ? "bg-green-500" : "bg-blue-500"
											}`}
											style={{ width: `${percentage}%` }}
										/>
									</div>
								</div>
							);
						})}
						<div className="mt-4 text-center text-sm text-gray-500">
							Total votes: {getTotalVotes()}
						</div>
					</div>
				)}
			</CardContent>
			<CardFooter className="flex justify-between">
				{!hasVoted ? (
					selectedOption && (
						<Button
							onClick={handleVote}
							disabled={selectedOption === null || loading}
							className="w-full">
							{loading ? <Loader2 className="animate-spin" /> : "Cast Vote"}
						</Button>
					)
				) : (
					<div className="flex w-full items-center justify-center gap-2 rounded-lg bg-green-50 p-2 text-green-600">
						<Check className="h-5 w-5" />
						<span>You have already voted</span>
					</div>
				)}
			</CardFooter>
		</Card>
	);
}
