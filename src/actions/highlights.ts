import { readHighlights } from "@/repositories";
import { Pagination } from "@/types";

export const readHighlightsAction = async (args: {
  pagination?: Pagination;
}) => {
  try {
    return await readHighlights(args);
  } catch (error) {
    console.log(error);
    throw new Error("Failed to fetch data");
  }
};
