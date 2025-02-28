import { RequestHandler } from "express";
import * as yup from "yup";
export const validate = (schema: any): RequestHandler => {
  return async (req, res, next) => {
    if (!req.body) {
      res.status(500).json({ error: "Please enter valid values." });
    }
    try {
      await yup
        .object({ body: schema })
        .validate({ body: req.body }, { abortEarly: true });
      next();
    } catch (error) {
      if (error instanceof yup.ValidationError) {
        res.status(500).json({ error: `${error.message}` });
      }
    }
  };
};
