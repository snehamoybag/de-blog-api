import { getValidTopics } from "../models/topic.model";
import { Request } from "express";
import { ErrorBadRequest } from "./http-exception-errors";

const assertTopicNames = async (req: Request) => {
  const validTopics = await getValidTopics(req.body.topics);

  if (!validTopics.length) {
    throw new ErrorBadRequest("Invalid blog topics.");
  }

  return validTopics.map((topic) => topic.name);
};

export default assertTopicNames;
