import { RequestHandler } from "express";
import * as blogModel from "../models/blog.model";
import { FailureResponse, SuccessResponse } from "../lib/response-shapes";
import assertUser from "../lib/assert-user";
import assertLimitOffsetDirection from "../lib/assert-limit-offset-direction";
import * as blogValidations from "../validations/blog.validations";
import { validationResult } from "express-validator";
import { ErrorNotFound } from "../lib/http-exception-errors";

export const create: RequestHandler[] = [
  blogValidations.title(),
  blogValidations.content(),

  async (req, res) => {
    const validationErrors = validationResult(req);

    if (!validationErrors.isEmpty()) {
      res.status(400).json(
        new FailureResponse("ErrorBadRequest: Validation failed.", 400, {
          errors: validationErrors.mapped(),
        }),
      );

      return;
    }
    const user = assertUser(req);
    const { title, content } = req.body;
    const isPublished = req.query.publish === "true";

    const blog = await blogModel.create(user.id, title, content, isPublished);
    res.json(new SuccessResponse("Blog created successfully.", { blog }));
  },
];

export const getOne: RequestHandler = async (req, res) => {
  const user = assertUser(req);
  const blogId = Number(req.params.id);
  const blog = res.locals.blog || (await blogModel.getOne(user.id, blogId));

  if (!blog) {
    throw new ErrorNotFound(`No blog with the id ${blogId} is found.`);
  }

  res.json(new SuccessResponse(`Blog with the id ${blogId}`, { blog }));
};

export const getMany: RequestHandler = async (req, res) => {
  const user = assertUser(req);
  const [limit, offset, dir] = assertLimitOffsetDirection(req);

  const blogs = await blogModel.getMany(user.id, limit, offset, dir);
  res.json(new SuccessResponse("List of published blogs.", { blogs }));
};

export const update: RequestHandler[] = [
  blogValidations.title(),
  blogValidations.content(),

  async (req, res) => {
    const validationErrors = validationResult(req);

    if (!validationErrors.isEmpty()) {
      const statusCode = 400;
      res.status(statusCode).json(
        new FailureResponse("Validation failed.", statusCode, {
          errors: validationErrors.mapped(),
        }),
      );

      return;
    }

    const user = assertUser(req);
    const blogId = Number(req.params.id);

    const blog = res.locals.blog || (await blogModel.getOne(user.id, blogId));

    if (!blog) {
      throw new ErrorNotFound(`Blog with the id ${blogId} is not found.`);
    }

    const { title, content } = req.body;
    const isPublished = Boolean(req.body.isPublished);

    const updatedBlog = await blogModel.update(
      blogId,
      title,
      content,
      isPublished,
    );

    res.json(
      new SuccessResponse("Blog updated successfully.", { blog: updatedBlog }),
    );
  },
];

export const deleteOne: RequestHandler = async (req, res) => {
  const user = assertUser(req);
  const blogId = Number(req.params.id);
  const blog = res.locals.blog || (await blogModel.getOne(user.id, blogId));

  if (!blog) {
    throw new ErrorNotFound(`Blog with the id ${blogId} is not found.`);
  }

  const deletedBlog = blogModel.deleteOne(blogId);

  res.json(
    new SuccessResponse("Blog deleted successfully.", { blog: deletedBlog }),
  );
};
