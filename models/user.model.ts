import prisma from "../configs/prisma.config";

export const getById = (id: number) => {
  return prisma.user.findUnique({
    where: { id },
  });
};

export const getByEmail = (email: string) => {
  return prisma.user.findUnique({
    where: { email },
  });
};
