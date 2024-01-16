import express from "express";
import products from "./products";
import brands from "./brands";
import cart from "./cart";
import order from "./order";
import wishlist from "./wish_list";

const router = express.Router();
router.get("/test",products.test);

router.get("/products",products.getAllProducts);
router.get("/products/popular",products.getMostPopulurProducts);
router.get("/product",products.getProductsByCategory);
router.get("/product/new-arrival",products.getNewArrivalProducts);
router.get("/product/handpicked",products.getHandpickedProducts);
router.get("/product/handpicked-categories/:number_of_categories",products.getHandpickedCategories);
router.get("/product/category/handpicked",products.getHandpickedProductsByCategoryName);
router.get("/product/limited-edition",products.getLimitedEditionProducts);
router.get("/product/discount-edition",products.getDiscountedProducts);
router.get("/product/search",products.getProductsByTextSearch);
router.get("/product/:product_id",products.getProductsById);
router.get("/product/related/:brand_id/:category_id",products.get5RelatedProducts);
router.get("/product/reatings/:product_id",products.getProductsRatings);

router.get("/brands",brands.getAllBrands);

router.get("/cart",cart.getCartInfo);
router.post("/cart",cart.addToCart);

router.post("/wishlist",wishlist.addToWishlist);

router.get("/order/:order_status",order.getOrdersInfo);

export default{
    router,
}
