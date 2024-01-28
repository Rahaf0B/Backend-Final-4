import express, { Router, Request, Response } from "express";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import authorization from "../middleware/authorization";
import validate from "../middleware/validationRequest";
import CUser from "../classes/user";
import CProduct from "../classes/product";

const router = Router();

router.use(cookieParser());
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: false }));

//this is a dummy rout to test if my api works, will be deleted later
router.get("/test", async(req: Request, res: Response) => {
  try {
    const instance = CProduct.getInstance();

    res.status(200).send({ data:"result",message: "we are at Cart test, server is running" });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//getOrderItems
router.get(
  "/products",
  authorization.authenticateUser,
  validate.validateOrderItem,
  async (req: Request, res: Response) => {
    try {
      const instance = CProduct.getInstance();
       const data = await instance.getorderItems(
        Number(req.query.order_id),
        );
      res.status(200).send(data);
    } catch (error) {
      res.status(500).end();
    }
  }
);

//getUserOrders
router.get(
  "/",
  authorization.authenticateUser,
  validate.validateOrderStatus,
  async (req: Request, res: Response) => {
    try {
      const instance = CUser.getInstance();
      const data = await instance.getUserOrders(
        req.uid,
        Number(req.query.order_status)
      );
      res.status(200).send(data,);
    } catch (error) {
      res.status(500).end();
    }
  }
);



router.post("/new_address", 
authorization.authenticateUser,validate.UserAddressValidation,async (req: Request, res: Response)=> {
    try {
        const instance = CUser.getInstance();
 const data= await instance.addOrderAddress(req.body,req.uid)
        res.status(200).send(
           data);
    } catch (error) {
       
        res.status(500).end();
    }
});



router.post("/new_order", authorization.authenticateUser,validate.validateAddOrder,async (req: Request, res: Response)=> {
    try {
        const instance = CUser.getInstance();
 const data= await instance.orderCheckOut(req.uid,Number(req.body.address_id),req.body.payment_type)
        res.status(200).send(
           data);
    } catch (error) {
        res.status(500).end();
    }
});


export default router;
