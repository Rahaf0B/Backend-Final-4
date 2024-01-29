// import { auth } from "../firebaseConfig";
import {
  IAddress,
  INormal_user,
  IOrder,
  IOrder_item,
  IProduct,
  IRating,
  IUser,
  IWishlist,
} from "../interfaces/objInterfaces";
import Session from "../models/Session";
import User from "../models/User";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcrypt";
import { NUMBER, or } from "sequelize";
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
import Order from "../models/Order";
import Address from "../models/Address";
import Order_item from "../models/Order_item";
import Product from "../models/Product";
import cls from "cls-hooked";
import { Sequelize } from "sequelize-typescript";
import { Op } from "sequelize";
import Rating from "../models/Rating";
import Discount from "../models/Discount";

export default class CUser {
  private static instance: CUser;
  private sequelizeNameSpace = cls.createNamespace("userTransaction");

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

  async createUserAccount(data: IUser): Promise<[boolean, string, string]> {
    try {
      data.type = "normal_user";
      const dataAdded = await User.create(data);
      let dataToReturn = dataAdded.toJSON();
      delete dataToReturn.password;
      try {
        const [token, expirationDate] = await this.generateOrUpdateSession(
          dataToReturn.uid
        );

        return [true, token, expirationDate];
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

  async logInUser(user: Partial<IUser>): Promise<[boolean, string, string]> {
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
            return [true, token, expirationDate];
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
        const data = await instance.checkProductExists(productId, trans);
        if (data) {
          const wishlist = await Wishlist.findOrCreate({
            where: { normal_uid: userId },
            transaction: trans,
            lock: true,
          });

          const wishlistInfo = wishlist[0].toJSON();

          const wishlistProduct = await Product_wishlist.findOrCreate({
            where: {
              product_id: productId,
              wishlist_id: wishlistInfo.wishlist_id,
            },
            transaction: trans,
            lock: true,
            skipLocked: true,
          });

          const commitTrans = await trans.commit();

          return true;
        } else {
          throw new Error("Did not Found The Product", {
            cause: "not found",
          });
        }
      } catch (e: any) {
        await trans.rollback();
        if (e.cause == "not found") {
          throw new Error(e.message, { cause: e.cause });
        } else throw new Error(e.message);
      }
    } catch (e: any) {
      if (e.cause == "not found") {
        throw new Error(e.message, { cause: e.cause });
      } else throw new Error(e.message);
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

  async increaseProductInCart(
    productId: number,
    quantity: number,
    userId: number
  ) {
    try {
      const trans = await sequelizeConnection.sequelize.transaction();
      try {
        const cart = await Cart.findOne({
          where: { normal_uid: userId },
          transaction: trans,
          lock: true,
        });

        const cartProduct = await Product_cart.findOne({
          where: {
            product_id: productId,
            cart_id: cart.cart_id,
          },

          transaction: trans,
          lock: true,
          skipLocked: true,
        });
        const instance = CProduct.getInstance();

        const data = await instance.checkProductExists(
          productId,
          trans,
          cartProduct.quantity + quantity
        );

        if (data) {
          cartProduct.increment("quantity", { by: quantity });
          const commitTrans = await trans.commit();
          const dataToReturn = {
            product_id: productId,
            quantity: cartProduct.quantity + quantity,
          };
          return dataToReturn;
        } else {
          throw new Error(
            "Did not Found Product for the Quantity that you requested",
            {
              cause: "not found",
            }
          );
        }
      } catch (e: any) {
        await trans.rollback();
        if (e.cause == "not found") {
          throw new Error(e.message, { cause: e.cause });
        } else throw new Error(e.message);
      }
    } catch (e: any) {
      if (e.cause == "not found") {
        throw new Error(e.message, { cause: e.cause });
      } else throw new Error(e.message);
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
        const data = await instance.checkProductExists(
          productId,
          trans,
          quantity
        );
        if (data) {
          const cart = await Cart.findOrCreate({
            where: { normal_uid: userId },
            transaction: trans,
            lock: true,
          });

          const cartInfo = cart[0].toJSON();

          const cartProduct = await Product_cart.findOrCreate({
            where: {
              product_id: productId,
              cart_id: cartInfo.cart_id,
            },
            defaults: {
              quantity: quantity,
            },
            transaction: trans,
            lock: true,
            skipLocked: true,
          });
          const commitTrans = await trans.commit();

          return true;
        } else {
          throw new Error(
            "Did not Found Product for the Quantity that you requested",
            {
              cause: "not found",
            }
          );
        }
      } catch (e: any) {
        await trans.rollback();

        if (e.cause == "not found") {
          throw new Error(e.message, { cause: e.cause });
        } else throw new Error(e.message);
      }
    } catch (e: any) {
      if (e.cause == "not found") {
        throw new Error(e.message, { cause: e.cause });
      } else throw new Error(e.message);
    }
  }

  async deleteFromCart(
    productId: number | number[],
    cartId: number,
    trans: any
  ) {
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
          quantity: { [Op.gte]: quantity },
        },
        transaction: trans,
      });
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async removeFromCart(
    productId: number,
    userId: number,
    quantity?: number
  ): Promise<boolean> {
    try {
      const trans = await sequelizeConnection.sequelize.transaction();
      try {
        const value = await this.decreaseOrDeleteFromCart(
          productId,
          "delete",
          userId,
          trans
        );
        const commitTrans = await trans.commit();

        return value;
      } catch (error: any) {
        await trans.rollback();

        throw new Error(error.message);
      }
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async decreaseQuantityProductFromCart(
    productId: number,
    userId: number,
    quantity?: number
  ): Promise<boolean> {
    try {
      const trans = await sequelizeConnection.sequelize.transaction();
      try {
        const value = await this.decreaseOrDeleteFromCart(
          productId,
          "decrease",
          userId,
          trans,
          quantity
        );
        const commitTrans = await trans.commit();

        return value;
      } catch (error: any) {
        await trans.rollback();

        throw new Error(error.message);
      }
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async decreaseOrDeleteFromCart(
    productId: number | number[],
    optionType: string,
    userId: number,
    trans: any,
    quantity?: number
  ): Promise<boolean> {
    try {
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
              productId as number,
              cartInfo.cart_id,
              quantity,
              trans
            );
          }

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

      try {
        await Promise.all([updateUserData, updateNormalUserInfo]);
        const updatedUserData = await Normal_User.findByPk(userId, {
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
          transaction: trans,
        });
        const commitTrans = await trans.commit();
        return updatedUserData;
      } catch (error: any) {
        console.error(error);
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

      const image = await Image.findOrCreate({
        where: { normal_uid: userId },
        defaults: {
          normal_uid: userId,
          name: imageFile[0].originalname,
          url: url.res,
        },
      });
      return url.res;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async deleteUserImage(userId: number): Promise<boolean> {
    try {
      const image = await Image.destroy({
        where: { normal_uid: userId },
      });
      return true;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
  async getUserOrders(userId: number, orderStatus: number) {
    const orders = await Order.findAll({
      where: {
        normal_uid: userId,
        status: orderStatus,
      },
      attributes: [
        "date",
        "order_id",
        "total_price",
        "status",
        "payment_status",
      ],
    });

    return orders;
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

  async addOrderAddress(
    data: Partial<IAddress>,
    userId: number
  ): Promise<number> {
    try {
      if (data.phone_number) {
        data.phone_number = parseInt(
          data.phone_number.toString().replace(/[()\s]/g, ""),
          10
        );
      }

      const addedAddress = await Address.create({
        email: data.email,
        first_name: data.first_name,
        last_name: data.last_name,
        location: data.location,
        phone_number: data.phone_number,
        normal_uid: userId,
      });
      return addedAddress.toJSON().address_id;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async getProductIDAndInfoInCart(
    userId: number,
    trans: any
  ): Promise<IOrder_item[]> {
    try {
      const data = await Product_cart.findAll({
        attributes: [
          "product_id",
          "quantity",
          "cart.normal_uid",
          "product.name",
          "product.sub_title",
          "product.price",
          [
            Sequelize.fn(
              "COALESCE",
              Sequelize.fn(
                "SUM",
                Sequelize.fn(
                  "DISTINCT",
                  Sequelize.col("product.discount.value")
                )
              ),
              0
            ),
            "discount_value",
          ],
        ],
        raw: true,
        subQuery: false,
        include: [
          {
            model: Cart,
            attributes: [],
            where: {
              normal_uid: userId,
            },
          },
          {
            model: Product,
            attributes: [],
            include: [
              {
                model: Discount,
                required: false,
                as: "discount",
                attributes: [],
                through: {
                  attributes: [],
                },
                subQuery: false,
              },
            ],
          },
        ],
        transaction: trans,
        lock: true,
        group: ["product_id", "quantity"],
      });
      if (data.length !== 0) {
        return data as any;
      } else {
        throw new Error("There is no product in your cart", {
          cause: "empty-data-cart",
        });
      }
    } catch (error: any) {
      throw new Error(error.message, { cause: error.cause ? error.cause : "" });
    }
  }

  async createUserOrderItems(
    productsInfo: object[],
    trans: any
  ): Promise<object[]> {
    try {
      const addedOrderItems = await Order_item.bulkCreate(productsInfo, {
        transaction: trans,
      });
      for (const item of addedOrderItems) {
        const orderItemImages = await Image.update(
          { order_item_id: item.order_item_id },
          {
            where: { [Op.and]: [{ type: 1 }, { product_id: item.product_id }] },
            transaction: trans,
          }
        );
      }
      return addedOrderItems;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async getSingleAddressInfo(addressId: number) {
    try {
      const addressInfo = await Address.findByPk(addressId, {
        attributes: [
          "first_name",
          "last_name",
          "location",
          "email",
          "phone_number",
        ],
      });
      if (addressInfo) {
        return addressInfo.toJSON();
      }
      throw new Error("Address not found", { cause: "address_not_found" });
    } catch (error: any) {
      throw new Error(error.message, { cause: error.cause ? error.cause : "" });
    }
  }

  async createOrder(
    userId: number,
    addressId: number,
    paymentType: string,
    TotalPrice: number,
    trans: any
  ): Promise<IOrder> {
    try {
      const addressInfo = await this.getSingleAddressInfo(addressId);
      const dataOrder = {
        normal_uid: userId,
        address_id: addressId,
        payment_status: true,
        payment_type: paymentType,
        total_price: TotalPrice,
        status: 1,
        ...addressInfo,
      };

      const order = await Order.create(dataOrder, { transaction: trans });
      return order;
    } catch (error: any) {
      throw new Error(error.message, { cause: error.cause ? error.cause : "" });
    }
  }

  async orderCheckOut(userId: number, addressId: number, paymentType: string) {
    try {
      const trans = await sequelizeConnection.sequelize.transaction();
      try {
        let productsInfo = await this.getProductIDAndInfoInCart(userId, trans);
        const instance = CProduct.getInstance();
        productsInfo.forEach((product) => {
          product.price =
            product.price - (product.price * product.discount_value) / 100;
        });
        const productIds = productsInfo.map((product) => product.product_id);
        const productQuantity = productsInfo.map((product) => product.quantity);

        const productInfoAfterEdit = await instance.decreaseProductAmount(
          productIds,
          productQuantity,
          trans
        );
        const acceptedProductIds = productInfoAfterEdit.map(
          (product) => product.product_id
        );

        const acceptedProduct = productsInfo.filter((product) =>
          acceptedProductIds.includes(product.product_id)
        );

        const totalPrice = acceptedProduct.reduce(
          (a, b) => a + b.price * b.quantity,
          0
        );

        const order = await this.createOrder(
          userId,
          addressId,
          paymentType,
          totalPrice,
          trans
        );
        acceptedProduct.forEach(
          (product) => (product.order_id = order.order_id)
        );

        const orderItemInfo = await this.createUserOrderItems(
          acceptedProduct,
          trans
        );
        const value = await this.decreaseOrDeleteFromCart(
          acceptedProductIds,
          "delete",
          userId,
          trans
        );

        const commitTrans = await trans.commit();
        let dataToReturn = Object(order);

        dataToReturn = dataToReturn.toJSON();
        delete dataToReturn.normal_uid;
        delete dataToReturn.address_id;
        dataToReturn.status = "processing";
        return dataToReturn;
      } catch (error: any) {
        await trans.rollback();
        throw new Error(error.message, {
          cause: error.cause ? error.cause : "",
        });
      }
    } catch (error: any) {
      throw new Error(error.message, { cause: error.cause ? error.cause : "" });
    }
  }

  async getUserAddresses(userId: number) {
    try {
      const userAddresses = await Address.findAll({
        where: { normal_uid: userId },
        attributes: { exclude: ["normal_uid"] },
      });
      return userAddresses;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async addUserReview(data: Partial<IRating>, userId: number) {
    try {
      const addReview = await Rating.findOrCreate({
        defaults: {
          normal_uid: userId,
          product_id: data.product_id,
          comment: data.comment,
          rating_value: data.rating_value,
        },
        where: {
          [Op.and]: [{ normal_uid: userId }, { product_id: data.product_id }],
        },
      });
      const dataToReturn = addReview[0].toJSON();
      delete dataToReturn.normal_uid;
      delete dataToReturn.rating_id;
      return dataToReturn;
    } catch (error: any) {
      console.error(error);
      if (error.name === "SequelizeForeignKeyConstraintError") {
        throw new Error("product not found", { cause: "not_found" });
      } else throw new Error(error.message);
    }
  }

  async getUserInfo(userId: number) {
    try {
      const data = await Normal_User.findByPk(userId, {
        subQuery: false,
        attributes: [
          "user.first_name",
          [Sequelize.col("user.first_name"), "first_name"],
          [Sequelize.col("user.last_name"), "last_name"],

          [Sequelize.col("user.email"), "email"],

          "user.email",
          "phone_number",
          "date_of_birth",
        ],

        include: [{ subQuery: false, model: User, attributes: [] }],
      });
      return data.toJSON();
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async getReviews(userId: number) {
    try {
      const data = await Rating.findAll({
        attributes: ["rating_id", "comment", "rating_value"],
        where: { normal_uid: userId },
      });
      return data;
    } catch (error: any) {}
  }


}
