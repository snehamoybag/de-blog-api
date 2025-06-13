import { Router } from "express";
import * as blogsController from "../controllers/blogs.controller";
import * as commentsController from "../controllers/comments.controller";
import { verifyAuthToken } from "../middlewares/auth/route.auth.middleware";
import authorizeBlogAccess from "../middlewares/auth/blog.auth.middleware";

const blogs = Router();

blogs.all("/{*routes}", verifyAuthToken);

// blogs/?limit=30&offset=99&direction=asc
blogs.get("/", blogsController.getMany);
blogs.post("/", blogsController.create);

// blogs/:id
blogs.all("/:id/{*routes}", authorizeBlogAccess);

blogs.get("/:id", blogsController.getOne);
blogs.put("/:id", blogsController.update);
blogs.delete("/:id", blogsController.deleteOne);

// blogs/:blogId/comments/?limit=20&offset=9&direcection=asc
blogs.get("/:blogId/comments", commentsController.getComments);
blogs.post("/:blogId/comments", commentsController.create);

// blogs/:blogId/comments/:id/?limit=20&offset=19&direction=asc
blogs.get("/:blogId/comments/:commentId", commentsController.getReplies);
blogs.post("/:blogId/comments/:commentId", commentsController.create); // create reply
blogs.put("/:blogId/comments/:commentId", commentsController.update);
blogs.delete("/:blogId/comments/:commentId", commentsController.deleteOne);

export default blogs;
