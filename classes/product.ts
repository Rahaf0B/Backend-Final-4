import { Op } from "sequelize";
import Product from "../models/Product";
import { Sequelize } from "sequelize-typescript";
import { IProduct } from "../interfaces/objInterfaces";
import sequelizeConnection from "../conections/sequelizeConnection";
import Image from "../models/Image";
import Product_wishlist from "../models/product_wishlist";
import Wishlist from "../models/Wishlist";
import Rating from "../models/Rating";
import Discount from "../models/Discount";

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

  async getNewArrival(
    pageNumber: number,
    numberOFItems: number,
    userId?: number
  ): Promise<[IProduct[], number]> {
    try {
      const trans = await sequelizeConnection.sequelize.transaction();

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
        transaction: trans,
      });
      const data = Product.findAll({
        subQuery: false,
        offset: pageNumber === 0 ? 0 : (pageNumber - 1) * numberOFItems,
        limit: pageNumber === 0 ? 4 : numberOFItems,
        attributes: [
          "product_id",
          "name",
          "sub_title",
          "price",
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
          [
            Sequelize.fn("COUNT", Sequelize.col("rating.product_id")),
            "number_of_ratings",
          ],
          [
            Sequelize.fn("AVG", Sequelize.col("rating.value")),
            "ratings",
          ],
          [
            Sequelize.fn("SUM", Sequelize.col("discount.value")),
            "discount_value",
          ],
        ],
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
            where: { type: { [Op.eq]: 1 
            },   },
            subQuery: false
          },

          { model: Wishlist, required: false, attributes: [], subQuery: false },
          { model: Rating, required: false, attributes: [], subQuery: false },
          {model:Discount,required: false, attributes:[],subQuery: false  }
        ],
        group: [
          "product_id",
          "image_id",
          "wishlist.product_wishlist.wishlist_id","discount.product_discount.discount_id"
        ], 

        transaction: trans,
      });
      try {
        const [products, count] = await Promise.all([data, countData]);
        return [products, count];
      } catch (e: any) {
        throw new Error(e.message);
      }
    } catch (e: any) {
      throw new Error(e.message);
    }
  }
}
