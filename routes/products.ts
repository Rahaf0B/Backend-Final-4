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
router.get("/popular", (req: Request, res: Response) => {
  try {
    const page_number = Number(req.query.page_number);
    res.status(200).send({
      function: "getMostPopulurProducts",
      page_number: page_number,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
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
        Number(req.query.category) ? "category_id" : "name",
        Number(req.query.category)
          ? Number(req.query.category)
          : req.query.category.toString()
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
        Number(req.query.brand) ? "brand_id" : "name",
        Number(req.query.brand)
          ? Number(req.query.brand)
          : req.query.brand.toString()
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
router.get("/handpicked-products", (req: Request, res: Response) => {
  try {
    const pageNumber = req.query.page_number;
    res.status(200).send({
      function: "getHandpickedProducts",
      pageNumber: pageNumber,
    });
  } catch (error) {
    res.status(500).end();
  }
});

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
router.get("/limited-edition", (req: Request, res: Response) => {
  try {
    const pageNumber = req.query.page_number;
    res.status(200).send({
      function: "getLimitedEditionProducts",
      pageNumber: pageNumber,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//getDiscountedProducts
router.get("/discount-edition", (req: Request, res: Response) => {
  try {
    const pageNumber = req.query.page_number;
    res.status(200).send({
      function: "getDiscountedProducts",
      pageNumber: pageNumber,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//getProductsByTextSearch
router.get("/search", (req: Request, res: Response) => {
  try {
    const searchValue = req.query.search_value;
    const pageNumber = req.query.page_number;
    res.status(200).send({
      function: "getProductsByTextSearch",
      searchValue: searchValue,
      pageNumber: pageNumber,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//getProductsById
router.get("/single-product/:product_id", (req: Request, res: Response) => {
  try {
    const id = Number(req.params.product_id);
    res.status(200).send({
      function: "getProductsById",
      Id: id,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//get5RelatedProducts
router.get("/related/:brand_id/:category_id", (req: Request, res: Response) => {
  try {
    const prandId = Number(req.params.brand_id);
    const categoryId = Number(req.params.category_id);
    res.status(200).send({
      function: "get5RelatedProducts",
      prandId: prandId,
      categoryId: categoryId,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//getProductsRatings
router.get("/ratings/:product_id", (req: Request, res: Response) => {
  try {
    const id = Number(req.params.product_id);
    res.status(200).send({
      function: "getProductsRatings",
      Id: id,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
