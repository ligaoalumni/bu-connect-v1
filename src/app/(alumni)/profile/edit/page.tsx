import { getInformation } from "@/actions";
import dynamic from "next/dynamic";
import { LoaderComponent } from "@/components";

const EditProfileForm = dynamic(() => import("./__components/form"), {
  loading: LoaderComponent,
});

export default async function Page() {
  const user = await getInformation();

  if (!user) {
    return <div>Loading...</div>;
  }

  const data = {
    ...user,
    address:
      Array.from(user.address as any).length > 0
        ? typeof user.address === "string"
          ? JSON.parse(user.address)
          : user.address
        : undefined,
  };

  return (
    <div className="px-5 md:px-10 mt-10">
      <EditProfileForm user={data} />
    </div>
  );
}
