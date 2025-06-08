// WRITE GLOBAL TYPES HERE

import "express";
import { User as PrismaUser } from "../generated/prisma";

// extend the Express.User to have an optional id field
declare global {
  namespace Express {
    interface User extends PrismaUser {}
  }
}
