import VerifyAccountDataTable from "../../__components/verify-account-table";

export default function VerifyOldAlumniAccountPage() {
  return (
    <>
      <div className="w-full  ">
        <h1 className="text-xl font-medium">Verify Old Alumni Account</h1>
        <p className="text-muted-foreground mt-2">
          Account verification system
        </p>
      </div>
      <VerifyAccountDataTable />
    </>
  );
}
