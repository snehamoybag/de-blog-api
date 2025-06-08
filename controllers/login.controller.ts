import { RequestHandler } from "express";
import { ErrorUnauthorised } from "../lib/http-exception-errors";
import { SuccessResponse } from "../lib/response-shapes";
import assertUser from "../lib/assert-user";

export const handleSuccess: RequestHandler = (req, res) => {
  const token = res.locals.jwtToken;
  const user = assertUser(req);

  if (!token) {
    throw new ErrorUnauthorised("Login failed.");
  }

  res.json(new SuccessResponse("Login Successful.", { user, token }));
};
