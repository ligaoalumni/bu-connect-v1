import { readAlumniAction } from "@/actions";
import { Card, CardContent } from "@/components";
import ViewQRCodeDetail from "@/components/custom/view-qrcode-detail";
import { Users } from "lucide-react";

export default async function QRDetails({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  if (!slug || (slug && isNaN(parseInt(slug)))) {
    return <h1>Not found!</h1>;
  }

  const alumni = await readAlumniAction(Number(slug));

  if (!alumni)
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center justify-center p-8 text-center">
            <div className="mb-6 p-4 rounded-full bg-muted">
              <Users className="h-12 w-12 text-muted-foreground" />
            </div>

            <h2 className="text-xl font-semibold text-foreground mb-2">
              No Alumni Record Found
            </h2>

            <p className="text-muted-foreground mb-6 text-balance">
              There are currently no alumni records in the system. Records will
              appear here once they are added.
            </p>
          </CardContent>
        </Card>
      </div>
    );

  return (
    <ViewQRCodeDetail
      alumni={{
        batch: alumni.batch,
        course: alumni.course,
        email: alumni.email,
        firstName: alumni.firstName,
        lastName: alumni.lastName,
        studentId: alumni.studentId,
        middleName: alumni.middleName || "",
        company: alumni.company || "",
        currentOccupation: alumni.currentOccupation || "",
        industry: alumni.industry || "",
        isOldAccount: alumni.isOldAccount,
        jobTitle: alumni.jobTitle || "",
        postStudyUniversity: alumni.postStudyUniversity || "",
        years: alumni.years || 0,
      }}
    />
  );
}
