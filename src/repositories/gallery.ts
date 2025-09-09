import { prisma } from "@/lib";

export const readAlumniMemories = async (limit?: number) => {
  const batches = await prisma.batch.findMany({
    where: {
      images: {
        isEmpty: false,
      },
    },
    select: {
      images: true,
    },
  });

  // Flatten all images into one array
  const allImages = batches.flatMap((batch) => batch.images);

  // Apply limit if provided
  if (limit !== undefined) {
    return allImages.slice(0, limit);
  }

  return allImages;
};
