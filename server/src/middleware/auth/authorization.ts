// import { RequestHandler } from "express";
import jwt from "jsonwebtoken";

import { RequestHandler } from "express";
import { JWT_SECRET } from "#/utils/variables";
import users from "#/models/users";

declare global {
  namespace Express {
    interface Request {
      user: {};
    }
  }
}

export const isAuthenticated: RequestHandler = async (
  req: Request,
  res: Response,
  next
) => {
  const { authorization } = req.headers;
  const token = authorization?.split("Bearer ")[1];

  if (!token) {
    return res.status(403).json({ message: "Unauthorized" });
  }

  try {
    const verified = jwt.verify(token, JWT_SECRET) as jwt.JwtPayload;
    const userId = verified.userId;

    const user = await users.findOne({ _id: userId, tokens: token });
    if (!user) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    req.user = user;
    next();
  } catch (error) {
    return res
      .status(403)
      .json({ message: "Unauthorized", error: error.message });
  }
};

export const isVerified: RequestHandler = (req, res, next) => {
  if (!req.user?.verified) {
    return res.status(403).json({ message: "Please verify your account" });
  }
  next();
};
