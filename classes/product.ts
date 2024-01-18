import { Op, where } from "sequelize";
import Product from "../models/Product";
import { Sequelize } from "sequelize-typescript";
import { IBrand, ICategory, IProduct } from "../interfaces/objInterfaces";
import sequelizeConnection from "../conections/sequelizeConnection";
import Image from "../models/Image";
import Product_wishlist from "../models/product_wishlist";
import Wishlist from "../models/Wishlist";
import Rating from "../models/Rating";
import Discount from "../models/Discount";
import { appCache, getCacheValue } from "../appCache";
import Brand from "../models/Brand";
import Category from "../models/Category";
import uFuzzy from "@leeoniya/ufuzzy";
import FuzzySearch from "fuzzy-search";

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

  async getProductCount(  categoryId: number=0,
    brandId: number=0) {
    try {
      const countData = await Product.count({
        where: {
          [Op.or]:[
            {"category_id": categoryId},{
              "brand_id": brandId
            }
          ]
        },
      });
      return countData;
    } catch (e: any) {
      throw new Error(e.message);
    }
  }

  async filterProductByCoB(
    pageNumber: number=1,
    numberOfItems: number=5,
    userId?: number,
    categoryId: number=0,
    brandId: number=0
  ) {
    const countData = this.getProductCount(categoryId, brandId);
    const data = Product.findAll({
      subQuery: false,
      offset: (pageNumber - 1) * numberOfItems,
      limit: numberOfItems,
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
        [Sequelize.fn("AVG", Sequelize.col("rating.value")), "ratings"],
        [
          Sequelize.fn("SUM", Sequelize.col("discount.value")),
          "discount_value",
        ],
      ],
      where: {
        [Op.or]:[
          {"category_id": categoryId},{
            "brand_id": brandId
          }
        ]
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
          attributes: [],
          subQuery: false,
        },
        {
          model: Rating,
          required: false,
          attributes: [],
          subQuery: false,
        },
        {
          model: Discount,
          required: false,
          attributes: [],
          subQuery: false,
        },
      ],
      group: [
        "product_id",
        "image_id",
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
        [Sequelize.fn("AVG", Sequelize.col("rating.value")), "ratings"],
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
          where: { type: { [Op.eq]: 1 } },
          subQuery: false,
        },

        {
          model: Wishlist,
          required: false,
          attributes: [],
          subQuery: false,
        },
        {
          model: Rating,
          required: false,
          attributes: [],
          subQuery: false,
        },
        {
          model: Discount,
          required: false,
          attributes: [],
          subQuery: false,
        },
      ],
      group: [
        "product_id",
        "image_id",
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

  async getCategory(): Promise<ICategory[]> {
    try {
      let data;
      data = getCacheValue("Categories") as ICategory[];
      if (data) {
        return data;
      }
      data = await Category.findAll({
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

      appCache.set("Categories", this.getDataValues(data));

      return data;
    } catch (e: any) {
      throw new Error(e.message);
    }
  }
  async searchThroughCategoryBrandNames(
    name: string
  ): Promise<[number[], number[]]> {
    const categoryInfo = this.getCategory();
    const brandInfo = this.getBrands();

    try {
      const [category, brand] = await Promise.all([categoryInfo, brandInfo]);
      const categoryAndBrandInfo = category.concat(brand);

      const search = new FuzzySearch(categoryAndBrandInfo, ["name"], {});

      const result = search.search(name);
      const categoryId = result.map((instance) =>
        instance.category_id ? instance.category_id : 0
      );

      const brandId = result.map((instance) =>
        instance.brand_id ? instance.brand_id : 0
      );
      return [categoryId, brandId];
    } catch (e: any) {
      throw new Error(e);
    }
  }

  async search(
    searchString: string,
    pageNumber: number,
    numberOfItems: number,
    userId?: number
  ) {
    try {
      const [categoryId, brandId] = await this.searchThroughCategoryBrandNames(
        searchString
      );

      try {
        const data = Product.findAll({
          subQuery: false,
          offset: (pageNumber - 1) * numberOfItems,
          limit: numberOfItems,
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
            [Sequelize.fn("AVG", Sequelize.col("rating.value")), "ratings"],
            [
              Sequelize.fn("SUM", Sequelize.col("discount.value")),
              "discount_value",
            ],
          ],
          where: {
            [Op.or]: [
              {
                category_id: {
                  [Op.in]: categoryId,
                },
              },

              {
                brand_id: {
                  [Op.in]: brandId,
                },
              },
              Sequelize.literal(
                `MATCH (product.name) AGAINST('${searchString}' IN NATURAL LANGUAGE MODE)`
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
              attributes: [],
              subQuery: false,
            },
            {
              model: Rating,
              required: false,
              attributes: [],
              subQuery: false,
            },
            {
              model: Discount,
              required: false,
              attributes: [],
              subQuery: false,
            },
          ],
          group: [
            "product_id",
            "image_id",
            "wishlist.wishlist_id",
            "rating.rating_id",
            "discount.discount_id",
          ],
          order: [["product_id", "DESC"]],
        });
        return data;
      } catch (error: any) {
        throw new Error(error);
      }
    } catch (error: any) {
      throw new Error(error);
    }
  }



  async getSingleProduct(product_id:number,userId?:number){
try {
  const data = await Product.findByPk(product_id,{
    subQuery: false,
    attributes: [
      "product_id",
      "name",
      "sub_title",
      "price",
      "quantity",
      "description",
      "category_id",
      "brand_id",
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
      [Sequelize.fn("AVG", Sequelize.col("rating.value")), "ratings"],
      [
        Sequelize.fn("SUM", Sequelize.col("discount.value")),
        "discount_value",
      ],
    ],
    include: [
      {
        model: Image,
        required: false,
        nested: true,
        attributes: ["image_id", "name", "url","type"],
        subQuery: false,
      },

      {
        model: Wishlist,
        required: false,
        attributes: [],
        subQuery: false,
      },
      {
        model: Rating,
        required: false,
        attributes: [],
        subQuery: false,
      },
      {
        model: Discount,
        required: false,
        attributes: [],
        subQuery: false,
      },
    ],
    group: [
      "product_id",
      "image_id",
      "wishlist.wishlist_id",
      "rating.rating_id",
      "discount.discount_id",
    ],
    order: [["product_id", "DESC"]],
  });
  return data;
} catch (error:any) {
  throw new Error(error);
}
  }





  async handPickedProducts(
    pageNumber: number=1,
    numberOfItems: number=5,
    userId?: number,
    categoryId: number=0,
  ) {
    const countData = this.getProductCount(categoryId);

    const data = await Product.findAll({
      subQuery: false,
      offset: (pageNumber - 1) * numberOfItems,
      limit: numberOfItems,
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
        [Sequelize.fn("AVG", Sequelize.col("rating.value")), "ratings"],
        [
          Sequelize.fn("SUM", Sequelize.col("discount.value")),
          "discount_value",
        ],
       
      ],
      where: {
        [Op.and]:[
          {"category_id": categoryId},
          {"price": {[Op.lt]:100}},
        ]
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
          attributes: [],
          subQuery: false,
        },
        {
          model: Rating,
          required: false,
          attributes: [],
          subQuery: false,
          
        },
        {
          model: Discount,
          required: false,
          attributes: [],
          subQuery: false,
        },
      ],
      group: [
        "product_id",
        "image_id",
        "wishlist.wishlist_id",
        "rating.rating_id",
        "discount.discount_id",
      ],
      order: [["product_id", "DESC"]],
      having:{"ratings":{[Op.gt]:4.5},
      }
    });
    try {
      const [products, count] = await Promise.all([data, countData]);
      return [products, count];
    } catch (e: any) {
      throw new Error(e.message);
    }
  }



}
