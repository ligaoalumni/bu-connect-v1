import React from "react";

export default function BatchSection() {
	return (
		<section
			id="batch"
			className=" min-h-screen min-w-screen  py-10   bg-[#D0E5EE]">
			<div className="container px-5  mx-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
				<h1 className="text-xl font-medium col-span-2 md:col-span-3 lg:col-span-4">
					Batch
				</h1>
				<BatchCard />
			</div>
		</section>
	);
}

const BatchCard = () => {
	return <></>;
};
