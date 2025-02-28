import passwordResetToken from "#/models/passwordResetToken";
import users from "#/models/users";
import { JWT_SECRET } from "#/utils/variables";
import { RequestHandler } from "express";

import jwt from "jsonwebtoken";

declare global {
  namespace Express {
    interface Request {
      user: {};
      token: string;
    }
  }
}

export const isValidPassResetToken: RequestHandler = async (req, res, next) => {
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

export const grantValid: RequestHandler = async (req, res) => {
  /* verify if the token is still valid. */

  res.status(200).json({ valid: true });
};

export const isAuthenticated: RequestHandler = async (req, res, next) => {
  const { authorization } = req.headers;
  const token = authorization?.split("Bearer ")[1];

  if (!token) {
    return res.status(403).json({ message: "Unauthorized" });
  }

  const verified = jwt.verify(token, JWT_SECRET) as jwt.JwtPayload;
  console.log(verified);
  const id = verified.userId;

  const user = await users.findOne({ _id: id, tokens: token });

  if (!user) {
    return res.status(403).json({ message: "Unauthorized" });
  }

  req.user = user;
  req.token = token;
  next();
};
