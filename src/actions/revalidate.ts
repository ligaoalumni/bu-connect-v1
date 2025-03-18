"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export const revalidatePathAction = async (
	path: string,
	redirectPath?: string
) => {
	revalidatePath(path);
	if (redirectPath) {
		redirect(redirectPath);
	}
};
