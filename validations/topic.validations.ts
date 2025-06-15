import { body } from "express-validator";

export const topics = () => {
  return body("topics")
    .isArray()
    .withMessage("Blog topics must be an array.")
    .custom((topics) => {
      if (topics.length < 1) {
        throw new Error("Blog must have atleast one topic.");
      }

      const isStringArr = topics.every(
        (name: unknown) => typeof name === "string"
      );

      if (!isStringArr) {
        throw new Error("Each blog topic muset be a string.");
      }

      return true;
    });
};
