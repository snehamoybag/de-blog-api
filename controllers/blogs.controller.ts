import { RequestHandler } from "express";
import * as blogModel from "../models/blog.model";
import { SuccessResponse } from "../lib/response-shapes";

export const getMany: RequestHandler = async (req, res) => {
  const blogs = await blogModel.getMany(1, 30, 9);
  res.json(new SuccessResponse("List of published blogs.", { blogs }));
};
