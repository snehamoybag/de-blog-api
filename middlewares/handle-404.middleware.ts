import { RequestHandler } from "express";
import { FailureResponse } from "../lib/response-shapes";

const handle404: RequestHandler = (req, res) => {
  const statusCode = 404;

  res
    .status(statusCode)
    .json(
      new FailureResponse(
        "ErrorNotFound: the resource you're looking for does not exist or may have been deleted permanently.",
        statusCode,
      ),
    );
};

export default handle404;
