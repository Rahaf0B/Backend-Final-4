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
    Sequelize.col("rating.product_id")
  );
  private avgProductRating = Sequelize.fn("AVG", Sequelize.col("rating.value"));
  private discountProduct = Sequelize.fn(
    "SUM",
    Sequelize.col("discount.value")
  );
  private groupByProductQuery = [
    "product_id",
    "image_id",
    "wishlist.wishlist_id",
    "rating.rating_id",
    "discount.discount_id",
  ];

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
      group: this.groupByProductQuery,
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
      group: this.groupByProductQuery,
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
              `MATCH (product.name) AGAINST('${searchString}' IN NATURAL LANGUAGE MODE)`
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
            where: { normal_uid: userId },
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
        group: this.groupByProductQuery,

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
        group: this.groupByProductQuery,
        order: [["product_id", "DESC"]],
      });
      return data;
    } catch (error: any) {
      throw new Error(error);
    }
  }

  async handPickedProducts(
    pageNumber: number = 1,
    numberOfItems: number = 5,
    userId?: number,
    categoryId: number = 0
  ): Promise<(number | Product[])[]> {
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
        },
        {
          model: Rating,
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
      group: this.groupByProductQuery,
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
      const count = await Product.count({
        distinct: true,
        where: [
          filterType == "limited" ? { quantity: { [Op.lt]: value } } : {},
        ],
        include: [
          filterType == "discount"
            ? {
                model: Discount,
                where: {
                  [Op.and]: [{ value: { [Op.gte]: value } }],
                },
              }
            : filterType == "rating"
            ? {
                model: Rating,
                where: {
                  [Op.and]: [{ value: { [Op.gte]: value } }],
                },
              }
            : {
                model: Discount,
                required: false,
                attributes: [],
              },
        ],
      });

      return count;
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
        },
        {
          model: Rating,
          required: filterType == "rating" ? false : true,
          attributes: [],
          subQuery: false,
        },
        {
          model: Discount,
          required: filterType == "discount" ? false : true,
          attributes: [],
          subQuery: false,
        },
      ],
      group: this.groupByProductQuery,
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
        },
        {
          model: Rating,
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
      group: this.groupByProductQuery,
      order: [["product_id", "DESC"]],
    });
    try {
      const [products, count] = await Promise.all([data, countData]);
      return [products, count];
    } catch (e: any) {
      throw new Error(e.message);
    }
  }

  async checkProductExists(product_id: number) {
    try {
      const data = await Product.findByPk(product_id);
      return data;
    } catch (e: any) {}
  }

  async getProductRatings(productId: number) {
    let ratings = await Rating.findAll({
      where: { product_id: productId },
      include: {
        model: Normal_User,
        attributes: ["normal_uid"], //do not edit
        where: {
          normal_uid: Sequelize.col("Rating.normal_uid"),
        },
        include: [
          {
            model: User,
            attributes: ["first_name", "last_name"],
            where: {
              uid: Sequelize.col("Rating.normal_uid"),
            },
          },
          {
            model: Image,
            required: false,
            nested: true,
            attributes: ["image_id", "name", "url"],
            subQuery: false,
          },
        ],
      },
    });

    return ratings;
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
        },
        {
          model: Rating,
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
      group: this.groupByProductQuery,
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
        },
        {
          model: Rating,
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
      group: this.groupByProductQuery,
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
        },
        {
          model: Discount,
          required: false,
          attributes: [],
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
      group: [
        "product_id",
        "image_id",
        "wishlist.wishlist_id",
        "product_cart.cart_id",
        "discount.discount_id",
      ],
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
        [Sequelize.col("address.first_name"), "first_name"],
        [Sequelize.col("address.last_name"), "last_name"],
        [Sequelize.col("address.email"), "email"],
        [Sequelize.col("address.phone_number"), "phone_number"],
        [Sequelize.col("address.location"), "location"],
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
      return effectedProduct;
    } catch (error) {}
  }

  async addProductDiscount(id: any) {
    try {
      const produces = await Product.findAll({
        attributes: ["product_id"],
        where: {
          [Op.or]: [
            { brand_id: id.brandId ? id.brandId : 0 },
            { category_id: id.categoryId ? id.categoryId : 0 },
            { product_id: id.productId ? id.productId : 0 },
          ],
        },
      });

      const productId = produces.map((value) => {
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
        return data;
      }
    } catch (error: any) {
      if (error.cause == "existing") {
        throw new Error(error.message, { cause: error.cause });
      }
      throw new Error(error.message);
    }
  }
}
