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
        .min(3, "first name should not be less than 3 digits")
        .max(10, "first name should not be greater than 10 digits")
        .nullable()
        .required("The First Name is required"),

      last_name: string()
        .strict(true)
        .typeError("The Last Name Should be String")
        .nullable()
        .min(3, "last name should not be less than 3 digits")
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
        .required("The number_of_items is required")
        .min(1, "The number_of_items must be 1 or above"),

      category_id: number()
        .typeError("category_id must be a number")
        .integer(" enter a valid number")
        .nullable()
        .required("The category_id is required")
        .min(1, "The category_id must be 1 or above"),

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
        .required("The number_of_items is required")
        .min(1, "The number_of_items must be 1 or above"),


      brand_id: number()
        .typeError("brand_id must be a number")
        .integer(" enter a valid number")
        .nullable()
        .required("The brand_id is required")
        .min(1, "The brand_id must be 1 or above"),

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



async function validatePageAndItemNumberNewArrival(
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
        .required("The number_of_items is required")
        .min(1, "The number_of_items must be 1 or above"),
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
        .min(1, "The page_number must be 1 or above"),

      number_of_items: number()
        .typeError("number_of_items must be a number")
        .integer(" enter a valid number")
        .nullable()
        .required("The number_of_items is required")
        .min(1, "The number_of_items must be 1 or above"),
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
        .typeError("The search_value Should be String")
        .nullable()
        .required("The search_value is required"),

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
        .required("The number_of_items is required")
        .min(1, "The number_of_items must be 1 or above"),

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
        .required("The brand_id is required")
        .min(1, "The brand_id must be 1 or above"),

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
        .typeError("product_id must be a number")
        .integer(" enter a valid number")
        .nullable()
        .required("The product_id is required")
        .min(1, "The product_id must be 1 or above"),
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
        .required("The number_of_items is required")
        .min(1, "The number_of_items must be 1 or above"),

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
        .required("The product_id is required")
        .min(1, "The product_id must be 1 or above"),
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
        .required("The product_id is required")
        .min(1, "The product_id must be 1 or above"),


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
        .required("The product_id is required")
        .min(1, "The product_id must be 1 or above"),

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
        .required("The product_id is required")
        .min(1, "The product_id must be 1 or above"),


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
        .phone("PS", "phone_number is invalid")
        .nullable()
        .typeError("The phone_number should be in string form")
        .matches(
          /^[(][0-9]{3}[)][-\s\.][0-9]{2}[-\s\.][0-9]{7}$/,
          "the phone number should be in format (xxx) xx xxxxxxx"
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
  let imageSchema = array()
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
    const response = await imageSchema.validate(req.files, {
      abortEarly: false,
    });

    next();
  } catch (e: any) {
    return res.status(400).send(e.message);
  }
}
async function validateOrderStatus(
  req: Request,
  res: Response,
  next: NextFunction
) {
  let validateSchema = object({
    query: object({
      order_status: number()
        .typeError("order_status must be a number")
        .integer(" enter a valid number")
        .nullable()
        .required("The order_status is required")
        .min(0, "The order_status must not be less than 0")
        .max(2, "The order_status must not be grater than 2"),
    }).noUnknown(true),
  });
  try {
    const response = await validateSchema.validate({
      query: req.query,
      body: req.body,
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
async function validateOrderItem(
  req: Request,
  res: Response,
  next: NextFunction
) {
  let validateSchema = object({
    query: object({
      order_id: number()
        .typeError("order_id must be a number")
        .integer(" enter a valid number")
        .nullable()
        .required("The order_id is required")
        .min(1, "The order_id must not be grater than 1"),
    }).noUnknown(true),
  });
  try {
    const response = await validateSchema.validate({
      query: req.query,
      body: req.body,
    });
    next();
  } catch (e: any) {
    return res.status(400).send(e.message);
  }
}

async function UserAddressValidation(
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
        .required("The new first_name is required"),

      last_name: string()
        .strict(true)
        .typeError("The Last Name Should be String")
        .nullable()
        .min(3, "last name should not be less than 6 digits")
        .max(10, "last name should not be greater than 10 digits")
        .required("The new last_name is required"),

      email: string()
        .strict(true)
        .typeError("The Email Should be String")
        .email("It should be in the Email form")
        .nullable()
        .required("The new email is required"),

        phone_number: string()
        .phone("PS", "phone_number is invalid")
        .nullable()
        .typeError("The phone_number should be in string form")
        .matches(
          /^[(][0-9]{3}[)][-\s\.][0-9]{2}[-\s\.][0-9]{7}$/,
          "the phone number should be in format (xxx) xx xxxxxxx"
        )
        .required("The new phone_number is required"),

      location: string()
        .strict(true)
        .typeError("location must be a string formate")
        .nullable()
        .required("The new location is required"),
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

async function validateAddOrder(
  req: Request,
  res: Response,
  next: NextFunction
) {
  let validateSchema = object({
    body: object({
      address_id: number()
        .typeError("address_id must be a number")
        .integer(" enter a valid number")
        .nullable()
        .required("The address_id is required")
        .min(1, "The address_id must be 1 or above"),
        

      payment_type: string()
        .typeError("payment_type must be a string")
        .nullable()
        .required("The payment_type is required"),
    })
      .required("The address_id and payment_type are required")
      .nullable()
      .strict(true)
      .noUnknown(true),
  });

  try {
    const response = await validateSchema.validate({
      query: req.query,
      body: req.body,
    });
    next();
  } catch (e: any) {
    return res.status(400).send(e.message);
  }
}

async function validateAddReview(
  req: Request,
  res: Response,
  next: NextFunction
) {
  let validateSchema = object({
    body: object({
      product_id: number()
        .typeError("product_id must be a number")
        .nullable()
        .required("The product_id is required"),

      comment: string()
        .typeError("comment must be a string")
        .nullable()
        .required("The comment is required"),

      rating_value: number()
        .typeError("rating_value must be a number")
        .nullable()
        .required("The rating_value is required")
        .min(0, "The rating_value must not be less than 0")
        .max(5, "The rating_value must not be grater than 5"),
    })
      .required("The product_id and comment and rating_value are required")
      .nullable()
      .strict(true)
      .noUnknown(true),
  });

  try {
    const response = await validateSchema.validate({
      query: req.query,
      body: req.body,
    });
    next();
  } catch (e: any) {
    return res.status(400).send(e.message);
  }
}


async function validateAddBrandOrCategory(
  req: Request,
  res: Response,
  next: NextFunction
) {
  let validateSchema = object({
    body: object({
      discount_id: string()
        .typeError("discount_id must be a number")
        .nullable()
        .transform(function (value) {
          return Number(value);
        }),

      name: string()
        .typeError("brand name must be a string")
        .nullable()
        .required("The brand or category name is required"),

      image: object({
        name: string()
          .typeError("image name must be a string")
          .nullable()
          .required("The image name is required"),
      }),
    })
      .required("The discount_id and name are required")
      .nullable()
      .strict(true)
      .noUnknown(true),
  });

  try {
    const response = await validateSchema.validate({
      query: req.query,
      body: req.body,
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
  validatePageAndItemNumberNewArrival,
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
  validateOrderStatus,
  validateOrderItem,
  changePasswordValidation,
  UserAddressValidation,
  validateAddOrder,
  validateAddBrandOrCategory,
  validateAddReview,
};
