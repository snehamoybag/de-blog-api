import { RequestHandler } from "express";
import assertUser from "../../lib/assert-user";
import { getOne as getBlog } from "../../models/blog.model";
import { ErrorForbidden, ErrorNotFound } from "../../lib/http-exception-errors";

const authorizeBlogAccess: RequestHandler = async (req, res, next) => {
  const user = assertUser(req);
  const blogId = Number(req.params.id);
  const blog = await getBlog(user.id, blogId);

  if (!blog) {
    throw new ErrorNotFound(`No blog with the id ${blogId} is found.`);
  }

  const isBlogAuthor = blog.authorId === user.id;
  const isAdminOrMod = user.role === "ADMIN" || user.role === "MODERATOR";
  const isPublished = blog.isPublished;

  // do not allow access of unpublished blogs to other user
  if (!isPublished && !isBlogAuthor) {
    throw new ErrorForbidden("Only the author can access this blog.");
  }

  // only allow mods and admins and author to modify/delete blogs
  if (req.method !== "GET" && isPublished && !isBlogAuthor && !isAdminOrMod) {
    throw new ErrorForbidden(
      "Only the author and admin/moderator can modify or delete the blog."
    );
  }

  // save the blog in res.locals
  res.locals.blog = blog;
  next();
};

export default authorizeBlogAccess;
