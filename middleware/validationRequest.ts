import { object, string, number, date, mixed, lazy } from "yup";
import { Request, Response, NextFunction, query } from "express";
import { parse } from "date-fns";

async function UserCreateAccountValidation(
  req: Request,
  res: Response,
  next: NextFunction
) {
  let userSchema = object({
    body: object({
      first_name: string()
        .strict(true)
        .typeError("The First Name Should be String")
        .min(3, "first name should not be less than 6 digits")
        .max(10, "first name should not be greater than 10 digits")
        .nullable()
        .required("The First Name is required"),

      last_name: string()
        .strict(true)
        .typeError("The Last Name Should be String")
        .nullable()
        .min(3, "last name should not be less than 6 digits")
        .max(10, "last name should not be greater than 10 digits")
        .required("The Last Name is required"),

      email: string()
        .strict(true)
        .typeError("The Email Should be String")
        .required("The email is required")
        .email("It should be in the Email form")
        .nullable(),

      password: string()
        .strict(true)
        .required("The password is required")
        .typeError("The password Should be String")
        .min(6, "password should not be less than 6 digits")
        .matches(
          /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]).*$/,
          "The password must contain characters,numbers and special characters"
        )
        .nullable(),
    })
      .required("The first name,last name,email,password are required")
      .nullable()
      .strict(true)
      .noUnknown(true),
  });

  try {
    const response = await userSchema.validate({ body: req.body });
    next();
  } catch (e: any) {
    return res.status(400).send(e.message);
  }
}

async function UserLoginValidation(
  req: Request,
  res: Response,
  next: NextFunction
) {
  let userSchema = object({
    body: object({
      email: string()
        .strict(true)
        .typeError("The Email Should be String")
        .required("The email is required")
        .email("It should be in the Email form")
        .nullable(),

      password: string()
        .strict(true)
        .required("The password is required")
        .typeError("The password Should be String")
        .min(6, "password should not be less than 6 digits")
        .matches(
          /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]).*$/,
          "The password must contain characters,numbers and special characters"
        )
        .nullable(),
    })
      .required("The email,password are required")
      .nullable()
      .strict(true)
      .noUnknown(true),
  });

  try {
    const response = await userSchema.validate({ body: req.body });
    next();
  } catch (e: any) {
    return res.status(400).send(e.message);
  }
}

async function validateGetByCategory(
  req: Request,
  res: Response,
  next: NextFunction
) {
  let IDParamsSchema = object({
    query: object({
      page_number: number()
        .typeError("page_number must be a number")
        .integer(" enter a valid number")
        .nullable()
        .required("The page_number is required")
        .min(1, "The page_number must be 1 or above"),

      number_of_items: number()
        .typeError("number_of_items must be a number")
        .integer(" enter a valid number")
        .nullable()
        .required("The number_of_items is required"),

      category: lazy((value: any) => {
        if (value === null) {
          return mixed().nullable();
        } else if (typeof value === "number") {
          return number().required("The category is required");
        } else if (typeof value === "string") {
          return string()
            .required("The category is required")
            .matches(
              /^[ a-zA-Z0-9@]+$/,
              "This category contain special character"
            );
        }

        return mixed().test(
          "invalidType",
          "Invalid category value type",
          (value) => false
        );
      }),
    }).noUnknown(true),
  });

  try {
    const response = await IDParamsSchema.validate({
      query: req.query,
    });
    next();
  } catch (e: any) {
    return res.status(400).send(e.message);
  }
}

async function validateGetByBrand(
  req: Request,
  res: Response,
  next: NextFunction
) {
  let IDParamsSchema = object({
    query: object({
      page_number: number()
        .typeError("page_number must be a number")
        .integer(" enter a valid number")
        .nullable()
        .required("The page_number is required")
        .min(1, "The page_number must be 1 or above"),

      number_of_items: number()
        .typeError("number_of_items must be a number")
        .integer(" enter a valid number")
        .nullable()
        .required("The number_of_items is required"),

      brand: lazy((value: any) => {
        if (value === null) {
          return mixed().nullable();
        } else if (typeof value === "number") {
          return number().required("The brand is required");
        } else if (typeof value === "string") {
          return string()
            .required("The brand is required")
            .matches(
              /^[ a-zA-Z0-9@]+$/,
              "This brand cannot contain special character"
            );
        }

        return mixed().test(
          "invalidType",
          "Invalid brand value type",
          (value) => false
        );
      }),
    }).noUnknown(true),
  });

  try {
    const response = await IDParamsSchema.validate({
      query: req.query,
    });
    next();
  } catch (e: any) {
    return res.status(400).send(e.message);
  }
}

export default {
  UserCreateAccountValidation,
  UserLoginValidation,
  validateGetByCategory,
  validateGetByBrand,
};
