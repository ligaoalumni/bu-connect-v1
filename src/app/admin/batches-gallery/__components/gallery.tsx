import { Batch } from "@/types";
import { BatchCard } from "./batch-card";

interface GalleryProps {
	batches: Batch[];
}

export function Gallery({ batches }: GalleryProps) {
	return (
		<div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
			{batches.map((batch) => (
				<BatchCard key={batch.batch} batch={batch} />
			))}
		</div>
	);
}
