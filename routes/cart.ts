import express, { Router, Request, Response } from "express";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import CUser from "../classes/user";
import authorization from "../middleware/authorization";
import validate from "../middleware/validationRequest";

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
router.get("/", (req: Request, res: Response) => {
  try {
    const token = req.header("Authorization");
    res.status(200).send({
      function: "getCartInfo",
      token: token,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

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
      const data = await instance.decreaseQuantityProductFromCart(
        Number(req.body.product_id),
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
      const data = await instance.removeFromCart(
        Number(req.query.product_id),
        req.uid
      );
      res.status(200).send(data);
    } catch (error) {
      res.status(500).end();
    }
  }
);
export default router;
