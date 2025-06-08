import { ErrorRequestHandler } from "express";
import { ErrorResponse } from "../lib/response-shapes";
import HttpException from "../lib/http-exception-errors";

const handlerError: ErrorRequestHandler = (err, req, res, next) => {
  if (err instanceof HttpException) {
    res.status(err.code).json(new ErrorResponse(err.message, err.code));

    return;
  }

  if (err instanceof Error) {
    const code = 500;
    res.status(code).json(new ErrorResponse(err.message, code));

    return;
  }

  res
    .status(500)
    .json(
      new ErrorResponse(
        "ErrorInternalServer: an unknown internal server error has occured.",
        500,
      ),
    );
};

export default handlerError;
