import { notFound } from "next/navigation";
import { getInformation, readBatchAction } from "@/actions";
import BatchGallery from "./__components/gallery";

export default async function BatchGalleryPage({
	params,
}: {
	params: Promise<{ slug: string }>;
}) {
	const { slug } = await params;
	const user = await getInformation();
	if (!slug || isNaN(Number(slug))) return notFound();

	const batch = await readBatchAction(Number(slug));

	if (!batch) return notFound();

	return <BatchGallery userBatch={user?.batch || -1} batch={batch} />;
}
