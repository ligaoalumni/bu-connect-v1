import CSVUploader from "@/app/admin/_components/csv-uploader";
import { OldAlumniForm } from "../../__components";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components";

const AddOldAlumniPage = () => {
  return (
    <Tabs defaultValue="single" className="w-full lg:max-w-screen-md mx-auto ">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="single">Single Alumna/Alumnus</TabsTrigger>
        <TabsTrigger value="batch">Batch Upload</TabsTrigger>
      </TabsList>

      <TabsContent value="single" className=" ">
        <OldAlumniForm />
      </TabsContent>

      <TabsContent
        value="batch"
        className=" flex items-center justify-center min-h-[calc(100dvh-40dvh)] md:min-h-[400px]"
      >
        <CSVUploader isOldAlumni />
      </TabsContent>
    </Tabs>
  );
};

export default AddOldAlumniPage;
