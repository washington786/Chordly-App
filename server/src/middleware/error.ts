import { ErrorRequestHandler } from "express";

export const errorHandler: ErrorRequestHandler = (error, req, res, next) => {
  const statusCode = error.status || 500;
  const message = error.message || "Internal server error";
  res.status(statusCode).json({ error: message });
};
