import prisma from "../configs/prisma.config";
import Blog from "../types/blog.type";

export const create = (
  authorId: number,
  title: string,
  content: string,
  isPublished: boolean = false,
  topics: string[]
) => {
  return prisma.blog.create({
    data: {
      authorId,
      title,
      content,
      isPublished,
      topics: {
        connect: topics.map((topic) => {
          return { name: topic };
        }),
      },
    },
  });
};

export const getOne = async (userId: number, blogId: number) => {
  const blog = await prisma.blog.findUnique({
    where: { id: blogId },

    include: {
      topics: true,
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

  if (!blog) {
    return null;
  }

  const { likes, comments, _count, ...rest } = blog;

  const formatedBlog: Blog = {
    ...rest,
    count: _count,
    userInteractions: {
      like: likes.length > 0,
      comment: comments.length > 0,
    },
  };

  return formatedBlog;
};

export const getMany = async (
  userId: number,
  limit: number,
  offset: number,
  direction: "asc" | "desc" = "desc"
) => {
  const blogs = await prisma.blog.findMany({
    where: { isPublished: true },
    orderBy: { createdAt: direction },
    take: limit,
    skip: offset,

    include: {
      topics: true,
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

    const formatedBlog: Blog = {
      ...rest,
      count: _count,
      userInteractions: {
        like: likes.length > 0,
        comment: comments.length > 0,
      },
    };

    return formatedBlog;
  });

  return formatedBlogs;
};

export const update = (
  id: number,
  title: string,
  content: string,
  isPublished: boolean,
  removedTopics: string[],
  addedTopics: string[]
) => {
  return prisma.blog.update({
    where: {
      id,
    },
    data: {
      title,
      content,
      isPublished,
      topics: {
        disconnect: removedTopics.map((topic) => {
          return { name: topic };
        }),

        connect: addedTopics.map((topic) => {
          return { name: topic };
        }),
      },
    },
  });
};

export const deleteOne = async (id: number) => {
  const deleteComments = prisma.comment.deleteMany({ where: { blogId: id } });
  const deleleBlog = prisma.blog.delete({ where: { id } });
  const transaction = await prisma.$transaction([deleteComments, deleleBlog]);

  return transaction[1];
};
