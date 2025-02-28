import { isValidObjectId } from "mongoose";
import * as yup from "yup";

export const accountSchema = yup.object().shape({
  name: yup
    .string()
    .trim()
    .required("Name is required.")
    .min(3, "Name must be at least 3 characters.")
    .max(20, "name is too long."),
  email: yup
    .string()
    .trim()
    .required("Email is required.")
    .email("Invalid email address."),
  password: yup
    .string()
    .required("Password is required.")
    .min(5, "Password must be at least 5 characters.")
    .matches(
      /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      "password is week!"
    ),
});

export const verifyEmailBody = yup.object().shape({
  token: yup
    .string()
    .trim()
    .required("token is required")
    .max(6, "token must be 6 characters"),
  userId: yup
    .string()
    .transform(function (value) {
      if (this.isType(value) && isValidObjectId(value)) {
        return value;
      } else {
        return "";
      }
    })
    .required("userId is required"),
});

export const passResetSchema = yup.object().shape({
  token: yup
    .string()
    .trim()
    .required("token is required")
    .max(6, "token must be 6 characters"),
  userId: yup
    .string()
    .transform(function (value) {
      if (this.isType(value) && isValidObjectId(value)) {
        return value;
      } else {
        return "";
      }
    })
    .required("userId is required"),
});

export const signInSchema = yup.object().shape({
  email: yup
    .string()
    .trim()
    .required("Email is required.")
    .email("Invalid email address."),
  password: yup.string().required("Password is required."),
  // .matches(/^(?=.*[A-Za-z])(?=.*\d).{8,}$/, "password is weak!"),
});

export const historySchema = yup.object().shape({
  audio: yup
    .string()
    .transform(function (val) {
      return this.isType(val) && isValidObjectId(val) ? val : "";
    })
    .required("Invalid id"),
  progress: yup.number().required("Invalid progress. Field required."),
  date: yup
    .string()
    .transform(function (val) {
      const date = new Date(val);
      if (date instanceof Date) return val;
      else return "";
    })
    .required("invalid date."),
});
