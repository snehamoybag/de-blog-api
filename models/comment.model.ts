import prisma from "../configs/prisma.config";
import Comment from "../types/comment.type";

export const create = (
  authorId: number,
  blogId: number,
  parentCommentId: number | null,
  content: string
) => {
  return prisma.comment.create({
    data: {
      authorId,
      blogId,
      parentCommentId,
      content,
    },
  });
};

export const update = (id: number, content: string) => {
  return prisma.comment.update({ where: { id }, data: { content } });
};

export const deleteOne = (id: number) => {
  return prisma.comment.delete({ where: { id }, include: { replies: true } });
};

export const getOne = async (userId: number, commentId: number) => {
  const comment = await prisma.comment.findUnique({
    where: { id: commentId },
    include: {
      author: {
        omit: {
          email: true,
          passwordHash: true,
        },
      },
      _count: {
        select: { likes: true, replies: true },
      },

      // check if user liked or replied on the comment
      likes: { where: { id: userId }, select: { id: true } },
      replies: { where: { authorId: userId }, select: { id: true } },
    },
  });

  if (!comment) {
    return null;
  }

  const { likes, replies, _count, ...rest } = comment;

  const formatedComment: Comment = {
    ...rest,
    count: _count,
    userInteractions: {
      like: likes.length > 0,
      reply: replies.length > 0,
    },
  };

  return formatedComment;
};

// returns only the top level comments
export const getMany = async (
  userId: number,
  blogId: number,
  limit: number,
  offset: number,
  direction: "asc" | "desc" = "desc"
) => {
  const comments = await prisma.comment.findMany({
    where: { blogId, parentCommentId: null },

    orderBy: {
      createdAt: direction,
    },
    take: limit,
    skip: offset,

    include: {
      _count: {
        select: {
          replies: true,
          likes: true,
        },
      },

      // check if user liked or replied on any of the comment
      likes: {
        where: { id: userId },
        select: { id: true },
      },

      replies: {
        where: { authorId: userId },
        select: { id: true },
      },
    },
  });

  const formatedComments = comments.map((comment) => {
    const { likes, replies, _count, ...rest } = comment;
    const formatedComment: Comment = {
      ...rest,
      count: _count,
      userInteractions: {
        like: likes.length > 0,
        reply: replies.length > 0,
      },
    };

    return formatedComment;
  });

  return formatedComments;
};

export const getReplies = async (
  userId: number,
  commentId: number,
  limit: number,
  offset: number,
  direction: "asc" | "desc" = "desc"
) => {
  const replies = await prisma.comment.findMany({
    where: { parentCommentId: commentId },

    orderBy: { createdAt: direction },
    take: limit,
    skip: offset,

    include: {
      _count: {
        select: { likes: true, replies: true },
      },

      // check if user liked or commented on any of the reply
      likes: { where: { id: userId }, select: { id: true } },
      replies: { where: { authorId: userId }, select: { id: true } },
    },
  });

  const formatedReplies = replies.map((reply) => {
    const { _count, likes, replies, ...rest } = reply;

    const formatedReply: Comment = {
      ...rest,
      count: _count,
      userInteractions: {
        like: likes.length > 0,
        reply: replies.length > 0,
      },
    };

    return formatedReply;
  });

  return formatedReplies;
};
