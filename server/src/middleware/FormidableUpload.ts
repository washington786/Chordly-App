import { NextFunction, RequestHandler, Response } from "express";
import formidable, { Fields, Files, File } from "formidable";

// Extending Express Request to include `files`
import { Request } from "express";
interface RequestWithFiles extends Request {
  files?: Record<string, File>;
}

export const fileParse: RequestHandler = async (
  req: RequestWithFiles,
  res: Response,
  next: NextFunction
): Promise<void> => {
  if (!req.headers["content-type"]?.startsWith("multipart/form-data")) {
    res.status(422).json({ error: "Invalid content. Only upload form data." });
    return;
  }

  const form = formidable({ multiples: false });

  try {
    const { fields, files }: { fields: Fields; files: Files } = await new Promise((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) reject(err);
        else resolve({ fields, files });
      });
    });

    // Attach fields to req.body
    for (const key in fields) {
      req.body[key] = Array.isArray(fields[key]) ? fields[key][0] : fields[key];
    }

    // Attach files to req.files
    req.files = {};

    for (const key in files) {
      const fileOrArray = files[key];
      if (fileOrArray) {
        // Handle the case where fileOrArray is an array or a single file
        req.files[key] = Array.isArray(fileOrArray) ? fileOrArray[0] : fileOrArray;
      }
    }

    next(); // Call `next()` only once at the end
  } catch (error) {
    res.status(500).json({ error: "Error parsing file" });
    return;
  }
};