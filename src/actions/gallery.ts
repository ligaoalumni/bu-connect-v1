import { readAlumniMemories } from "@/repositories";

export const readAlumniMemoriesAction = async (limit?: number) => {
  try {
    return await readAlumniMemories(limit);
  } catch (error) {
    console.log(error);
    throw new Error("Failed to fetch data");
  }
};
