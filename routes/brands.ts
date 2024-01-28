import express, { Router, Request, Response } from "express";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import CProduct from "../classes/product";
const router = Router();

router.use(cookieParser());
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: false }));


//getAllBrands
router.get("/",async (req: Request, res: Response)=> {
    try {
        const instance = CProduct.getInstance();
const data= await instance.getBrands();
        res.status(200).send(
            data);
    } catch (error) {
       
        res.status(500).end();
    }
})
export default router;