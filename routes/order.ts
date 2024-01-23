import express, { Router, Request, Response } from "express";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import authorization from "../middleware/authorization";
import validate from "../middleware/validationRequest";
import CUser from "../classes/user";

const router = Router();

router.use(cookieParser());
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: false }));


//this is a dummy rout to test if my api works, will be deleted later
router.get("/test",(req: Request, res: Response)=> {
    try {
        res.status(200).send({ message: "we are at Cart test, server is running" });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

//getOrderItems
router.get("/Products",
authorization.authenticateUser,
//validate.validateOrderStatus,
async (req: Request, res: Response)=> {
    try {
        const token = req.header('Authorization');
        const orderStatus=req.params.order_status;
        res.status(200).send(
            {
                function: "getOrdersInfo",
                token:token,
                orderStatus:orderStatus
            });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

//getUserOrders
router.get("/",
authorization.authenticateUser,
validate.validateOrderStatus,
async (req: Request, res: Response)=> {
    try {
        const instance = CUser.getInstance();
      const data = await instance.getUserOrders(
        req.uid,
        Number(req.query.order_status),
      ); res.status(200).send(
            {
                data                
            });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
export default router;