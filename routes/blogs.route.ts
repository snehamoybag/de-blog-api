import { Router } from "express";
import * as blogsController from "../controllers/blogs.controller";
import { verifyAuthToken } from "../middlewares/auth/route.auth.middleware";

const blogs = Router();

blogs.all("/{*routes}", verifyAuthToken);

// blogs/?limit=30&offset=99&direction=asc
blogs.get("/", blogsController.getMany);

export default blogs;
