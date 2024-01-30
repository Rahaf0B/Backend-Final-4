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

//getCartInfo
router.get(
  "/",
  authorization.authenticateUser,
  async (req: Request, res: Response) => {
    try {
      const instance = CProduct.getInstance();
      const status = await instance.getProductsInCart(req.uid);
      res.status(200).send(status);
    } catch (error) {
      res.status(500).end();
    }
  }
);

//addToCart
router.post(
  "/",
  authorization.authenticateUser,
  validate.validateCart,
  async (req: Request, res: Response) => {
    try {
      const instance = CUser.getInstance();
      const data = await instance.addToCart(
        Number(req.body.product_id),
        Number(req.body.quantity),
        req.uid
      );
      res.status(200).send(data);
    } catch (e: any) {
      if (e.cause == "not found") {
        res.status(400).send(e.message);
      } else res.status(500).end();
    }
  }
);

//increase product quantity in Cart
router.patch(
  "/increase_quantity",
  authorization.authenticateUser,
  validate.validateCart,
  async (req: Request, res: Response) => {
    try {
      const instance = CUser.getInstance();
      const data = await instance.increaseProductInCart(
        Number(req.body.product_id),
        Number(req.body.quantity),
        req.uid
      );
      res.status(200).send(data);
    } catch (e: any) {
      if (e.cause == "not found") {
        res.status(400).send(e.message);
      } else res.status(500).end();
    }
  }
);

//decrease product quantity from Cart
router.patch(
  "/decrease_quantity",
  authorization.authenticateUser,
  validate.validateCart,
  async (req: Request, res: Response) => {
    try {
      const instance = CUser.getInstance();
      const data = await instance.decreaseQuantityProductFromCart(
        Number(req.body.product_id),
        req.uid,
        Number(req.body.quantity)
      );
      res.status(200).send(data);
    } catch (error:any) {
      if(error.cause=="not found"){
        res.status(400).send(error.message);
              }else
      res.status(500).end();
    }
  }
);

//removeProductFromCart
router.delete(
  "/",
  authorization.authenticateUser,
  validate.validateDeleteFromCart,
  async (req: Request, res: Response) => {
    try {
      const instance = CUser.getInstance();
      const data = await instance.removeFromCart(
        Number(req.query.product_id),
        req.uid
      );
      res.status(200).send(data);
    } catch (error:any) {
      if(error.cause=="not found"){
        res.status(400).send(error.message);
              }else
      res.status(500).end();
    }
  }
);
export default router;
