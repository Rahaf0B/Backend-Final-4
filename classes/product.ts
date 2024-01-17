import { Op } from "sequelize";
import Product from "../models/Product";
import { Sequelize } from "sequelize-typescript";
import { IBrand, IProduct } from "../interfaces/objInterfaces";
import sequelizeConnection from "../conections/sequelizeConnection";
import Image from "../models/Image";
import Product_wishlist from "../models/product_wishlist";
import Wishlist from "../models/Wishlist";
import Rating from "../models/Rating";
import Discount from "../models/Discount";
import { appCache, getCacheValue } from "../appCache";
import Brand from "../models/Brand";

export default class CProduct {
  private static instance: CProduct;

  private constructor() {}

  public static getInstance(): CProduct {
    if (CProduct.instance) {
      return CProduct.instance;
    }
    CProduct.instance = new CProduct();
    return CProduct.instance;
  }

  async getProductCount(conditionKey: string, conditionValue: string | number) {
    try {
      const countData = await Product.count({
        where: {
          [conditionKey]: conditionValue,
        },
      });
      return countData;
    } catch (e: any) {
      throw new Error(e.message);
    }
  }

  async filterProductByCoB(
    pageNumber: number,
    numberOfItems: number,
    userId: number,
    conditionKey: string,
    conditionValue: string | number
  ) {
    const countData = this.getProductCount(conditionKey, conditionValue);
    const data = Product.findAll({
      subQuery: false,
      offset: (pageNumber - 1) * numberOfItems,
      limit: numberOfItems,
      attributes: ["product_id", "name", "sub_title", "price"],
      where: {
        [conditionKey]: conditionValue,
      },
      include: [
        {
          model: Image,
          required: false,
          nested: true,
          attributes: ["image_id", "name", "url"],
          where: { type: { [Op.eq]: 1 } },
          subQuery: false,
        },

        {
          model: Wishlist,
          required: false,
          attributes: [
            [
              Sequelize.fn(
                "SUM",
                Sequelize.literal(
                  `DISTINCT CASE WHEN wishlist.normal_uid = ${
                    userId ? userId : 0
                  } THEN 1 ELSE 0 END`
                )
              ),
              "is_liked",
            ],
          ],
          subQuery: false,
        },
        {
          model: Rating,
          required: false,
          attributes: [
            [
              Sequelize.fn("COUNT", Sequelize.col("rating.product_id")),
              "number_of_ratings",
            ],
            [Sequelize.fn("AVG", Sequelize.col("rating.value")), "ratings"],
          ],
          subQuery: false,
        },
        {
          model: Discount,
          required: false,
          attributes: [
            [
              Sequelize.fn("SUM", Sequelize.col("discount.value")),
              "discount_value",
            ],
          ],
          subQuery: false,
        },
      ],
      group: [
        "product_id",
        "wishlist.wishlist_id",
        "rating.rating_id",
        "discount.discount_id",
      ],
      order: [["product_id", "DESC"]],
    });
    try {
      const [products, count] = await Promise.all([data, countData]);
      return [products, count];
    } catch (e: any) {
      throw new Error(e.message);
    }
  }

  async getNewArrival(
    pageNumber: number,
    numberOfItems: number,
    userId?: number
  ): Promise<[IProduct[], number]> {
    const created_at = new Date().setMonth(new Date().getMonth() - 3);
    const countData = Product.count({
      where: {
        [Op.and]: [
          Sequelize.where(
            Sequelize.fn("date", Sequelize.col("created_at")),
            ">=",
            new Date(created_at).toISOString().split("T")[0]
          ),
          Sequelize.where(
            Sequelize.fn("date", Sequelize.col("created_at")),
            "<=",
            new Date().toISOString().split("T")[0]
          ),
        ],
      },
    });
    const data = Product.findAll({
      subQuery: false,
      offset: pageNumber === 0 ? 0 : (pageNumber - 1) * numberOfItems,
      limit: pageNumber === 0 ? 4 : numberOfItems,
      attributes: ["product_id", "name", "sub_title", "price"],
      where: {
        [Op.and]: [
          Sequelize.where(
            Sequelize.fn("date", Sequelize.col("created_at")),
            ">=",
            new Date(created_at).toISOString().split("T")[0]
          ),
          Sequelize.where(
            Sequelize.fn("date", Sequelize.col("created_at")),
            "<=",
            new Date().toISOString().split("T")[0]
          ),
        ],
      },
      include: [
        {
          model: Image,
          required: false,
          nested: true,
          attributes: ["image_id", "name", "url"],
          where: { type: { [Op.eq]: 1 } },
          subQuery: false,
        },

        {
          model: Wishlist,
          required: false,
          attributes: [
            [
              Sequelize.fn(
                "SUM",
                Sequelize.literal(
                  `DISTINCT CASE WHEN wishlist.normal_uid = ${
                    userId ? userId : 0
                  } THEN 1 ELSE 0 END`
                )
              ),
              "is_liked",
            ],
          ],
          subQuery: false,
        },
        {
          model: Rating,
          required: false,
          attributes: [
            [
              Sequelize.fn("COUNT", Sequelize.col("rating.product_id")),
              "number_of_ratings",
            ],
            [Sequelize.fn("AVG", Sequelize.col("rating.value")), "ratings"],
          ],
          subQuery: false,
        },
        {
          model: Discount,
          required: false,
          attributes: [
            [
              Sequelize.fn("SUM", Sequelize.col("discount.value")),
              "discount_value",
            ],
          ],
          subQuery: false,
        },
      ],
      group: [
        "product_id",
        "wishlist.wishlist_id",
        "rating.rating_id",
        "discount.discount_id",
      ],
      order: [["product_id", "DESC"]],
    });
    try {
      const [products, count] = await Promise.all([data, countData]);
      return [products, count];
    } catch (e: any) {
      throw new Error(e.message);
    }
  }

  getDataValues(data: any[]) {
    const dataValues = data.map((instance) => instance.dataValues);
    return dataValues;
  }

  async getBrands(): Promise<IBrand[]> {
    try {
      let data;
      data = getCacheValue("Brands") as IBrand[];
      if (data) {
        return data;
      }
      data = await Brand.findAll({
        attributes: { exclude: ["discount_id"] },
        include: [
          {
            model: Image,
            required: false,
            nested: true,
            attributes: ["image_id", "name", "url"],
            subQuery: false,
          },
        ],
      });

      appCache.set("Brands", this.getDataValues(data));

      return data;
    } catch (e: any) {
      throw new Error(e.message);
    }
  }
}
