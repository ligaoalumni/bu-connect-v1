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
					data ? "font-medium" : "italic text-gray-500"
				} break-words`}>
				{data || "No Data"}
			</p>
		</div>
	);
}
