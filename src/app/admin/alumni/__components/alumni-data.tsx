export function AlumniData({
	data,
	label,
	useDefaultColors,
}: {
	data?: string | null;
	label: string;
	useDefaultColors?: boolean;
}) {
	return (
		<div>
			<p className="text-sm">{label}</p>
			<p
				className={`${
					data
						? "font-medium"
						: !useDefaultColors && "italic text-white/70 dark:text-white/70"
				} break-words`}>
				{data || "No Data"}
			</p>
		</div>
	);
}
