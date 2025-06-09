import prisma from "../configs/prisma.config";
import bcrypt from "bcryptjs";

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

export const create = async (
  firstName: string,
  lastName: string,
  email: string,
  password: string
) => {
  const passwordHash = await bcrypt.hash(password, 10);

  return prisma.user.create({
    data: {
      firstName,
      lastName,
      email,
      passwordHash,
      profile: {},
    },

    omit: {
      passwordHash: true,
    },

    include: { profile: true },
  });
};
