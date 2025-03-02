import * as yup from "yup";
export const registerSchema = yup
  .object({
    username: yup
      .string()
      .required("Username is required")
      .min(3, "Username must be at least 3 characters")
      .max(20, "Username must be at most 20 characters"),
    email: yup
      .string()
      .email()
      .required("Email is required")
      .matches(/^[^@ ]+@[^@ ]+\.[^@ .]{2,}$/i, "email is not valid"),
    password: yup
        .string()
        .required("Password is required")
        .min(7, "Password must be at least 7 characters")
        .max(20, "Password must be at most 20 characters")
  })
  .required();

export const loginSchema = yup
  .object({
    identifier: yup
      .string()
      .email()
      .required("identifier is required")
      .matches(/^[^@ ]+@[^@ ]+\.[^@ .]{2,}$/i, "identifier is not valid"),
    password: yup
        .string()
        .required("Password is required")
        .min(7, "Password must be at least 7 characters")
        .max(20, "Password must be at most 20 characters")
  })
  .required();