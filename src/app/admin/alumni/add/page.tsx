"use client";

import { useState } from "react";

import {
  LoaderComponent,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components";

import dynamic from "next/dynamic";

const CSVUploader = dynamic(
  () => import("@/app/admin/_components/csv-uploader"),
  {
    loading: LoaderComponent,
  },
);

const AlumniRecordForm = dynamic(
  () => import("../__components").then((mod) => mod.AlumniRecordForm),
  {
    loading: LoaderComponent,
  },
);

export default function StudentDataUpload() {
  const [activeTab, setActiveTab] = useState("single");

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full  ">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="single">Single Alumna/Alumnus</TabsTrigger>
        <TabsTrigger value="batch">Batch Upload</TabsTrigger>
      </TabsList>

      <TabsContent value="single" className=" ">
        <AlumniRecordForm />
      </TabsContent>

      <TabsContent
        value="batch"
        className=" flex items-center justify-center min-h-[calc(100dvh-40dvh)] md:min-h-[400px]"
      >
        <CSVUploader />
      </TabsContent>
    </Tabs>
  );
}
