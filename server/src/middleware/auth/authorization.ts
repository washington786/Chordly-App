// import { RequestHandler } from "express";
import jwt from "jsonwebtoken";

import { Request, RequestHandler, Response } from "express";
import { JWT_SECRET } from "#/utils/variables";
import users from "#/models/users";
import { Types } from "mongoose";

export interface UserDocumentRequest {
  _id: Types.ObjectId;
  id?: Types.ObjectId; // Use ObjectId instead of string
  email: string;
  name: string;
  verified: boolean;
  tokens: string[];
  avatar?: {
    url: string;
    public_id: string;
  };
}
declare global {
  namespace Express {
    interface Request {
      user?: UserDocumentRequest;
    }
  }
}

export const isAuthenticated: RequestHandler = async (
  req: Request,
  res: Response,
  next
): Promise<void> => {
  const { authorization } = req.headers;
  const token = authorization?.split("Bearer ")[1];

  if (!token) {
    res.status(403).json({ message: "Unauthorized" });
    return;
  }

  try {
    const verified = jwt.verify(token, JWT_SECRET) as jwt.JwtPayload;
    const userId = verified.userId;

    const user = await users.findOne({ _id: userId, tokens: token });
    if (!user) {
      res.status(403).json({ message: "Unauthorized" });
      return;
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(403).json({ message: "Unauthorized", error: error });
    return;
  }
};

export const isVerified: RequestHandler = (
  req: Request,
  res: Response,
  next
) => {
  if (!req.user?.verified) {
    res.status(403).json({ message: "Please verify your account" });
    return;
  }
  next();
};
