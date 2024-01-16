import express, { Router, Request, Response } from "express";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
const router = Router();

router.use(cookieParser());
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: false }));



//addToWishlist
router.post("/",(req: Request, res: Response)=> {
    try {
        const token = req.header('Authorization');
        const productId=req.body.product_id;
        res.status(200).send(
            {
                function: "addToWishlist",
                token:token,
                productId:productId
            });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
export default router;