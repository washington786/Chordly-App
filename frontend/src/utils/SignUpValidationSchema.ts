import * as yup from "yup";

export const signUpValidationSchema = yup.object().shape({
  name: yup.string().trim().required("Name is required"),
  email: yup
    .string()
    .email("Invalid email address.")
    .required("Email is required"),
  password: yup
    .string()
    .trim()
    .min(6, "Password must be at least 6 characters long")
    .matches(
        /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      // /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/,
      "Password is weak."
    )
    .required("Password is required"),
});
export const signInValidationSchema = yup.object().shape({
  email: yup
    .string()
    .email("Invalid email address.")
    .required("Email is required"),
  password: yup.string().trim().required("Password is required"),
});
export const ForgotPassValidationSchema = yup.object().shape({
  email: yup
    .string()
    .email("Invalid email address.")
    .required("Email is required"),
});
export const OtpValidationSchema = yup.object().shape({
  otp: yup
    .string()
    .length(6, "OTP must be exactly 6 digits")
    .matches(/^\d+$/, "OTP must contain only numbers")
    .required("OTP is required"),
});
