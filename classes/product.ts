import { Op, where } from "sequelize";
import Product from "../models/Product";
import { Sequelize } from "sequelize-typescript";
import {
  IBrand,
  ICategory,
  IDiscount,
  IImage,
  IProduct,
} from "../interfaces/objInterfaces";
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
import Normal_User from "../models/Normal_user";
import User from "../models/User";
import product_wishlist from "../models/product_wishlist";
import Product_cart from "../models/Product_cart";
import Cart from "../models/Cart";
import Order_item from "../models/Order_item";
import Order from "../models/Order";
import Address from "../models/Address";
import Product_discount from "../models/Product_discount";
import { cloudinaryImageUploadMethod } from "../middleware/imageuploader";

export default class CProduct {
  private static instance: CProduct;
  private countProductRating = Sequelize.fn(
    "COUNT",
    Sequelize.fn("DISTINCT", Sequelize.col("rating.rating_id"))
  );

  private avgProductRating = Sequelize.fn(
    "AVG",
    Sequelize.col("rating.rating_value")
  );
  private discountProduct = Sequelize.fn(
    "COALESCE",
    Sequelize.fn(
      "SUM",
      Sequelize.fn("DISTINCT", Sequelize.col("discount.value"))
    ),
    0
  );

  private constructor() {}

  public static getInstance(): CProduct {
    if (CProduct.instance) {
      return CProduct.instance;
    }
    CProduct.instance = new CProduct();
    return CProduct.instance;
  }

  async getProductCount(categoryId: number = 0, brandId: number = 0) {
    try {
      const countData = await Product.count({
        distinct: true,
        where: {
          [Op.or]: [
            { category_id: categoryId },
            {
              brand_id: brandId,
            },
          ],
        },
      });
      return countData;
    } catch (e: any) {
      throw new Error(e.message);
    }
  }

  async filterProductByCoB(
    pageNumber: number = 1,
    numberOfItems: number = 5,
    userId?: number,
    categoryId: number = 0,
    brandId: number = 0
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
        "quantity",
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

        [this.countProductRating, "number_of_ratings"],
        [this.avgProductRating, "ratings"],
        [this.discountProduct, "discount_value"],
      ],
      where: {
        [Op.or]: [
          { category_id: categoryId },
          {
            brand_id: brandId,
          },
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
          where: { normal_uid: userId },
          through: {
            attributes: [],
          },
        },
        {
          model: Rating,
          attributes: [],
          required: false,
          subQuery: false,
        },
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
      group: ["product_id", "image_id"],
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
  ): Promise<(number | Product[])[]> {
    const created_at = new Date().setMonth(new Date().getMonth() - 3);
    const countData = Product.count({
      distinct: true,
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
        "quantity",
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
        [this.countProductRating, "number_of_ratings"],
        [this.avgProductRating, "ratings"],
        [this.discountProduct, "discount_value"],
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
          where: { normal_uid: userId },
          through: {
            attributes: [],
          },
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
          as: "discount",
          attributes: [],
          through: {
            attributes: [],
          },
          subQuery: false,
        },
      ],
      group: ["product_id", "image_id"],

      order: [["product_id", "DESC"]],
    });
    try {
      const [products, count] = await Promise.all([data, countData]);
      return [products, count];
    } catch (e: any) {
      throw new Error(e.message);
    }
  }

  getDataValues(data: any[]): any[] {
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
  async searchThroughCategoryBrandNames(name: string): Promise<number[][]> {
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
  async countSearchResults(
    searchString: string,
    categoryId: number[],
    brandId: number[]
  ): Promise<number> {
    try {
      const count = await Product.count({
        distinct: true,
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
              `MATCH (Product.name) AGAINST('${searchString}' IN NATURAL LANGUAGE MODE)`
            ),
          ],
        },
      });
      return count;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
  async search(
    searchString: string,
    pageNumber: number,
    numberOfItems: number,
    userId?: number
  ): Promise<(number | Product[])[]> {
    try {
      const [categoryId, brandId] = await this.searchThroughCategoryBrandNames(
        searchString
      );

      const countData = this.countSearchResults(
        searchString,
        categoryId,
        brandId
      );
      const data = Product.findAll({
        subQuery: false,
        offset: (pageNumber - 1) * numberOfItems,
        limit: numberOfItems,
        attributes: [
          "product_id",
          "name",
          "sub_title",
          "price",
          "quantity",
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
          [this.countProductRating, "number_of_ratings"],
          [this.avgProductRating, "ratings"],
          [this.discountProduct, "discount_value"],
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
              `MATCH (Product.name) AGAINST('${searchString}' IN NATURAL LANGUAGE MODE)`
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
            where: { normal_uid: userId },
            through: {
              attributes: [],
            },
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
            as: "discount",
            attributes: [],
            through: {
              attributes: [],
            },
            subQuery: false,
          },
        ],
        group: ["product_id", "image_id"],

        order: [["product_id", "DESC"]],
      });
      try {
        const [products, count] = await Promise.all([data, countData]);
        return [products, count];
      } catch (error: any) {
        throw new Error(error);
      }
    } catch (error: any) {
      throw new Error(error);
    }
  }

  async getSingleProduct(
    product_id: number,
    userId?: number
  ): Promise<Product> {
    try {
      const data = await Product.findByPk(product_id, {
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
          [this.countProductRating, "number_of_ratings"],
          [this.avgProductRating, "ratings"],
          [this.discountProduct, "discount_value"],
        ],
        include: [
          {
            model: Image,
            required: false,
            nested: true,
            attributes: ["image_id", "name", "url", "type"],
            subQuery: false,
          },

          {
            model: Wishlist,
            required: false,
            attributes: [],
            subQuery: false,
            where: { normal_uid: userId },
            through: {
              attributes: [],
            },
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
            as: "discount",
            attributes: [],
            through: {
              attributes: [],
            },
            subQuery: false,
          },
        ],
        group: ["product_id", "image_id"],
        order: [["product_id", "DESC"]],
      });
      return data;
    } catch (error: any) {
      throw new Error(error);
    }
  }

  async getHandPickedProductCount(categoryId: number = 0): Promise<number> {
    try {
      const countData = await sequelizeConnection.sequelize.query(
        `select count(prod.product_id)from  (SELECT AVG(rating_value) as ra_val ,product.product_id FROM rating JOIN product ON rating.product_id = product.product_id WHERE rating.product_id = product.product_id and product.price<100 and product.category_id=${categoryId} group by product.product_id) as prod where prod.ra_val > 4.5;`
      );
      return Object.values(countData[0][0])[0];
    } catch (e: any) {
      throw new Error(e.message);
    }
  }

  async handPickedProducts(
    pageNumber: number = 1,
    numberOfItems: number = 5,
    userId?: number,
    categoryId: number = 0
  ): Promise<(number | Product[])[]> {
    const countData = this.getHandPickedProductCount(categoryId);

    const data = await Product.findAll({
      subQuery: false,
      offset: (pageNumber - 1) * numberOfItems,
      limit: numberOfItems,
      attributes: [
        "product_id",
        "name",
        "sub_title",
        "price",
        "quantity",
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
        [this.countProductRating, "number_of_ratings"],
        [this.avgProductRating, "ratings"],
        [this.discountProduct, "discount_value"],
      ],
      where: {
        [Op.and]: [{ category_id: categoryId }, { price: { [Op.lt]: 100 } }],
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
          where: { normal_uid: userId },
          through: {
            attributes: [],
          },
        },
        {
          model: Rating,
          attributes: [],
          subQuery: false,
          required: true,
        },
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
      group: ["product_id", "image_id"],
      order: [["product_id", "DESC"]],
      having: { ratings: { [Op.gt]: 4.5 } },
    });
    try {
      const [products, count] = await Promise.all([data, countData]);
      return [products, count];
    } catch (e: any) {
      throw new Error(e.message);
    }
  }
  async countPopularAndDiscountProducts(
    filterType: string,
    value?: number
  ): Promise<number> {
    try {
      const avgRating = Sequelize.fn("AVG", Sequelize.col("rating"));

      let count;
      if (filterType == "rating") {
        count = await sequelizeConnection.sequelize.query(
          `select   count(k.ra) from  (select count(DISTINCT product_id) as ra ,product_id from rating group by product_id having AVG(rating.rating_value) >= ${value}) as k;`
        );
      }
      if (filterType == "discount") {
        count = await sequelizeConnection.sequelize.query(
          `SELECT Count(DISTINCT k.product_id) from(select COALESCE(SUM(discount.value), 0) as s ,product.product_id FROM product_discount JOIN discount ON product_discount.discount_id = discount.discount_id JOIN product ON product_discount.product_id = product.product_id where product_discount.product_id = product.product_id group by product.product_id) as k where k.s >=${value};`
        );
      }
      if (filterType == "limited") {
        count = await sequelizeConnection.sequelize.query(
          `select count(DISTINCT product_id) from product where quantity<${value}`
        );
      }

      return Object.values(count[0][0])[0];
    } catch (err: any) {
      throw new Error(err.message);
    }
  }

  async popularAndDiscountProducts(
    pageNumber: number = 1,
    numberOfItems: number = 5,
    filterType: string,
    userId?: number,
    value: number = 0
  ): Promise<(number | Product[])[]> {
    const countData = this.countPopularAndDiscountProducts(filterType, value);
    const data = Product.findAll({
      subQuery: false,
      offset: (pageNumber - 1) * numberOfItems,
      limit: numberOfItems,
      attributes: [
        "product_id",
        "name",
        "sub_title",
        "price",
        "quantity",
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
        [this.countProductRating, "number_of_ratings"],
        [this.avgProductRating, "ratings"],
        [this.discountProduct, "discount_value"],
      ],

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
          where: { normal_uid: userId },
          through: {
            attributes: [],
          },
        },
        {
          model: Rating,
          required: filterType == "rating" ? false : true,
          attributes: [],
          subQuery: false,
        },
        {
          model: Discount,
          required: filterType == "discount" ? true : false,
          attributes: [],
          subQuery: false,
          through: {
            attributes: [],
          },
          as: "discount",
        },
      ],
      group: ["product_id", "image_id"],
      order: [["product_id", "DESC"]],
      having:
        filterType == "discount"
          ? { discount_value: { [Op.gte]: value } }
          : filterType == "rating"
          ? { ratings: { [Op.gte]: value } }
          : null,
    });
    try {
      const [products, count] = await Promise.all([data, countData]);
      return [products, count];
    } catch (e: any) {
      throw new Error(e.message);
    }
  }

  async limitedEditionProducts(
    pageNumber: number = 1,
    numberOfItems: number = 5,
    userId?: number
  ) {
    const countData = this.countPopularAndDiscountProducts("limited", 20);

    const data = await Product.findAll({
      subQuery: false,
      offset: (pageNumber - 1) * numberOfItems,
      limit: numberOfItems,
      attributes: [
        "product_id",
        "name",
        "sub_title",
        "price",
        "quantity",
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
        [this.countProductRating, "number_of_ratings"],
        [this.avgProductRating, "ratings"],
        [this.discountProduct, "discount_value"],
      ],
      where: {
        quantity: { [Op.lt]: 20 },
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
          where: { normal_uid: userId },
          through: {
            attributes: [],
          },
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
          as: "discount",
          attributes: [],
          through: {
            attributes: [],
          },
          subQuery: false,
        },
      ],
      group: ["product_id", "image_id"],
      order: [["product_id", "DESC"]],
    });
    try {
      const [products, count] = await Promise.all([data, countData]);
      return [products, count];
    } catch (e: any) {
      throw new Error(e.message);
    }
  }

  async checkProductExists(productId: number, trans: any, quantity?: number) {
    try {
      const data = await Product.findOne({
        where: {
          [Op.and]: [
            { product_id: productId },
            quantity ? { quantity: { [Op.gte]: quantity } } : {},
          ],
        },

        transaction: trans,
        lock: true,
      });
      return data.toJSON();
    } catch (e: any) {}
  }

  async getProductCountRating(productId: number) {
    try {
      const data = await Rating.findAll({
        attributes: [
          "rating_value",
          [
            Sequelize.fn("COUNT", Sequelize.col("Rating.rating_value")),
            "countRating",
          ],
        ],
        where: { product_id: productId },
        group: ["rating_value"],
      });
      return data;
    } catch (e: any) {
      throw new Error(e.message);
    }
  }
  async getProductRatings(productId: number) {
    try {
      const countRating = await this.getProductCountRating(productId);

      let ratings = await Rating.findAll({
        where: { product_id: productId },
        attributes: [
          "rating_id",
          "rating_value",
          "comment",
          "date",
          "user.user.first_name",
          "user.user.last_name",
        ],
        raw: true,
        nest: true,
        include: {
          model: Normal_User,
          subQuery: false,
          attributes: [],
          include: [{ subQuery: false, model: User, attributes: [] }],
        },
      });

      return [countRating, ratings];
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async getProductsInWishlist(
    userId: number,
    pageNumber: number,
    numberOfItems: number
  ) {
    const wishlistId = await Wishlist.findOne({
      attributes: ["wishlist_id"],
      where: { normal_uid: userId },
    });
    const data = await product_wishlist.findAll({
      where: { wishlist_id: wishlistId.dataValues.wishlist_id },
    });
    const items_count = data.length;
    const product_id_all = data.map((value) => value.dataValues.product_id);
    const items = await Product.findAll({
      where: {
        product_id: { [Op.in]: product_id_all },
      },
      subQuery: false,
      offset: (pageNumber - 1) * numberOfItems,
      limit: numberOfItems,
      attributes: [
        "product_id",
        "name",
        "sub_title",
        "price",
        "quantity",
        [
          Sequelize.fn(
            "SUM",
            Sequelize.literal(
              ` DISTINCT CASE WHEN wishlist.normal_uid = ${
                userId ? userId : 0
              } THEN 1 ELSE 0 END`
            )
          ),
          "is_liked",
        ],
        [this.countProductRating, "number_of_ratings"],
        [this.avgProductRating, "ratings"],
        [this.discountProduct, "discount_value"],
      ],

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
          where: { normal_uid: userId },
          through: {
            attributes: [],
          },
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
          as: "discount",
          attributes: [],
          through: {
            attributes: [],
          },
          subQuery: false,
        },
      ],
      group: ["product_id", "image_id"],
      order: [["product_id", "DESC"]],
    });
    return [items_count, items];
  }
  async getAllProducts(
    userId: number,
    pageNumber: number,
    numberOfItems: number
  ) {
    const items_count: number = await Product.count({});

    const items = await Product.findAll({
      subQuery: false,
      offset: (pageNumber - 1) * numberOfItems,
      limit: numberOfItems,
      attributes: [
        "product_id",
        "name",
        "sub_title",
        "price",
        "quantity",
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
        [this.countProductRating, "number_of_ratings"],
        [this.avgProductRating, "ratings"],
        [this.discountProduct, "discount_value"],
      ],

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
          where: { normal_uid: userId },
          through: {
            attributes: [],
          },
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
          as: "discount",
          attributes: [],
          through: {
            attributes: [],
          },
          subQuery: false,
        },
      ],
      group: ["product_id", "image_id"],
      order: [["product_id", "DESC"]],
    });
    return [items_count, items];
  }

  async getProductsInCart(userId: number): Promise<Partial<IProduct>[]> {
    const items = await Product.findAll({
      subQuery: false,
      attributes: [
        "product_id",
        "name",
        "sub_title",
        "price",
        "quantity",
        [Sequelize.col("product_cart.quantity"), "cart_quantity"],
        [
          Sequelize.fn(
            "SUM",
            Sequelize.literal(
              ` DISTINCT CASE WHEN wishlist.normal_uid = ${
                userId ? userId : 0
              } THEN 1 ELSE 0 END`
            )
          ),
          "is_liked",
        ],
        [this.discountProduct, "discount_value"],
      ],
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
          where: { normal_uid: userId },
          through: {
            attributes: [],
          },
        },
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
        {
          model: Product_cart,
          include: [
            {
              model: Cart,
              where: { normal_uid: userId },
              attributes: [],
              required: true,
            },
          ],
          required: true,
          attributes: [],
        },
      ],
      group: ["product_id", "image_id", "product_cart.cart_id"],
      order: [["product_id", "DESC"]],
    });
    return items;
  }
  async getorderItems(orderId: number) {
    const orderInfo = await Order.findAll({
      where: { order_id: orderId },
      subQuery: false,
      attributes: [
        "total_price",
        "payment_type",
        "first_name",
        "last_name",
        "email",
        "phone_number",
        "location",
        [Sequelize.col("address.address_id"), "address_id"],
      ],
      include: [
        {
          model: Address,
          required: false,
          attributes: [],
        },
      ],
    });

    const data = await Order_item.findAll({
      where: { order_id: orderId },
      attributes: [
        "product_id",
        "product_id",
        "quantity",
        "name",
        "price",
        "sub_title",
      ],
      include: [
        {
          model: Image,
          attributes: ["image_id", "name", "url"],
          nested: true,
          subQuery: false,
        },
        {
          model: Order,
          nested: true,
          subQuery: false,
          required: false,
          attributes: [],
        },
      ],
    });

    return [orderInfo, data];
  }

  async decreaseProductAmount(
    productId: number[],
    quantity: number[],
    trans: any
  ): Promise<Partial<IProduct>[]> {
    try {
      let effectedProduct = [];
      for (let i = 0; i < productId.length; i++) {
        const [productDec] = await Product.decrement("quantity", {
          by: quantity[i],
          where: {
            [Op.and]: [
              { product_id: productId[i] },
              { quantity: { [Op.gte]: quantity[i] } },
            ],
          },
          transaction: trans,
        });
        const effectedOrNot = productDec[1] as unknown;
        if (effectedOrNot == 1) {
          const product = await Product.findByPk(productId[i], {
            attributes: ["product_id"],
          });

          effectedProduct.push(product.toJSON());
        }
      }
      if (effectedProduct.length !== 0) {
        return effectedProduct;
      } else {
        throw new Error("All the product in your cart is out of stock", {
          cause: "empty-data-product",
        });
      }
    } catch (error: any) {
      throw new Error(error.message, { cause: error.cause ? error.cause : "" });
    }
  }

  async addProductDiscount(id: any) {
    try {
      const products = await Product.findAll({
        attributes: ["product_id"],
        where: {
          [Op.or]: [
            { brand_id: id.brandId ? id.brandId : 0 },
            { category_id: id.categoryId ? id.categoryId : 0 },
            { product_id: id.productId ? id.productId : 0 },
          ],
        },
      });

      const productId = products.map((value) => {
        return { product_id: value.product_id, discount_id: id.discountId };
      });
      const data = await Product_discount.bulkCreate(productId);
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async addDiscount(dataToAdd: IDiscount) {
    try {
      const data = await Discount.create({
        value: dataToAdd.value,
        type: dataToAdd.type,
      });

      if (dataToAdd.brands) {
      }
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async addImage(image: Partial<IImage>[], imageFile: any) {
    try {
      const urls = [];

      let files: any;
      files = imageFile;
      for (const file of files) {
        const { path } = file;

        const newPath = await cloudinaryImageUploadMethod(path);
        urls.push(newPath);
      }

      const multiImage = urls.map((url: any) => url.res);
      image.map((image: any, index) => (image.url = multiImage[index]));
      const data = await Image.bulkCreate(image);
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async addBrand(dataToAdd: Partial<IBrand>, imageFile: any) {
    try {
      const data = await Brand.findOrCreate({
        defaults: { name: dataToAdd.name },
        where: {
          name: dataToAdd.name,
        },
      });
      if (data[1] == false) {
        throw new Error("brand already exists", { cause: "existing" });
      } else {
        if (imageFile) {
          await this.addImage(
            [
              {
                type: true,
                brand_id: data[0].toJSON().brand_id,
                name: dataToAdd.image.name,
              },
            ],
            imageFile
          );
        }
        if (dataToAdd.discount_id) {
          await this.addProductDiscount({
            brandId: data[0].toJSON().brand_id,
            discountId: Number(dataToAdd.discount_id),
          });
        }
        return data[0];
      }
    } catch (error: any) {
      if (error.cause == "existing") {
        throw new Error(error.message, { cause: error.cause });
      }
      throw new Error(error.message);
    }
  }

  async addCategory(dataToAdd: Partial<IBrand>, imageFile: any) {
    try {
      const data = await Category.findOrCreate({
        defaults: { name: dataToAdd.name },
        where: {
          name: dataToAdd.name,
        },
      });
      if (data[1] == false) {
        throw new Error("category already exists", { cause: "existing" });
      } else {
        if (imageFile) {
          await this.addImage(
            [
              {
                type: true,
                category_id: data[0].toJSON().category_id,
                name: dataToAdd.image.name,
              },
            ],
            imageFile
          );
        }
        if (dataToAdd.discount_id) {
          await this.addProductDiscount({
            categoryId: data[0].toJSON().category_id,
            discountId: Number(dataToAdd.discount_id),
          });
        }
        return data[0];
      }
    } catch (error: any) {
      if (error.cause == "existing") {
        throw new Error(error.message, { cause: error.cause });
      }
      throw new Error(error.message);
    }
  }

  async addProduct(
    dataToAdd: Partial<IProduct & IImage & IDiscount>,
    imageFile: any
  ) {
    try {
      const data = await Product.findOrCreate({
        defaults: {
          name: dataToAdd.name,
          created_at: dataToAdd.created_at,
          sub_title: dataToAdd.sub_title ? dataToAdd.sub_title : null,
          description: dataToAdd.description ? dataToAdd.description : null,
          category_id: dataToAdd.category_id
            ? Number(dataToAdd.category_id)
            : null,
          brand_id: dataToAdd.brand_id ? Number(dataToAdd.brand_id) : null,
          price: Number(dataToAdd.price),
          quantity: dataToAdd.quantity ? Number(dataToAdd.quantity) : 0,
        },
        where: {
          name: dataToAdd.name,
        },
      });

      if (data[1] == false) {
        throw new Error("product already exists", { cause: "existing" });
      } else {
        if (imageFile) {
          const imageDate = Object.values(dataToAdd.image).map(
            (value, index) => {
              return {
                product_id: data[0].toJSON().product_id,
                type: value.type,
                name: value.name,
              };
            }
          );
          await this.addImage(imageDate, imageFile);
        }
        if (dataToAdd.discount_id) {
          await this.addProductDiscount({
            productId: data[0].toJSON().product_id,
            discountId: Number(dataToAdd.discount_id),
          });
        }
        return data[0];
      }
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
}
