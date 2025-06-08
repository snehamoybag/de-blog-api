import { Router } from "express";
import authenticateUser from "../middlewares/auth/user.auth.middleware";
import { issueAuthToken } from "../middlewares/auth/route.auth.middleware";
import * as loginController from "../controllers/login.controller";

const login = Router();

login.post(
  "/",
  authenticateUser,
  issueAuthToken,
  loginController.handleSuccess,
);

export default login;
