import { NextFunction, Request, Response } from "express";
import { verify } from "jsonwebtoken";
import authConfig from "../config/auth";
import AppError from "../errors/appError";

interface TokenPayload {
  iat: number;
  exp: number;
  sub: string;
}

export const ensureAuth = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    throw new AppError("missing authorization token", 401);
  }

  try {
    const [, token] = authHeader.split(" ");
    const { secret } = authConfig.jwt;

    const decoded = verify(token, secret);
    const { sub } = decoded as TokenPayload;

    req.user = {
      id: sub,
    };

    return next();
  } catch (err) {
    throw new AppError("jwt expired or sent in a wrong way");
  }
};
