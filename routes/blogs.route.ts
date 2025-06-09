import { Router } from "express";
import * as blogsController from "../controllers/blogs.controller";
import { verifyAuthToken } from "../middlewares/auth/route.auth.middleware";
import authorizeBlogAccess from "../middlewares/auth/blog.auth.middleware";
import { getMany as getManyComments } from "../controllers/comments.controller";

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

// blogs/:id/comments/?limit=20&offset=9&direcection=asc
blogs.get(":/id/comments", getManyComments);

export default blogs;
