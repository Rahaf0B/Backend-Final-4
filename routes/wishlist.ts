import express, { Router, Request, Response } from "express";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import CUser from "../classes/user";
import authorization from "../middleware/authorization";
import validate from "../middleware/validationRequest";
import CProduct from "../classes/product";
const router = Router();

router.use(cookieParser());
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: false }));

//addToWishlist
router.post(
  "/",
  authorization.authenticateUser,
  validate.validateWishlist,
  async (req: Request, res: Response) => {
    try {
      const instance = CUser.getInstance();
      const status = await instance.addToWishlist(
        Number(req.query.product_id),
        req.uid
      );
      res.status(200).send(status);
    } catch (e: any) {
      if (e.cause == "not found") {
        res.status(400).send(e.message);
      } else res.status(500).end();
    }
  }
);

router.delete(
  "/",
  authorization.authenticateUser,
  validate.validateWishlist,
  async (req: Request, res: Response) => {
    try {
      const instance = CUser.getInstance();
      const status = await instance.deleteFromWishlist(
        Number(req.query.product_id),
        req.uid
      );
      res.status(200).send(status);
    } catch (error: any) {
      res.status(500).end();
    }
  }
);

router.get(
  "/products",
  authorization.authenticateUser,
  validate.validatePageAndItemNumber,

  async (req: Request, res: Response) => {
    try {
      const instance = CProduct.getInstance();
      const [count,items] = await instance.getProductsInWishlist(
        req.uid,
        Number(req.query.page_number),
        Number(req.query.number_of_items)
      );
      res.status(200).send({items_count:count,items:items});
    } catch (error: any) {
      if(error.cause=="not_found"){
        res.status(500).send(error.message);

      }else
      res.status(500).end();
    }
  }
);
export default router;
