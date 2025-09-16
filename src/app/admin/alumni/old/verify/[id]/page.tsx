import { readUserAction } from "@/actions";
import { UserInfoDisplay } from "./__components/user-info-display";

// Example system record status - replace with your actual logic
const systemRecordStatus: "found" | "not-found" | "already-connected" = "found";

export default async function VerifyAccountPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  if (id && isNaN(parseInt(id))) return <h1>Invalid ID</h1>;

  const alumni = await readUserAction(Number(id));

  if (!alumni) return <h1>Alumni not found</h1>;

  return (
    <div className="container mx-auto     ">
      <UserInfoDisplay
        userInfo={{
          batch: alumni.batch || 0,
          birthDay: alumni.birthDate,
          firstName: alumni.firstName,
          id: alumni.id,
          lastName: alumni.lastName,
          middleName: alumni.middleName || "",
          program: alumni.course || "",
        }}
        systemRecordStatus={systemRecordStatus}
      />
    </div>
  );
}
