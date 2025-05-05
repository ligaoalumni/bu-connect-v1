import { Iconify } from "./iconify";

export function Reactions({
	likes,
	comments,
	isLiked,
	handleLike,
	isLoading,
}: {
	likes: number;
	comments: number;
	isLiked?: boolean;
	handleLike: VoidFunction;
	isLoading?: boolean;
}) {
	return (
		<div className="flex items-center space-x-4 p-4">
			<div className="flex items-center gap-2">
				<button
					disabled={isLoading}
					className="active:scale-90 transition-transform duration-200 ease-in-out">
					<Iconify
						onClick={handleLike}
						icon="gravity-ui:thumbs-up-fill"
						width="24"
						height="24"
						style={{
							color: isLiked ? "#E8770B" : "#0D99FF",
						}}
					/>
				</button>
				{likes > 0 && <span className="leading-none">{likes}</span>}
			</div>
			<div className="flex items-center gap-2">
				<button disabled={isLoading}>
					<Iconify
						icon="fa6-solid:comment"
						width="24"
						height="24"
						className={`text-[#0D99FF]`}
					/>
				</button>
				{comments > 0 && <span className="leading-none">{comments}</span>}
			</div>
		</div>
	);
}
