import { body } from "express-validator";
import { getByEmail as getUserByEmail } from "../models/user.model";

const validateName = (field: string) => {
  return body(field)
    .isString()
    .withMessage("Name must be of type string.")
    .trim()
    .isAlpha()
    .withMessage("Name must only contain alphabetic characters.")
    .isLength({ min: 1, max: 35 })
    .withMessage("Name must be between 1 and 35 characters.");
};

export const validateFirstName = () => validateName("firstName");
export const validateLastName = () => validateName("lastName");

export const validateNewEmail = () => {
  return body("email")
    .isString()
    .withMessage("Email address must be of type string.")
    .trim()
    .isEmail()
    .withMessage("Unsupported email address.")
    .custom(async (email) => {
      const user = await getUserByEmail(email);

      if (user) {
        throw new Error("Email already in use.");
      }

      return true;
    });
};

export const validatePassword = () => {
  return body("password")
    .isString()
    .withMessage("Password is must be of type stirng.")
    .isLength({ min: 8, max: 32 })
    .withMessage("Password must be between 8 and 32 characters.");
};

export const validateConfirmedPassword = () => {
  return body("confirmedPassword")
    .isString()
    .withMessage("Password muset be of type string.")
    .custom((confirmedPassword, { req }) => {
      const password = req.body.password;
      if (!password) {
        throw new Error("Password is required.");
      }

      if (password !== confirmedPassword) {
        throw new Error("Passowrds do not match.");
      }

      return true;
    });
};
