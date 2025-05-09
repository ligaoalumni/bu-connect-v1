"use client";

import { ChangeEvent, useRef, useState } from "react";
import {
	Avatar,
	AvatarFallback,
	AvatarImage,
	Button,
	Textarea,
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components";
import { Loader2, Send, Smile } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import dynamic from "next/dynamic";

// Dynamically import EmojiPicker to avoid SSR issues
const EmojiPicker = dynamic(() => import("emoji-picker-react"), { ssr: false });

interface CommentBoxProps {
	onSubmit: (comment: string) => void;
}

export default function CommentBox({ onSubmit }: CommentBoxProps) {
	const { user } = useAuth();
	const [comment, setComment] = useState("");
	const [loading, setLoading] = useState(false);
	const [isFocused, setIsFocused] = useState(false);
	const textareaRef = useRef<HTMLTextAreaElement>(null);

	const handleSubmit = async () => {
		if (comment.trim()) {
			// TODO: Add comment submission logic here
			try {
				setLoading(true);
				await onSubmit(comment.trim());
				setComment("");
				setIsFocused(false);
			} catch (error) {
				console.log(error);
			} finally {
				setLoading(false);
			}
		}
	};

	const handleEmojiSelect = (emojiData: any) => {
		const emoji = emojiData.emoji;
		const textarea = textareaRef.current;

		if (textarea) {
			const start = textarea.selectionStart || 0;
			const end = textarea.selectionEnd || 0;

			// Insert emoji at cursor position
			const newComment =
				comment.substring(0, start) + emoji + comment.substring(end);

			setComment(newComment);

			// Focus back on textarea and set cursor position after the inserted emoji
			setTimeout(() => {
				textarea.focus();
				const newCursorPos = start + emoji.length;
				textarea.setSelectionRange(newCursorPos, newCursorPos);
			}, 10);
		} else {
			// If no cursor position, just append to the end
			setComment((prev) => prev + emoji);
		}
	};

	return (
		<div className="w-full ">
			<div className="flex items-start gap-3">
				<Avatar className="border mt-1">
					{user?.avatar ? (
						<AvatarImage
							src={user.avatar || ""}
							alt={`${user.firstName} profile picture`}
						/>
					) : (
						<AvatarFallback className="bg-primary/10 text-primary">
							{user?.firstName.charAt(0)}
							{user?.lastName.charAt(0)}
						</AvatarFallback>
					)}
				</Avatar>
				<div className="flex-1">
					<div
						className={`border rounded-lg transition-all ${
							isFocused ? "border-primary shadow-sm" : "border-input"
						}`}>
						<Textarea
							readOnly={loading}
							placeholder="Write a comment..."
							className="min-h-24 border-0 focus-visible:ring-0 focus-visible:ring-offset-0 resize-none"
							value={comment}
							onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
								setComment(e.target.value)
							}
							onFocus={() => setIsFocused(true)}
							onBlur={() => setIsFocused(false)}
						/>
						<div className="flex items-center justify-between p-2 border-t bg-muted/30">
							<Popover>
								<PopoverTrigger asChild disabled={loading}>
									<Button
										variant="ghost"
										size="icon"
										className="h-8 w-8 rounded-full">
										<Smile className="h-4 w-4" />
										<span className="sr-only">Add emoji</span>
									</Button>
								</PopoverTrigger>
								<PopoverContent
									className="w-full p-0 border"
									side="top"
									align="start">
									<EmojiPicker
										onEmojiClick={handleEmojiSelect}
										width="100%"
										height={350}
									/>
								</PopoverContent>
							</Popover>
							<div className="flex items-center gap-2">
								<Button
									size="sm"
									onClick={handleSubmit}
									disabled={!comment.trim() || loading}
									className="gap-1">
									{loading ? (
										<>
											<Loader2 className="h-3.5 w-3.5 animate-spin " />
											<span>posting comment...</span>
										</>
									) : (
										<>
											<Send className="h-3.5 w-3.5" />
											<span>Comment</span>
										</>
									)}
								</Button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
