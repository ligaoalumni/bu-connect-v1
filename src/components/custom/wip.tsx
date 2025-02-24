import React from "react";
import { HardHat, Construction } from "lucide-react";

export const WIPBanner = () => {
	return (
		<div className="flex flex-col items-center justify-center min-h-[50vh] bg-blue-50 p-8 border-t-4 border-blue-500 shadow-lg">
			<div className="flex items-center gap-4 mb-6 relative">
				<div className="absolute -top-8 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-blue-200 rounded-full" />
				<HardHat className="w-12 h-12 text-blue-600 transform hover:rotate-12 transition-transform duration-300" />
				<Construction className="w-12 h-12 text-blue-600 transform hover:-rotate-12 transition-transform duration-300" />
			</div>

			<h1 className="text-4xl font-bold text-blue-800 mb-4 tracking-tight">
				Under Construction
			</h1>

			<div className="text-center max-w-lg bg-white p-6 rounded-lg shadow-md border border-blue-100">
				<p className="text-blue-700 text-lg mb-4 leading-relaxed">
					We&apos;re working hard to bring you something amazing. This page is
					currently a work in progress.
				</p>
				<p className="text-blue-600 font-medium">
					Please check back soon for updates!
				</p>
			</div>

			<div className="mt-8 flex gap-2">
				<div className="w-2 h-2 bg-blue-300 rounded-full" />
				<div className="w-2 h-2 bg-blue-400 rounded-full" />
				<div className="w-2 h-2 bg-blue-500 rounded-full" />
			</div>
		</div>
	);
};
