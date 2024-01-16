import express, { Router, Request, Response } from "express";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import CUser from "../classes/user";
import validation from "../middleware/validationRequest";
import authenticateUser from "../middleware/authorization";
import CProduct from "../classes/product";

const router = Router();

router.use(cookieParser());
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: false }));

router.get(
  "/newAriv",
  async (req, res) => {
    try {
      const instance = CProduct.getInstance();

      const [dataInfo,countData] =
        await instance?.getNewArrival(0,20,4);
      res
        .status(200)
        .send({items_count:countData,items:dataInfo,});
    } catch (e: any) {
   
        res.status(500).send();
      
    }
  }
);


router.get(
  "/getpro",
  async (req, res) => {
    try {
      const instance = CProduct.getInstance();
      const [dataInfo,countData] =
        await instance?.filterProductByCoB(1,20,2,"brand_id",5);
      res
        .status(200)
        .send({items_count:countData,items:dataInfo,});
    } catch (e: any) {
   
        res.status(500).send();
      
    }
  }
);


router.get(
  "/getbrands",
  async (req, res) => {
    try {
      const instance = CProduct.getInstance();
  
       const data= await instance?.getBrands();
      res
        .status(200)
        .send(data);
    } catch (e: any) {
   
        res.status(500).send();
      
    }
  }
);

export default router;
