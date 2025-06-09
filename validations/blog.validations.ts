import { body } from "express-validator";

export const title = () => {
  return body("title")
    .isString()
    .withMessage("Blog title must be of type string.")
    .trim()
    .isLength({ min: 5, max: 120 })
    .withMessage("Blog title must be between 5 and 120 characters.");
};

export const content = () => {
  return body("content")
    .isString()
    .withMessage("Blog content must be of type string.")
    .trim()
    .isLength({ min: 20 })
    .withMessage("Blog content must be atleast 20 characters.");
};
