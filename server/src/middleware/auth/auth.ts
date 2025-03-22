import passwordResetToken from "#/models/passwordResetToken";
import users from "#/models/users";
import { JWT_SECRET } from "#/utils/variables";
import { NextFunction, Request, RequestHandler, Response } from "express";

import jwt from "jsonwebtoken";
import { Types } from "mongoose";

interface User {
  _id: Types.ObjectId; // Use ObjectId instead of string
  id?: Types.ObjectId;
  email: string;
  name: string;
  verified: boolean;
  tokens: string[];
  avatar?: {
    url: string;
    public_id: string;
  };
}
// Extend the Express Request interface globally
declare global {
  namespace Express {
    interface Request {
      user?: User; // Make user optional
      token?: string; // Add token to the request object
    }
  }
}

export const isValidPassResetToken: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  /* verify if the token is still valid. */

  const { token, userId } = req.body;

  const user = await passwordResetToken.findOne({ owner: userId });

  if (!user) {
    res.status(403).json({ error: "token has expired!!" });
  }

  const isMatched = await user?.compareToken(token);

  if (!isMatched) {
    res.status(403).json({ error: "Invalid token" });
  }

  // res.status(200).json({message:"Token is valid."});

  next();
};

export const grantValid: RequestHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  /* verify if the token is still valid. */

  res.status(200).json({ valid: true });
};

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

  const verified = jwt.verify(token, JWT_SECRET) as jwt.JwtPayload;
  console.log(verified);
  const id = verified.userId;

  const user = await users.findOne({ _id: id, tokens: token });

  if (!user) {
    res.status(403).json({ message: "Unauthorized" });
    return;
  }

  req.user = user;
  req.token = token;
  next();
};

export const isAuth: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { authorization } = req.headers;
  const token = authorization?.split("Bearer ")[1];

  if (token) {
    const verified = jwt.verify(token, JWT_SECRET) as jwt.JwtPayload;
    console.log(verified);
    const id = verified.userId;

    const user = await users.findOne({ _id: id, tokens: token });

    if (!user) {
      res.status(403).json({ message: "Unauthorized" });
      return;
    }

    req.user = user;
    req.token = token;
  }

  next();
};
