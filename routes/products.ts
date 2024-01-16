import express, { Router, Request, Response } from "express";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
const router = Router();

router.use(cookieParser());
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: false }));

//getAllProducts
router.get("/products", (req: any, res: any) => {
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
router.get("/popular", (req: any, res: any) => {
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
router.get("/product-category", (req: any, res: any) => {
  try {
    const categoryID = req.query.category;
    const pageNumber = req.query.page_number;
    res.status(200).send({
      function: "getItemByCategory",
      categoryID: categoryID,
      pageNumber: pageNumber,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


//getProductsByBrand
router.get("/product-brand", (req: any, res: any) => {
    try {
      const categoryID = req.query.category;
      const pageNumber = req.query.page_number;
      res.status(200).send({
        function: "getItemByBrand",
        categoryID: categoryID,
        pageNumber: pageNumber,
      });
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });
  

//getNewArrivalProducts
router.get("/new-arrival", (req: any, res: any) => {
  try {
    const pageNumber = req.query.page_number;
    res.status(200).send({
      function: "getNewArrivalProducts",
      pageNumber: pageNumber,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//getHandpickedProducts 
router.get("/handpicked-products", (req: any, res: any) => {
  try {
    const pageNumber = req.query.page_number;
    res.status(200).send({
      function: "getHandpickedProducts",
      pageNumber: pageNumber,
      
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//getHandpickedCategories
router.get(
  "/handpicked-categories/:number_of_categories",
  (req: any, res: any) => {
    try {
      const numberOfCategories = req.params.number_of_categories;
      res.status(200).send({
        function: "getHandpickedCategories",
        numberOfCategories: numberOfCategories,
      });
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

//getHandpickedProductsByCategoryName
router.get("/category/handpicked", (req: any, res: any) => {
  try {
    const categoryID = req.query.category;
    const pageNumber = req.query.page_number;
    res.status(200).send({
      function: "getHandpickedProductsByCategoryName",
      categoryID: categoryID,
      pageNumber: pageNumber,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//getLimitedEditionProducts
router.get("/limited-edition", (req: any, res: any) => {
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
router.get("/discount-edition", (req: any, res: any) => {
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
router.get("/search", (req: any, res: any) => {
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
router.get("/single-product/:product_id", (req: any, res: any) => {
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
router.get("/related/:brand_id/:category_id", (req: any, res: any) => {
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
router.get("/ratings/:product_id", (req: any, res: any) => {
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
