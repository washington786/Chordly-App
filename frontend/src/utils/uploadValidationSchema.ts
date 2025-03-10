import * as yup from "yup";
import { categoryTypes } from "./CategoryData";

export const validationSchema = yup.object().shape({
  title: yup.string().trim().required("title is required!"),
  about: yup.string().trim().required("about field is required!"),
  category: yup.string().oneOf(categoryTypes, "category is required!"),
  file: yup.object().shape({
    uri: yup.string().required("audio file is required!"),
    mimeType: yup.string().required("audio file is required!"),
    name: yup.string().required("audio file is required!"),
    size: yup.string().required("audio file is required!"),
  }),
  poster: yup.object().shape({
    uri: yup.string(),
    type: yup.string(),
    name: yup.string(),
    size: yup.string(),
  }),
});
