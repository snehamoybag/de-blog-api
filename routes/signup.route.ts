import { Router } from "express";
import { handleSignup } from "../controllers/signup.contoller";

const signup = Router();

signup.post("/", handleSignup);

export default signup;
