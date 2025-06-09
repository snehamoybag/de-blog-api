import { RequestHandler } from "express";
import {
  validateConfirmedPassword,
  validateFirstName,
  validateLastName,
  validateNewEmail,
  validatePassword,
} from "../validations/user.validations";
import { validationResult } from "express-validator";
import { FailureResponse, SuccessResponse } from "../lib/response-shapes";
import { create as createUser } from "../models/user.model";

export const handleSignup: RequestHandler[] = [
  validateFirstName(),
  validateLastName(),
  validateNewEmail(),
  validatePassword(),
  validateConfirmedPassword(),

  async (req, res) => {
    const validationErrors = validationResult(req);

    if (!validationErrors.isEmpty()) {
      const statusCode = 400;
      res.status(statusCode).json(
        new FailureResponse("ErrorBadRequest:Validation failed.", statusCode, {
          errors: validationErrors.mapped(),
        })
      );

      return;
    }

    const { firstName, lastName, email, password } = req.body;

    const user = await createUser(firstName, lastName, email, password);

    res.json(new SuccessResponse("Signup successful.", { user }));
  },
];
