import { readBatchesAction } from "@/actions";
import { BatchCard } from "./__components/batch-card";

export default async function Page() {
	const batches = await readBatchesAction();

	return (
		<div>
			<section>
				<h1 className="text-2xl md:text-3xl font-bold text-center ">
					Alumni Community
				</h1>
				<p className="font-tangerine  tracking-wider text-2xl md:text-3xl  text-center">
					&quot;The past brought us together, the future keep us <br />
					connected&quot;
				</p>
			</section>
			<section>
				{batches.data.map((batch) => {
					return <BatchCard key={batch.batch} {...batch} />;
				})}
			</section>
		</div>
	);
}
