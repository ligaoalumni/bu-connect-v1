import { Batch } from "@/types";
import { BatchCard } from "./batch-card";
import { Dispatch, SetStateAction } from "react";

interface GalleryProps {
	batches: Batch[];
	setBatches: Dispatch<SetStateAction<Batch[]>>;
}

export function Gallery({ batches, setBatches }: GalleryProps) {
	return (
		<div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
			{batches.map((batch) => (
				<BatchCard setBatches={setBatches} key={batch.batch} batch={batch} />
			))}
		</div>
	);
}
