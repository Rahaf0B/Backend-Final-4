import { Op } from "sequelize";
import Product from "../models/Product";
import { Sequelize } from "sequelize-typescript";
import { IProduct } from "../interfaces/objInterfaces";
import sequelizeConnection from "../conections/sequelizeConnection";
import Image from "../models/Image";
import Product_wishlist from "../models/product_wishlist";
import Wishlist from "../models/Wishlist";

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
    userId?: number,
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
        offset: pageNumber === 0 ? 0 : (pageNumber - 1) * numberOFItems,
        limit: pageNumber === 0 ? 4 : numberOFItems,
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

            attributes: ["image_id", "name", "url"],
            where: { type: { [Op.eq]: 1 } },
          },
          {
            model: Product_wishlist,
            required: false,

           include: [
{model: Wishlist, required: false, where:{normal_uid:userId ? 0 : userId}},
           ]
            
          },
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
      console.log(e);
      throw new Error(e.message);
    }
  }
}
