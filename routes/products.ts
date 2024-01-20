import express, { Router, Request, Response } from "express";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import CProduct from "../classes/product";
import authorization from "../middleware/authorization";
import validate from "../middleware/validationRequest";
const router = Router();

router.use(cookieParser());
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: false }));


//getAllProducts
router.get("/products", (req: Request, res: Response) => {
  try {
    const categoryName = req.query.category;
    const pageNumber = req.query.page_number;
    res.status(200).send({
      function: "getAllItems",
      categoryName: categoryName,
      pageNumberp: pageNumber,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//getMostPopulurProducts
router.get("/popular",  authorization.checkExistSession,
validate.validatePopularDiscount ,async (req: Request, res: Response) => {
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
});

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

//getHandpickedCategories
router.get(
  "/handpicked-categories/:number_of_categories",
  (req: Request, res: Response) => {
    try {
      const numberOfCategories = req.params.number_of_categories;
      res.status(200).send({
        function: "getHandpickedCategories",
        numberOfCategories: numberOfCategories,
      });
    } catch (error) {
      res.status(500).end();
    }
  }
);

//getHandpickedProductsByCategoryName
router.get("/category/handpicked", (req: Request, res: Response) => {
  try {
    const categoryID = req.query.category;
    const pageNumber = req.query.page_number;
    res.status(200).send({
      function: "getHandpickedProductsByCategoryName",
      categoryID: categoryID,
      pageNumber: pageNumber,
    });
  } catch (error) {
    res.status(500).end();
  }
});

//getLimitedEditionProducts
router.get("/limited-edition",authorization.checkExistSession,
validate.validatePageAndItemNumber, async (req: Request, res: Response) => {
  try {
    const instance = CProduct.getInstance();
    const [dataInfo,countData]=await instance.limitedEditionProducts(Number(req.query.page_number),
    Number(req.query.number_of_items),req.uid);
    res.status(200).send({ items_count: countData, items: dataInfo });

  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//getDiscountedProducts
router.get("/discount-edition",  authorization.checkExistSession,
validate.validatePopularDiscount ,async (req: Request, res: Response) => {
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
});

//getProductsByTextSearch
router.get(
  "/search",
  authorization.checkExistSession,
  validate.validateTextSearch,
  async (req: Request, res: Response) => {
    try {
      const searchValue = req.query.search_value;
      const pageNumber = req.query.page_number;

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
        Number(req.params.product_id)
      );
      res.status(200).send(data);
    } catch (error) {
      res.status(500).end();
    }
  }
);

//get5RelatedProducts
router.get(
  "/related_product",
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
router.get("/ratings/:product_id", async (req: Request, res: Response) => {
  try {
    const productId = Number(req.params.product_id);
    const instance = CProduct.getInstance();
    const dataInfo = await instance?.getProductRatings(productId);
    res.status(200).send({
      function: "getProductsRatings",
      dataInfo: dataInfo,
    });
  } catch (error) {
   
    res.status(500).end();
  }
});

export default router;