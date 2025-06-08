import "dotenv/config";
import { RequestHandler } from "express";
import jwt, { SignOptions } from "jsonwebtoken";
import assertUser from "../../lib/assert-user";
import passport, { AuthenticateCallback } from "passport";
import {
  Strategy as JWTStrategy,
  ExtractJwt,
  StrategyOptionsWithoutRequest,
  VerifyCallback,
} from "passport-jwt";
import { getById as getUserById } from "../../models/user.model";
import { ErrorUnauthorised } from "../../lib/http-exception-errors";

const JWT_SECRET_KEY = process.env.JWT_KEY || "abrakadbar999+";

export const issueAuthToken: RequestHandler = (req, res, next) => {
  const user = assertUser(req);

  const payload = {
    sub: user.id,
    role: user.role,
  };

  const options: SignOptions = {
    expiresIn: "7d",
  };

  jwt.sign(payload, JWT_SECRET_KEY, options, (err, token) => {
    if (err) {
      next(err);
      return;
    }

    if (!token) {
      next(new Error("Failed to generate JWT Token unexpectedly."));
      return;
    }

    res.locals.jwtToken = token;
    next();
  });
};

// setup passport jwt authentication
const options: StrategyOptionsWithoutRequest = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // Bearer <token>
  secretOrKey: JWT_SECRET_KEY,
};

const verifyCB: VerifyCallback = async (payload, done) => {
  try {
    const userId = Number(payload.sub);
    const user = await getUserById(userId);

    if (!user) {
      return done(null, false);
    }

    return done(null, user);
  } catch (err) {
    return done(err, false);
  }
};

passport.use(new JWTStrategy(options, verifyCB));

export const verifyAuthToken: RequestHandler = (req, res, next) => {
  const authenticateCB: AuthenticateCallback = (err, user) => {
    if (err) {
      next(err);
      return;
    }

    if (!user) {
      next(new ErrorUnauthorised("Invalid auth token."));
      return;
    }

    // save in req.user
    req.user = user;

    next();
  };

  return passport.authenticate("jwt", { session: false }, authenticateCB)(
    req,
    res,
    next,
  );
};
