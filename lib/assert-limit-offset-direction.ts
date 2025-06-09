import { Request } from "express";

const assertLimitOffsetDirection = (
  req: Request
): [number, number, "asc" | "desc"] => {
  let limit = Number(req.query.limit) || 0;

  if (limit > 100) {
    limit = 100;
  } else if (limit < 0) {
    limit = 0;
  }

  let offset = Number(req.query.offset) || 0;

  if (offset < 0) {
    offset = 0;
  }

  const direction =
    String(req.query.direction).toLowerCase() !== "asc" ? "desc" : "asc";

  return [limit, offset, direction];
};

export default assertLimitOffsetDirection;
