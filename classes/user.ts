// import { auth } from "../firebaseConfig";
import { INormal_user, IUser, IWishlist } from "../interfaces/objInterfaces";
import Session from "../models/Session";
import User from "../models/User";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcrypt";
import { NUMBER } from "sequelize";
import Wishlist from "../models/Wishlist";
import Product_wishlist from "../models/product_wishlist";
import sequelizeConnection from "../conections/sequelizeConnection";

import Cart from "../models/Cart";
import Product_cart from "../models/Product_cart";
import CProduct from "./product";
import Normal_User from "../models/Normal_user";
import { promises } from "dns";
import { cloudinaryImageUploadMethod } from "../middleware/imageuploader";
import Image from "../models/Image";

export default class CUser {
  private static instance: CUser;

  private constructor() {}

  public static getInstance(): CUser {
    if (CUser.instance) {
      return CUser.instance;
    }
    CUser.instance = new CUser();
    return CUser.instance;
  }

  async generateOrUpdateSession(userId: number): Promise<[string, string]> {
    const token = uuidv4();

    const expiration_date = new Date();
    expiration_date.setDate(new Date().getDate() + 7);
    try {
      let data = await Session.create({
        token: token,
        expiration_date: expiration_date,
        uid: userId,
      });

      data = data.toJSON();
      return [data.token, data.expiration_date];
    } catch (e: any) {
      if (e.name === "SequelizeUniqueConstraintError") {
        return await this.generateOrUpdateSession(userId);
      } else {
        throw new Error(e.message);
      }
    }
  }

  async checkSession(token: string): Promise<Session> {
    const data = await Session.findOne({
      where: {
        token: token,
      },
    });

    return data;
  }

  async createUserAccount(data: IUser): Promise<[IUser, string, string]> {
    try {
      data.type = "normal_user";
      const dataAdded = await User.create(data);
      let dataToReturn = dataAdded.toJSON();
      delete dataToReturn.password;
      try {
        const [token, expirationDate] = await this.generateOrUpdateSession(
          dataToReturn.uid
        );
        return [dataToReturn, token, expirationDate];
      } catch (e: any) {
        if (e.name === "SequelizeUniqueConstraintError") {
          await this.generateOrUpdateSession(data.uid);
        }
      }
    } catch (e: any) {
      if (
        e.name === "SequelizeValidationError" ||
        e.name === "SequelizeUniqueConstraintError"
      ) {
        throw new Error(e?.errors[0]?.message, { cause: "Validation error" });
      } else {
        throw new Error(e);
      }
    }
  }

  async checkUserExists(key: string, value: string | number): Promise<IUser> {
    try {
      let userData = await User.findOne({
        where: {
          [key as keyof IUser]: value,
        },
      });
      if (!userData) {
        throw new Error("Invalid Data Try Again", {
          cause: "Validation Error",
        });
      }
      return userData.toJSON();
    } catch (e: any) {
      if (e.cause === "Validation Error") {
        throw new Error("Invalid Data Try Again", {
          cause: "Validation Error",
        });
      } else throw new Error(e);
    }
  }

  async logInUser(user: Partial<IUser>): Promise<[IUser, string, string]> {
    try {
      const userData = await this.checkUserExists("email", user.email);
      if (userData) {
        try {
          const validate = await bcrypt.compare(
            user.password,
            userData.password
          );
          if (validate) {
            delete userData.password;
            delete userData.type;
            const [token, expirationDate] = await this.generateOrUpdateSession(
              userData.uid
            );
            delete userData.uid;
            return [userData, token, expirationDate];
          } else {
            throw new Error("Invalid Data Try Again", {
              cause: "Validation Error",
            });
          }
        } catch (e: any) {
          if (e.cause === "Validation Error") {
            throw new Error(e.message, {
              cause: "Validation Error",
            });
          } else throw new Error(e);
        }
      }
    } catch (e: any) {
      if (e.cause === "Validation Error") {
        throw new Error(e.message, {
          cause: "Validation Error",
        });
      } else throw new Error(e);
    }
  }

  async addToWishlist(productId: number, userId: number): Promise<boolean> {
    try {
      const trans = await sequelizeConnection.sequelize.transaction();
      try {
        const instance = CProduct.getInstance();
        const data = await instance.checkProductExists(productId);
        if (data) {
          try {
            const wishlist = await Wishlist.findOrCreate({
              where: { normal_uid: userId },
              transaction: trans,
              lock: true,
            });

            const wishlistInfo = wishlist[0].toJSON();
            try {
              const wishlistProduct = await Product_wishlist.findOrCreate({
                where: {
                  product_id: productId,
                  wishlist_id: wishlistInfo.wishlist_id,
                },
                transaction: trans,
                lock: true,
                skipLocked: true,
              });
              try {
                const commitTrans = await trans.commit();

                return true;
              } catch (error: any) {
                throw new Error(error.message);
              }
            } catch (error: any) {
              throw new Error(error.message);
            }
          } catch (error: any) {
            throw new Error(error.message);
          }
        }
      } catch (error: any) {
        await trans.rollback();
        throw new Error(error.message);
      }
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async deleteFromWishlist(
    productId: number,
    userId: number
  ): Promise<boolean> {
    try {
      const trans = await sequelizeConnection.sequelize.transaction();
      try {
        const wishlist = await Wishlist.findOne({
          where: {
            normal_uid: userId,
          },
          transaction: trans,
          lock: true,
          skipLocked: true,
        });
        try {
          const wishlistDeletedProduct = await Product_wishlist.destroy({
            transaction: trans,
            where: {
              product_id: productId,

              wishlist_id: wishlist.wishlist_id,
            },
          });

          try {
            const commitTrans = await trans.commit();

            return true;
          } catch (error: any) {
            await trans.rollback();
            throw new Error(error.message);
          }
        } catch (error: any) {
          await trans.rollback();
          throw new Error(error.message);
        }
      } catch (error: any) {
        await trans.rollback();
        throw new Error(error.message);
      }
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async addToCart(
    productId: number,
    quantity: number,
    userId: number
  ): Promise<boolean> {
    try {
      const trans = await sequelizeConnection.sequelize.transaction();
      try {
        const instance = CProduct.getInstance();
        const data = await instance.checkProductExists(productId);
        if (data) {
          try {
            const cart = await Cart.findOrCreate({
              where: { normal_uid: userId },
              transaction: trans,
              lock: true,
            });

            const cartInfo = cart[0].toJSON();
            try {
              const cartProduct = await Product_cart.findOrCreate({
                where: {
                  product_id: productId,
                  cart_id: cartInfo.cart_id,
                },
                defaults: {
                  quantity: 0,
                },
                transaction: trans,
                lock: true,
                skipLocked: true,
              });
              cartProduct[0].increment("quantity", { by: quantity });
              try {
                const commitTrans = await trans.commit();

                return true;
              } catch (error: any) {
                throw new Error(error.message);
              }
            } catch (error: any) {
              throw new Error(error.message);
            }
          } catch (error: any) {
            await trans.rollback();
            throw new Error(error.message);
          }
        }
      } catch (error: any) {
        throw new Error(error.message);
      }
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async deleteFromCart(productId: number, cartId: number, trans: any) {
    try {
      const cartProduct = await Product_cart.destroy({
        where: {
          product_id: productId,
          cart_id: cartId,
        },
        transaction: trans,
      });
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async decreaseFromCart(
    productId: number,
    cartId: number,
    quantity: number,
    trans: any
  ) {
    try {
      const cartProduct = await Product_cart.decrement("quantity", {
        by: quantity,
        where: {
          product_id: productId,
          cart_id: cartId,
        },
        transaction: trans,
      });
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async decreaseOrDeleteFromCart(
    productId: number,
    optionType: string,
    userId: number,
    quantity?: number
  ): Promise<boolean> {
    try {
      const trans = await sequelizeConnection.sequelize.transaction();

      try {
        const cart = await Cart.findOne({
          where: { normal_uid: userId },
          transaction: trans,
          lock: true,
        });

        const cartInfo = cart.toJSON();

        try {
          if (optionType === "delete") {
            await this.deleteFromCart(productId, cartInfo.cart_id, trans);
          } else if (optionType === "decrease") {
            await this.decreaseFromCart(
              productId,
              cartInfo.cart_id,
              quantity,
              trans
            );
          }
          try {
            const commitTrans = await trans.commit();

            return true;
          } catch (error: any) {
            throw new Error(error.message);
          }
        } catch (error: any) {
          throw new Error(error.message);
        }
      } catch (error: any) {
        await trans.rollback();
        throw new Error(error.message);
      }
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async EditUserInfo(
    userId: number,
    updatedData: Partial<IUser & INormal_user>
  ): Promise<Partial<IUser & INormal_user>> {
    if (updatedData.phone_number) {
      updatedData.phone_number = parseInt(
        updatedData.phone_number.toString().replace(/[()\s]/g, ""),
        10
      );
    }
    try {
      const trans = await sequelizeConnection.sequelize.transaction();

      const updateUserData = User.update(updatedData, {
        where: {
          uid: userId,
        },
        transaction: trans,
      });

      const updateNormalUserInfo = Normal_User.update(updatedData, {
        where: {
          normal_uid: userId,
        },
        transaction: trans,
      });

      const updatedUserData = Normal_User.findByPk(userId, {
        subQuery: false,
        raw: true,
        include: { model: User, attributes: [] },
        attributes: [
          "user.first_name",
          "user.last_name",
          "user.email",
          "phone_number",
          "date_of_birth",
        ],
      });
      try {
        const [, , userDataAfterUpdate] = await Promise.all([
          updateUserData,
          updateNormalUserInfo,
          updatedUserData,
        ]);
        const commitTrans = await trans.commit();
        return userDataAfterUpdate;
      } catch (error: any) {
        await trans.rollback();
        if (error.name === "SequelizeUniqueConstraintError") {
          throw new Error("The Email is used", {
            cause: "SequelizeUniqueConstraintError",
          });
        } else throw new Error(error.message);
      }
    } catch (error: any) {
      if (error.cause === "SequelizeUniqueConstraintError") {
        throw new Error(error.message, { cause: error.cause });
      } else throw new Error(error.message);
    }
  }

  async updateUserImage(imageFile: any, userId: number): Promise<string> {
    try {
      const { path } = imageFile[0];
      const url = (await cloudinaryImageUploadMethod(path)) as any;

      const image = await Image.create({
        normal_uid: userId,
        name: imageFile[0].originalname,
        url: url.res,
      });
      return url.res;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async clearSession(userId: number) {
    try {
      const deleteSession = await Session.destroy({
        where: {
          uid: userId,
        },
      });
    } catch (e: any) {
      throw new Error(e.message);
    }
  }

  async changePassword(passwords: any, userId: number): Promise<void> {
    try {
      const userData = await this.checkUserExists("uid", userId);
      if (userData) {
        try {
          const validate = await bcrypt.compare(
            passwords.old_password,
            userData.password
          );

          if (
            validate &&
            passwords.new_password === passwords.confirm_password
          ) {
            const salt = bcrypt.genSaltSync(10);
            const updatedPassword = bcrypt.hashSync(
              passwords.new_password,
              salt
            );
            try {
              const updatedData = User.update(
                { password: updatedPassword },
                {
                  where: {
                    uid: userId,
                  },
                }
              );
              const clearedSession = this.clearSession(userId);
              await Promise.all([updatedData, clearedSession]);
            } catch (e: any) {
              throw new Error(e.message);
            }
          } else {
            throw new Error(
              validate
                ? "NewPass and the confirm pass are not the same"
                : "Invalid password",
              {
                cause: "Validation Error",
              }
            );
          }
        } catch (e: any) {
          if (e.cause === "Validation Error") {
            throw new Error(e.message, {
              cause: "Validation Error",
            });
          } else throw new Error(e);
        }
      }
    } catch (e: any) {
      if (e.cause === "Validation Error") {
        throw new Error(e.message, {
          cause: "Validation Error",
        });
      } else throw new Error(e);
    }
  }
}
