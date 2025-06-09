import prisma from "../configs/prisma.config";

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

      // select user likes and comments
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

    return {
      ...rest,
      count: _count,
      userInteractions: {
        like: likes.length > 0,
        reply: replies.length > 0,
      },
    };
  });

  return formatedComments;
};
