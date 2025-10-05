import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { readLoginLogsAction, readSettingsAction } from "@/actions";
import dynamic from "next/dynamic";
import { LoaderComponent } from "@/components";

const LoginAttempts = dynamic(() => import("./__components/login-attemps"), {
  loading: LoaderComponent,
});

const GeneralSettings = dynamic(() => import("./__components/general"), {
  loading: LoaderComponent,
});

export default async function AdminSettingsPage() {
  const loginLogs = await readLoginLogsAction({
    pagination: {
      limit: 10,
      page: 0,
    },
  });

  const data = await readSettingsAction();

  return (
    <div className="container mx-auto py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">
          Administrator Settings
        </h1>
        <p className="text-muted-foreground mt-2">
          Manage system settings and monitor login activity.
        </p>
      </div>

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="general">General Settings</TabsTrigger>
          <TabsTrigger value="login">Login Attempts</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4">
          <GeneralSettings
            data={{
              description: data?.description || "",
              isMaintenance: data?.isMaintenance || false,
              websiteName: data?.websiteName || "",
            }}
          />
        </TabsContent>

        <TabsContent value="login" className="space-y-4">
          <LoginAttempts logs={loginLogs.data} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
