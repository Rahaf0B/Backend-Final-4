import express, { Router, Request, Response } from "express";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import CProduct from "../classes/product";
import authorization from "../middleware/authorization";
import validate from "../middleware/validationRequest";
import { upload } from "../middleware/imageuploader";
const router = Router();

router.use(cookieParser());
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: false }));

//get the Most Popular Products
router.get(
  "/popular",
  authorization.checkExistSession,
  validate.validatePopularDiscount,
  async (req: Request, res: Response) => {
    try {
      const page_number = Number(req.query.page_number);
      const instance = CProduct.getInstance();
      const [dataInfo, countData] = await instance.popularAndDiscountProducts(
        Number(req.query.page_number),
        Number(req.query.number_of_items),
        "rating",
        req.uid,
        Number(req.query.value)
      );
      res.status(200).send({ items_count: countData, items: dataInfo });
    } catch (error) {
      res.status(500).end();
    }
  }
);

//getProductsByCategory
router.get(
  "/product-category",
  authorization.checkExistSession,
  validate.validateGetByCategory,
  async (req: Request, res: Response) => {
    try {
      const instance = CProduct.getInstance();
      const [dataInfo, countData] = await instance?.filterProductByCoB(
        Number(req.query.page_number),
        Number(req.query.number_of_items),
        req.uid,
        Number(req.query.category_id),
        ...[,]
      );

      res.status(200).send({ items_count: countData, items: dataInfo });
    } catch (e: any) {
      res.status(500).end();
    }
  }
);

//getProductsByBrand
router.get(
  "/product-brand",
  authorization.checkExistSession,
  validate.validateGetByBrand,
  async (req: Request, res: Response) => {
    try {
      const instance = CProduct.getInstance();
      const [dataInfo, countData] = await instance?.filterProductByCoB(
        Number(req.query.page_number),
        Number(req.query.number_of_items),
        req.uid,
        ...[,],
        Number(req.query.brand_id)
      );

      res.status(200).send({ items_count: countData, items: dataInfo });
    } catch (e: any) {
      res.status(500).end();
    }
  }
);

//getNewArrivalProducts
router.get(
  "/new-arrival",
  authorization.checkExistSession,
  validate.validatePageAndItemNumber,
  async (req: Request, res: Response) => {
    try {
      const instance = CProduct.getInstance();
      const [dataInfo, countData] = await instance?.getNewArrival(
        Number(req.query.page_number),
        Number(req.query.number_of_items),
        req.uid
      );
      res.status(200).send({ items_count: countData, items: dataInfo });
    } catch (error) {
      res.status(500).end();
    }
  }
);

//getHandpickedProducts
router.get(
  "/handpicked-products",
  authorization.checkExistSession,
  validate.validateGetByCategory,
  async (req: Request, res: Response) => {
    try {
      const instance = CProduct.getInstance();
      const [dataInfo, countData] = await instance.handPickedProducts(
        Number(req.query.page_number),
        Number(req.query.number_of_items),
        req.uid,
        Number(req.query.category_id)
      );

      res.status(200).send({ items_count: countData, items: dataInfo });
    } catch (error) {
      res.status(500).end();
    }
  }
);

//getLimitedEditionProducts
router.get(
  "/limited-edition",
  authorization.checkExistSession,
  validate.validatePageAndItemNumber,
  async (req: Request, res: Response) => {
    try {
      const instance = CProduct.getInstance();
      const [dataInfo, countData] = await instance.limitedEditionProducts(
        Number(req.query.page_number),
        Number(req.query.number_of_items),
        req.uid
      );
      res.status(200).send({ items_count: countData, items: dataInfo });
    } catch (error) {
      res.status(500).end();
    }
  }
);

//getDiscountedProducts
router.get(
  "/discount-edition",
  authorization.checkExistSession,
  validate.validatePopularDiscount,
  async (req: Request, res: Response) => {
    try {
      const instance = CProduct.getInstance();
      const [dataInfo, countData] = await instance.popularAndDiscountProducts(
        Number(req.query.page_number),
        Number(req.query.number_of_items),
        "discount",
        req.uid,
        Number(req.query.value)
      );
      res.status(200).send({ items_count: countData, items: dataInfo });
    } catch (error) {
      res.status(500).end();
    }
  }
);

//getProductsByTextSearch
router.get(
  "/search",
  authorization.checkExistSession,
  validate.validateTextSearch,
  async (req: Request, res: Response) => {
    try {
      const instance = CProduct.getInstance();
      const [dataInfo, countData] = await instance.search(
        req.query.search_value.toString(),
        Number(req.query.page_number),
        Number(req.query.number_of_items),
        req.uid
      );
      res.status(200).send({ items_count: countData, items: dataInfo });
    } catch (error) {
      res.status(500).end();
    }
  }
);

//getProductsById
router.get(
  "/single-product/:product_id",
  authorization.checkExistSession,
  validate.validateProductId,
  async (req: Request, res: Response) => {
    try {
      const instance = CProduct.getInstance();
      const data = await instance.getSingleProduct(
        Number(req.params.product_id),
        req.uid
      );
      res.status(200).send(data);
    } catch (error) {
      res.status(500).end();
    }
  }
);

//get5RelatedProducts
router.get(
  "/related-product",
  authorization.checkExistSession,
  validate.validateCategoryBrandID,
  async (req: Request, res: Response) => {
    try {
      const instance = CProduct.getInstance();
      const [dataInfo, countData] = await instance?.filterProductByCoB(
        ...[,],
        ...[,],
        req.uid,
        Number(req.query.category_id),
        Number(req.query.brand_id)
      );

      res.status(200).send({ items_count: countData, items: dataInfo });
    } catch (error) {
      res.status(500).end();
    }
  }
);

//getProductsRatings
router.get("/ratings/:product_id",validate.validateProductId, async (req: Request, res: Response) => {
  try {
    const productId = Number(req.params.product_id);
    const instance = CProduct.getInstance();
    const [countRating, dataInfo] = await instance?.getProductRatings(
      Number(productId)
    );
    res.status(200).send({
      countRating: countRating,
      ratingData: dataInfo,
    });
  } catch (error) {
    res.status(500).end();
  }
});

//get all products
router.get(
  "/all",
  authorization.checkExistSession,
  validate.validatePageAndItemNumber,
  async (req: Request, res: Response) => {
    try {
      const instance = CProduct.getInstance();
      const [countData,dataInfo] = await instance?.getAllProducts(
        req.uid,
        Number(req.query.page_number),
        Number(req.query.number_of_items)
      );
      res.status(200).send({ items_count: countData, items: dataInfo });
    } catch (error) {
      res.status(500).end();
    }
  }
);
/*

// add new brand
router.post(
  "/new-brand",
  upload("brand").array("images"),
  validate.ImageValidation,
  validate.validateAddBrandOrCategory,
  async (req: Request, res: Response) => {
    try {
      const instance = CProduct.getInstance();
      const dataInfo = await instance.addBrand(req.body, req.files);

      res.status(200).send(dataInfo);
    } catch (error: any) {
      if (error.cause == "existing") {
        res.status(500).send(error.message);
      }
      res.status(500).end();
    }
  }
);


//add new category
router.post(
  "/new-category",
  upload("category").array("images"),
  validate.ImageValidation,
  validate.validateAddBrandOrCategory,
  async (req: Request, res: Response) => {
    try {
      const instance = CProduct.getInstance();
      const dataInfo = await instance.addCategory(req.body, req.files);

      res.status(200).send(dataInfo);
    } catch (error: any) {
      if (error.cause == "existing") {
        res.status(500).send(error.message);
      }
      res.status(500).end();
    }
  }
);


//add new product
router.post(
  "/new-product",
  upload("products").array("images"),
  validate.ImageValidation,

  async (req: Request, res: Response) => {
    try {
      const instance = CProduct.getInstance();
      const dataInfo = await instance.addProduct(req.body, req.files);

      res.status(200).send(dataInfo);
    } catch (error: any) {
      if (error.cause == "existing") {
        res.status(500).send(error.message);
      }
      res.status(500).end();
    }
  }
);
*/
export default router;
