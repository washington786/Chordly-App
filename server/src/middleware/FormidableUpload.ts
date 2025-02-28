// import { RequestWithFiles } from "#/routers/auth";
// import { RequestHandler } from "express";

// import formidable from "formidable";

// export const fileParse: RequestHandler = async (
//   req: RequestWithFiles,
//   res,
//   next
// ) => {
//   if (!req.headers["content-type"]?.startsWith("multipart/form-data")) {
//     return res
//       .status(422)
//       .json({ error: "invalid content. Only upload form data." });
//   }

//   const form = formidable({ multiples: false });

//   const [fields, files] = await form.parse(req);

//   for (const key in fields) {
//     const field = fields[key];
//     if (field) {
//       req.body[key] = field[0];
//     }
//   }

//   for (const key in files) {
//     const file = files[key];
//     if (!file) {
//       req.body[key] = {};
//     }

//     if (file) {
//       req?.files[key] = file[0];
//     }
//     next();
//   }
// };
import { RequestHandler } from "express";
import formidable, { Fields, Files } from "formidable";

// Extending Express Request to include `files`
import { Request } from "express";
interface RequestWithFiles extends Request {
  files?: Record<string, formidable.File>;
}

export const fileParse: RequestHandler = async (
  req: RequestWithFiles,
  res,
  next
) => {
  if (!req.headers["content-type"]?.startsWith("multipart/form-data")) {
    return res
      .status(422)
      .json({ error: "Invalid content. Only upload form data." });
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
      req.files[key] = Array.isArray(files[key]) ? files[key][0] : files[key];
    }

    next(); // Call `next()` only once at the end
  } catch (error) {
    return res.status(500).json({ error: "Error parsing file" });
  }
};
