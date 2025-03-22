import { ErrorRequestHandler, NextFunction, Request, Response } from "express";

export const errorHandler: ErrorRequestHandler = (
  error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode = error.status || 500;
  const message = error.message || "Internal server error";
  res.status(statusCode).json({ error: message });
};
