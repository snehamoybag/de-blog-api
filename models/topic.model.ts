import prisma from "../configs/prisma.config";

export const getValidTopics = (topics: string[]) => {
  return prisma.topic.findMany({
    where: {
      name: {
        in: topics,
      },
    },
  });
};
