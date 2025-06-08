import { Router } from "express";
import { SuccessResponse } from "../lib/response-shapes";

const home = Router();

home.get("/", (req, res) => {
  res.json(
    new SuccessResponse("Hi from De-Blog!", {
      name: "De-Blog API",
      version: "1.0.0",
    }),
  );
});

export default home;
