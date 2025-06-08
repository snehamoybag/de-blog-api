import { RequestHandler } from "express";
import { getByEmail as getUserByEmail } from "../../models/user.model";
import { ErrorBadRequest } from "../../lib/http-exception-errors";
import bcrypt from "bcryptjs";

const authenticateUser: RequestHandler = async (req, res, next) => {
  const { email, password } = req.body;

  if (typeof email !== "string") {
    throw new ErrorBadRequest("Email address is required.");
  }

  if (typeof password !== "string") {
    throw new ErrorBadRequest("Password is required.");
  }

  const user = await getUserByEmail(email);

  if (!user) {
    throw new ErrorBadRequest("Email address not registered.");
  }

  const isPasswordMatching = await bcrypt.compare(password, user.passwordHash);

  if (!isPasswordMatching) {
    throw new ErrorBadRequest("Incorrect password.");
  }

  // set user in res.user
  req.user = user;

  next();
};

export default authenticateUser;
