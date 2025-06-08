import prisma from "../configs/prisma.config";

export const getMany = async (
  userId: number,
  limit: number,
  offset: number,
  direction: "asc" | "desc" = "desc",
) => {
  const blogs = await prisma.blog.findMany({
    where: { isPublished: true },
    orderBy: { createdAt: direction },
    take: limit,
    skip: offset,

    include: {
      _count: {
        select: {
          comments: true,
          likes: true,
        },
      },

      // get only the user likes and comments
      likes: {
        where: {
          id: userId,
        },
        select: {
          id: true,
        },
      },

      comments: {
        where: {
          authorId: userId,
        },
        select: {
          id: true,
        },
      },
    },
  });

  const formatedBlogs = blogs.map((blog) => {
    const { likes, comments, _count, ...rest } = blog;

    return {
      ...rest,
      count: _count,
      userInteractions: {
        like: likes.length > 0,
        comment: comments.length > 0,
      },
    };
  });

  return formatedBlogs;
};
