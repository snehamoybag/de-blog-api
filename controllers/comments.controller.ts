import { RequestHandler } from "express";
import * as commentModel from "../models/comment.model";
import assertUser from "../lib/assert-user";
import { getOne as getBlogById } from "../models/blog.model";
import { ErrorNotFound } from "../lib/http-exception-errors";
import assertLimitOffsetDirection from "../lib/assert-limit-offset-direction";
import { SuccessResponse } from "../lib/response-shapes";

export const getMany: RequestHandler = async (req, res) => {
  const user = assertUser(req);
  const blogId = Number(req.params.id);

  const blog = res.locals.blog || (await getBlogById(user.id, blogId));

  if (!blog) {
    throw new ErrorNotFound(`Blog with the id ${blogId} is not found.`);
  }

  const [limit, offset, direction] = assertLimitOffsetDirection(req);

  const comments = await commentModel.getMany(
    user.id,
    blogId,
    limit,
    offset,
    direction
  );

  res.json(new SuccessResponse("List of comments on the blog.", { comments }));
};
