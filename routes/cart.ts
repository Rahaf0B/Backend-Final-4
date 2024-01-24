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

//this is a dummy rout to test if my api works, will be deleted later
router.get("/test", (req: Request, res: Response) => {
  try {
    res.status(200).send({ message: "we are at Cart test, server is running" });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//getCartInfo
router.get(
  "/",
  authorization.authenticateUser,
  async (req: Request, res: Response) => {
    try {
      const instance = CProduct.getInstance();
      const status = await instance.getProductsInCart(
        req.uid
      );
      res.status(200).send(status);

    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ error: "Internal Server Error" });
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
    } catch (error) {
      res.status(500).end();
    }
  }
);

//decrease product amount from Cart
router.patch(
  "/",
  authorization.authenticateUser,
  validate.validateCart,
  async (req: Request, res: Response) => {
    try {
      const instance = CUser.getInstance();
      const data = await instance.decreaseOrDeleteFromCart(
        Number(req.body.product_id),
        "decrease",
        req.uid,
        Number(req.body.quantity)
      );
      res.status(200).send(data);
    } catch (error) {
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
      const data = await instance.decreaseOrDeleteFromCart(
        Number(req.query.product_id),
        "delete",
        req.uid
      );
      res.status(200).send(data);
    } catch (error) {
      res.status(500).end();
    }
  }
);
export default router;
