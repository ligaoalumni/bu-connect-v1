export function AlumniData({
	data,
	label,
}: {
	data?: string | null;
	label: string;
}) {
	return (
		<div>
			<p className="text-sm">{label}</p>
			<p
				className={`${
					data ? "font-medium" : "italic text-white/70 dark:text-white/70"
				} break-words`}>
				{data || "No Data"}
			</p>
		</div>
	);
}
