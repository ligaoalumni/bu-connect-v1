import { readBatchesAction } from "@/actions";
import { BatchCard } from "./__components/batch-card";

export default async function Page() {
  const batches = await readBatchesAction();

  return (
    <div className="">
      <section className="bg-[#15497A] py-16 flex flex-col justify-center items-start px-5 md:px-10">
        <h1 className="text-2xl md:text-3xl font-bold   text-[#FFA629]">
          Alumni, Batches!
        </h1>
        <p className="   tracking-wider  text-white md:max-w-[70%]  text-lg ">
          Relive memories and reconnect with your batchmates through our gallery
          of <br className="md:block hidden" /> alumni years.
        </p>
      </section>
      <section className=" px-5 md:px-10 space-y-5 py-10">
        {batches.data.map((batch) => {
          return <BatchCard key={batch.batch} {...batch} />;
        })}
      </section>
    </div>
  );
}
