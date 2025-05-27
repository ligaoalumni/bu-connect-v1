import { formatDistanceToNow } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Skeleton } from "../ui/skeleton";
import { ShareableComment } from "@/types";

export const CommentSkeleton = () => {
	return (
		<div className="p-3">
			<div className="flex items-center gap-3 mb-2">
				<Skeleton className="h-10 w-10 rounded-full" />
				<div className="space-y-2">
					<Skeleton className="h-4 w-32" />
					<Skeleton className="h-3 w-24" />
				</div>
			</div>
			<Skeleton className="h-4 w-full max-w-md ml-12" />
			<Skeleton className="h-4 w-full max-w-sm ml-12 mt-1" />
		</div>
	);
};

export const CommentCard = (comment: ShareableComment) => {
	return (
		<div className="group hover:bg-gray-50 p-3 rounded-md transition-colors">
			<div className="flex items-center gap-3 mb-2">
				<Avatar className="border">
					{comment.avatar ? (
						<AvatarImage src={comment.avatar || ""} alt={comment.name} />
					) : (
						<AvatarFallback className="bg-primary/10 text-primary">
							{comment.name.charAt(0)}
						</AvatarFallback>
					)}
				</Avatar>
				<div>
					<h3 className="font-medium group-hover:text-primary transition-colors">
						{comment.name}
					</h3>
					<p className="text-xs text-muted-foreground flex items-center gap-2">
						<span>{comment.batch}</span>
						<span className="inline-block h-1 w-1 rounded-full bg-gray-300"></span>
						<span>
							{formatDistanceToNow(new Date(comment.timestamp), {
								addSuffix: true,
							})}
						</span>
					</p>
				</div>
			</div>
			<p className="text-sm pl-12">{comment.comment}</p>
		</div>
	);
};
