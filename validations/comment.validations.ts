import { body } from "express-validator";

export const content = () => {
  return body("content")
    .isString()
    .withMessage("Comment content must be of type string")
    .trim()
    .withMessage("Comment can not be empty.");
};
