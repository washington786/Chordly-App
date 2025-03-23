// import { NextFunction, RequestHandler, Response,Request } from "express";
// import formidable, { Fields, Files, File } from "formidable";


// interface RequestWithFiles extends Request {
//   files?: Record<string, File>;
// }

// export const fileParse: RequestHandler = async (
//   req: RequestWithFiles,
//   res: Response,
//   next: NextFunction
// ): Promise<void> => {
//   if (!req.headers["content-type"]?.startsWith("multipart/form-data")) {
//     res.status(422).json({ error: "Invalid content. Only upload form data." });
//     return;
//   }

//   const form = formidable({ multiples: false });

//   try {
//     // Promise to handle the parsing of form data
//     const { fields, files }: { fields: Fields; files: Files } =
//       await new Promise((resolve, reject) => {
//         form.parse(req, (err, fields, files) => {
//           if (err) {
//             reject(err);
//           } else {
//             resolve({ fields, files });
//           }
//         });
//       });

//     // Attach fields to req.body
//     for (const key in fields) {
//       if (fields[key]) {
//         req.body[key] = Array.isArray(fields[key]) ? fields[key][0] : fields[key];
//       } else {
//         req.body[key] = ""; // Set empty string if the field is missing
//       }
//     }

//     // Attach files to req.files
//     req.files = {};
//     for (const key in files) {
//       const fileOrArray = files[key];
//       if (fileOrArray) {
//         req.files[key] = Array.isArray(fileOrArray) ? fileOrArray[0] : fileOrArray;
//       }
//     }

//     // Call next middleware after successful parsing
//     next();
//   } catch (error) {
//     res.status(500).json({ error: "Error parsing file" });
//     return;
//   }
// };

import { NextFunction, RequestHandler, Response, Request } from "express";
import formidable, { Fields, Files, File } from "formidable";

// Extend the Express Request interface to include `files`
interface RequestWithFiles extends Request {
  files?: Record<string, File>;
}

export const fileParse: RequestHandler = async (
  req: RequestWithFiles,
  res: Response,
  next: NextFunction
): Promise<void> => {
  // Check if the content type is multipart/form-data
  if (!req.headers["content-type"]?.startsWith("multipart/form-data")) {
    res.status(422).json({ error: "Invalid content. Only upload form data." });
    return;
  }

  const form = formidable({ multiples: false });

  try {
    // Promise to handle the parsing of form data
    const { fields, files }: { fields: Fields; files: Files } = await new Promise(
      (resolve, reject) => {
        form.parse(req, (err, fields, files) => {
          if (err) {
            reject(err);
          } else {
            resolve({ fields, files });
          }
        });
      }
    );

    // Attach fields to req.body
    req.body = {}; // Initialize req.body as an empty object
    for (const key in fields) {
      const fieldValue = fields[key];
      if (fieldValue) {
        req.body[key] = Array.isArray(fieldValue) ? fieldValue[0] : fieldValue;
      } else {
        req.body[key] = ""; // Set empty string if the field is missing
      }
    }

    // Attach files to req.files
    req.files = {};
    for (const key in files) {
      const fileOrArray = files[key];
      if (fileOrArray) {
        req.files[key] = Array.isArray(fileOrArray) ? fileOrArray[0] : fileOrArray;
      }
    }

    // Call next middleware after successful parsing
    next();
  } catch (error) {
    res.status(500).json({ error: "Error parsing file" });
    return;
  }
};