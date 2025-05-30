"use client";

import { likeAnnouncementAction, unlikeAnnouncementAction } from "@/actions";
import {
	AnnouncementCommentsSection,
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	Reactions,
	RichTextEditor,
} from "@/components";
import { useAuth, useContentData } from "@/contexts";
import { Announcement as TAnnouncement } from "@prisma/client";
import { formatDistanceToNow } from "date-fns";
import { useEffect, useState } from "react";

export default function Announcement({
	announcement,
	comments,
	likedByIds,
	likes,
}: {
	announcement: TAnnouncement;
	likes: number;
	comments: number;
	likedByIds: number[];
}) {
	const { setData, data } = useContentData();
	const { user } = useAuth();
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		if (announcement.id) {
			setData({
				comments,
				id: announcement.id,
				likes,
				isLiked: likedByIds.includes(Number(user?.id)),
			});
		}
	}, [announcement.id, user?.id]);

	const handleLike = async () => {
		try {
			setLoading(true);
			if (data?.isLiked) {
				setData({
					comments,
					id: announcement.id,
					likes: (data?.likes || likes) - 1,
					isLiked: false,
				});
				await unlikeAnnouncementAction(announcement.id, announcement.slug);
			} else {
				setData({
					comments,
					id: announcement.id,
					likes: (data?.likes || likes) + 1,
					isLiked: true,
				});
				await likeAnnouncementAction(announcement.id, announcement.slug);
			}
		} catch (error) {
			console.error("Error liking announcement:", error);
			if (data?.isLiked) {
				setData({
					comments,
					id: announcement.id,
					likes: (data?.likes || likes) - 1,
					isLiked: false,
				});
			} else {
				setData({
					comments,
					id: announcement.id,
					likes: (data?.likes || likes) + 1,
					isLiked: true,
				});
			}
		} finally {
			setLoading(false);
		}
	};

	return (
		<div>
			<Card className="overflow-hidden bg-transparent shadow-none border-none hover:shadow-sm transition-shadow duration-300 ease-in-out">
				<CardHeader>
					<div className="flex items-center space-x-4 p-4">
						<div>
							<h2 className="text-lg font-semibold">{announcement.title}</h2>
							<p className="text-sm text-muted-foreground">
								{formatDistanceToNow(new Date(announcement.createdAt))} ago
							</p>
						</div>
					</div>
				</CardHeader>
				<CardContent className=" ">
					<RichTextEditor content={announcement.content} />
				</CardContent>
				<CardFooter>
					<Reactions
						isLoading={loading}
						handleLike={handleLike}
						comments={data?.comments || comments}
						likes={data?.likes || likes}
						isLiked={data?.isLiked || likedByIds.includes(Number(user?.id))}
					/>
				</CardFooter>
			</Card>
			<div className="space-y-4 mt-4">
				<AnnouncementCommentsSection announcementId={announcement.id} />
			</div>
		</div>
	);
}
