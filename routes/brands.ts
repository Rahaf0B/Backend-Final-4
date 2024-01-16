import express, { Router, Request, Response } from "express";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
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



//getAllBrands
router.get("/",(req: Request, res: Response)=> {
    try {
        res.status(200).send(
            {
                function: "getAllBrands",
                
            });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
})
export default router;