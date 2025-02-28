import * as yup from "yup";
import { categories } from "./audio_categories";
import { isValidObjectId } from "mongoose";

export const audioValidationSchema = yup.object().shape({
  title: yup.string().required("title is required"),
  about: yup.string().required("about is required"),
  category: yup
    .string()
    .oneOf(categories, "Invalid category")
    .required("category is required"),
});

export const PlaylistValidationSchema = yup.object().shape({
  title: yup.string().required("title field is required"),
  // owner: yup.string().required("owner field is required"),
  resourceId: yup.string().transform(function (val) {
    if (this.isType(val) && isValidObjectId(val)) {
      return val;
    } else {
      return "";
    }
  }),
  visibility: yup
    .string()
    .oneOf(["public", "private"], "invalid selection.")
    .required("field is required."),
});

export const OldPlaylistValidationSchema = yup.object().shape({
  title: yup.string().required("title field is required"),
  // owner: yup.string().required("owner field is required"),
  // validate audio id
  items: yup.string().transform(function (val) {
    if (this.isType(val) && isValidObjectId(val)) {
      return val;
    } else {
      return "";
    }
  }),
  // validate playlist id
  id: yup.string().transform(function (val) {
    return this.isType(val) && isValidObjectId(val) ? val : "";
  }),
  visibility: yup
    .string()
    .oneOf(["public", "private"], "invalid selection.")
    .required("field is required."),
});
