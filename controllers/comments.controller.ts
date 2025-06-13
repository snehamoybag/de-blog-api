import { RequestHandler } from "express";
import * as commentModel from "../models/comment.model";
import assertUser from "../lib/assert-user";
import { ErrorForbidden, ErrorNotFound } from "../lib/http-exception-errors";
import assertLimitOffsetDirection from "../lib/assert-limit-offset-direction";
import { FailureResponse, SuccessResponse } from "../lib/response-shapes";
import * as commentValidations from "../validations/comment.validations";
import { validationResult } from "express-validator";

// creates comment or reply
export const create: RequestHandler[] = [
  commentValidations.content(),
  async (req, res) => {
    const validationErrors = validationResult(req);

    if (!validationErrors.isEmpty()) {
      const statusCode = 400;
      res.status(statusCode).json(
        new FailureResponse("Validations failed.", statusCode, {
          errors: validationErrors.mapped(),
        })
      );

      return;
    }

    const user = assertUser(req);
    // blog id has to be correct since we have a middleware that checks for it in the routes
    const blogId = Number(req.params.blogId);

    const content = String(req.body.content);
    const commentParamId = req.params.commentId;

    // create a direct blog comment
    if (commentParamId === undefined) {
      const comment = await commentModel.create(user.id, blogId, null, content);
      res.json(
        new SuccessResponse("Comment created succesfully.", { comment })
      );
      return;
    }

    // create reply
    const parentCommentId = Number(commentParamId);
    const parentComment = commentModel.getOne(user.id, parentCommentId);

    if (!parentComment) {
      throw new ErrorNotFound(
        `Comment with the id ${parentCommentId} not found.`
      );
    }

    const reply = await commentModel.create(
      user.id,
      blogId,
      parentCommentId,
      content
    );

    res.json(
      new SuccessResponse("Comment created successful", { comment: reply })
    );
  },
];

export const update: RequestHandler[] = [
  commentValidations.content(),
  async (req, res) => {
    const validationErrors = validationResult(req);

    if (!validationErrors.isEmpty()) {
      const statusCode = 400;
      res.status(statusCode).json(
        new FailureResponse("Validations failed.", statusCode, {
          errors: validationErrors.mapped(),
        })
      );

      return;
    }

    const user = assertUser(req);
    const commentId = Number(req.params.commentId);
    const comment = await commentModel.getOne(user.id, commentId);

    if (!comment) {
      throw new ErrorNotFound(`Comment with the id ${commentId} not found.`);
    }

    if (comment.authorId !== user.id) {
      throw new ErrorForbidden("Only the author of the comment can update.");
    }

    const updatedComment = await commentModel.update(
      commentId,
      String(req.body.content)
    );

    res.json(
      new SuccessResponse("Comment updated successfully.", {
        comment: updatedComment,
      })
    );
  },
];

export const deleteOne: RequestHandler = async (req, res) => {
  const user = assertUser(req);
  const commentId = Number(req.params.commentId);
  const comment = await commentModel.getOne(user.id, commentId);

  if (!comment) {
    throw new ErrorNotFound(`Comment with the id ${commentId} not found.`);
  }

  if (
    comment.authorId !== user.id &&
    user.role !== "ADMIN" &&
    user.role !== "MODERATOR"
  ) {
    throw new ErrorForbidden(
      "Only the author or a admin/moderator can delete a comment."
    );
  }

  const deletedComment = await commentModel.deleteOne(commentId);

  res.json(
    new SuccessResponse("Comment deleted successfully.", {
      comment: deletedComment,
    })
  );
};

export const getOne: RequestHandler = async (req, res) => {
  const user = assertUser(req);
  const commentId = Number(req.params.id);
  const comment = await commentModel.getOne(user.id, commentId);

  if (!comment) {
    throw new ErrorNotFound(`Comment with the id ${commentId} not found.`);
  }

  res.json(
    new SuccessResponse(`Comment with the id ${commentId}.`, { comment })
  );
};

export const getComments: RequestHandler = async (req, res) => {
  const user = assertUser(req);
  const blogId = Number(req.params.blogId);

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

export const getReplies: RequestHandler = async (req, res) => {
  const user = assertUser(req);
  const parentCommentId = Number(req.params.commentId);
  const parentComment = await commentModel.getOne(user.id, parentCommentId);

  if (!parentComment) {
    throw new ErrorNotFound(
      `Comment with the id ${parentCommentId} not found.`
    );
  }

  const [limit, offset, direction] = assertLimitOffsetDirection(req);

  const replies = await commentModel.getReplies(
    user.id,
    parentCommentId,
    limit,
    offset,
    direction
  );

  res.json(new SuccessResponse("List of replies on the comment.", { replies }));
};
