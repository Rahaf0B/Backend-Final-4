import { object, string, number, date, mixed, lazy, array } from "yup";
import { Request, Response, NextFunction, query } from "express";
import { parse } from "date-fns";
import "yup-phone-lite";

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
  let validateSchema = object({
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

      category_id: number()
        .typeError("category_id must be a number")
        .integer(" enter a valid number")
        .nullable()
        .required("The category_id is required"),
    }).noUnknown(true),
  });

  try {
    const response = await validateSchema.validate({
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
  let validateSchema = object({
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

      brand_id: number()
        .typeError("brand_id must be a number")
        .integer(" enter a valid number")
        .nullable()
        .required("The brand_id is required"),
    }).noUnknown(true),
  });

  try {
    const response = await validateSchema.validate({
      query: req.query,
    });
    next();
  } catch (e: any) {
    return res.status(400).send(e.message);
  }
}

async function validatePageAndItemNumber(
  req: Request,
  res: Response,
  next: NextFunction
) {
  let validateSchema = object({
    query: object({
      page_number: number()
        .typeError("page_number must be a number")
        .integer(" enter a valid number")
        .nullable()
        .required("The page_number is required")
        .min(0, "The page_number must be 0 or above"),

      number_of_items: number()
        .typeError("number_of_items must be a number")
        .integer(" enter a valid number")
        .nullable()
        .required("The number_of_items is required"),
    }).noUnknown(true),
  });

  try {
    const response = await validateSchema.validate({
      query: req.query,
    });
    next();
  } catch (e: any) {
    return res.status(400).send(e.message);
  }
}

async function validatePageNumber(
  req: Request,
  res: Response,
  next: NextFunction
) {
  let validateSchema = object({
    query: object({
      page_number: number()
        .typeError("page_number must be a number")
        .integer(" enter a valid number")
        .nullable()
        .required("The page_number is required")
        .min(1, "The page_number must be 1 or above"),

    }).noUnknown(true),
  });

  try {
    const response = await validateSchema.validate({
      query: req.query,
    });
    next();
  } catch (e: any) {
    return res.status(400).send(e.message);
  }
}
async function validateTextSearch(
  req: Request,
  res: Response,
  next: NextFunction
) {
  let validateSchema = object({
    query: object({
      search_value: string()
        .strict(true)
        .typeError("The Last Name Should be String")
        .nullable()
        .required("The Last Name is required"),

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
    }).noUnknown(true),
  });

  try {
    const response = await validateSchema.validate({
      query: req.query,
    });
    next();
  } catch (e: any) {
    return res.status(400).send(e.message);
  }
}

async function validateCategoryBrandID(
  req: Request,
  res: Response,
  next: NextFunction
) {
  let validateSchema = object({
    query: object({
      category_id: number()
        .typeError("category_id must be a number")
        .integer(" enter a valid number")
        .nullable()
        .required("The category_id is required")
        .min(1, "The category_id must be 1 or above"),

      brand_id: number()
        .typeError("brand_id must be a number")
        .integer(" enter a valid number")
        .nullable()
        .required("The brand_id is required"),
    }).noUnknown(true),
  });

  try {
    const response = await validateSchema.validate({
      query: req.query,
    });
    next();
  } catch (e: any) {
    return res.status(400).send(e.message);
  }
}

async function validateProductId(
  req: Request,
  res: Response,
  next: NextFunction
) {
  let validateSchema = object({
    params: object({
      product_id: number()
        .typeError("page_number must be a number")
        .integer(" enter a valid number")
        .nullable()
        .required("The page_number is required"),
    }).noUnknown(true),
  });

  try {
    const response = await validateSchema.validate({
      params: req.params,
    });
    next();
  } catch (e: any) {
    return res.status(400).send(e.message);
  }
}

async function validatePopularDiscount(
  req: Request,
  res: Response,
  next: NextFunction
) {
  let validateSchema = object({
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

      value: number()
        .round("floor")
        .typeError("value must be a number")
        .integer(" enter a valid number")
        .nullable()
        .required("The value is required"),
    }).noUnknown(true),
  });

  try {
    const response = await validateSchema.validate({
      query: req.query,
    });
    next();
  } catch (e: any) {
    return res.status(400).send(e.message);
  }
}

async function validateWishlist(
  req: Request,
  res: Response,
  next: NextFunction
) {
  let validateSchema = object({
    query: object({
      product_id: number()
        .typeError("product_id must be a number")
        .integer(" enter a valid number")
        .nullable()
        .required("The product_id is required"),
    }).noUnknown(true),
  });

  try {
    const response = await validateSchema.validate({
      query: req.query,
    });
    next();
  } catch (e: any) {
    return res.status(400).send(e.message);
  }
}

async function validateCart(req: Request, res: Response, next: NextFunction) {
  let validateSchema = object({
    body: object({
      product_id: number()
        .typeError("product_id must be a number")
        .integer(" enter a valid number")
        .nullable()
        .required("The product_id is required"),

      quantity: number()
        .typeError("quantity must be a number")
        .integer(" enter a valid number")
        .nullable()
        .required("The quantity is required")
        .min(1, "The quantity must be 1 or above"),
    })
      .required("The product_id and quantity are required")
      .nullable()
      .strict(true)
      .noUnknown(true),
  });

  try {
    const response = await validateSchema.validate({
      body: req.body,
    });
    next();
  } catch (e: any) {
    return res.status(400).send(e.message);
  }
}

async function validateDeleteFromCart(
  req: Request,
  res: Response,
  next: NextFunction
) {
  let validateSchema = object({
    query: object({
      product_id: number()
        .typeError("product_id must be a number")
        .integer("enter a valid number")
        .nullable()
        .required("The product_id is required"),
    }).noUnknown(true),
  });

  try {
    const response = await validateSchema.validate({
      query: req.query,
    });
    next();
  } catch (e: any) {
    return res.status(400).send(e.message);
  }
}

async function validateDecreaseFromCart(
  req: Request,
  res: Response,
  next: NextFunction
) {
  let validateSchema = object({
    body: object({
      product_id: number()
        .typeError("product_id must be a number")
        .integer(" enter a valid number")
        .nullable()
        .required("The product_id is required"),

      quantity: number()
        .typeError("quantity must be a number")
        .integer(" enter a valid number")
        .nullable()
        .required("The quantity is required")
        .min(1, "The quantity must be 1 or above"),
    })
      .required("The product_id and quantity are required")
      .nullable()
      .strict(true)
      .noUnknown(true),
  });

  try {
    const response = await validateSchema.validate({
      body: req.body,
    });
    next();
  } catch (e: any) {
    return res.status(400).send(e.message);
  }
}

async function UserEditInfoValidation(
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
        .nullable(),

      last_name: string()
        .strict(true)
        .typeError("The Last Name Should be String")
        .nullable()
        .min(3, "last name should not be less than 6 digits")
        .max(10, "last name should not be greater than 10 digits"),

      email: string()
        .strict(true)
        .typeError("The Email Should be String")
        .email("It should be in the Email form")
        .nullable(),

      phone_number: string()
        .phone("IN", "${path} is invalid")
        .nullable()
        .typeError("The phone_number should be in string form")
        .matches(
          /^[(][0-9]{3}[)][-\s\.][0-9]{3}[-\s\.][0-9]{4}$/,
          "the phone number should be in format (xxx) xxx xxxx"
        ),

      date_of_birth: string()
        .strict(true)
        .typeError("date_of_birth must be a string formate")
        .nullable()
        .test("max", "the date is in the future", function (value) {
          return value
            ? Number(value?.split("-")[0]) < new Date().getFullYear()
            : true;
        })
        .matches(
          /^([0-9]{4})\-([0-9]{2})\-([0-9]{2})$/,
          "date_of_birth must be in format yyyy-MM-dd"
        ),
    })
      .required("To edit You Should enter valid Info")
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

async function ImageValidation(
  req: Request,
  res: Response,
  next: NextFunction
) {
  let userSchema = array()
    .of(
      object().shape({
        mimetype: string()
          .required("Image mimetype is required")
          .matches(
            /^image\/(jpeg|jpg)$/,
            "Invalid image format the format allowed are jpg and jpeg"
          ),
      })
    )
    .required("At least one image is required");

  try {
    const response = await userSchema.validate(req.files, {
      abortEarly: false,
    });

    next();
  } catch (e: any) {
    return res.status(400).send(e.message);
  }
}

async function changePasswordValidation(
  req: Request,
  res: Response,
  next: NextFunction
) {
  let userSchema = object({
    body: object({
      old_password: string()
        .strict(true)
        .typeError("The old_password Should be String")
        .nullable()
        .required("The old Password is required"),

      new_password: string()
        .strict(true)
        .typeError("The new_password Should be String")
        .nullable()
        .min(6, "password should not be less than 6 digits")
        .matches(
          /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]).*$/,
          "The password must contain characters,numbers and special characters"
        )
        .required("The new Password is required"),

      confirm_password: string()
        .strict(true)
        .typeError("The confirm_password Should be String")
        .nullable()
        .min(6, "password should not be less than 6 digits")
        .matches(
          /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]).*$/,
          "The password must contain characters,numbers and special characters"
        )
        .required("The confirm Password  is required"),
    })
      .required("The old ,new and confirm Passwords are required")
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

export default {
  UserCreateAccountValidation,
  UserLoginValidation,
  validateGetByCategory,
  validateGetByBrand,
  validatePageAndItemNumber,
  validatePageNumber,
  validateTextSearch,
  validateProductId,
  validateCategoryBrandID,
  validatePopularDiscount,
  validateWishlist,
  validateCart,
  validateDeleteFromCart,
  validateDecreaseFromCart,
  UserEditInfoValidation,
  ImageValidation,
  changePasswordValidation,
};
