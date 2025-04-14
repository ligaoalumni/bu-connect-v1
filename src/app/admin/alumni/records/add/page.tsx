"use client";

import { useState } from "react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components";

import CSVUploader from "@/app/admin/_components/csv-uploader";
import { AlumniRecordForm } from "../../__components";

export default function StudentDataUpload() {
	const [activeTab, setActiveTab] = useState("single");

	return (
		<Tabs value={activeTab} onValueChange={setActiveTab} className="w-full  ">
			<TabsList className="grid w-full grid-cols-2">
				<TabsTrigger value="single">Single Student</TabsTrigger>
				<TabsTrigger value="batch">Batch Upload</TabsTrigger>
			</TabsList>

			<TabsContent value="single" className="max-h-fit">
				<AlumniRecordForm />
			</TabsContent>

			<TabsContent
				value="batch"
				className=" flex items-center justify-center min-h-[calc(100dvh-40dvh)] md:min-h-[400px]">
				<CSVUploader />
			</TabsContent>
		</Tabs>
	);
}
