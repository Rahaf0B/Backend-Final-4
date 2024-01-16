import express, { Router, Request, Response } from "express";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import CUser from "../classes/user";
import validation from "../middleware/validationRequest";
import authenticateUser from "../middleware/authorization";

const router = Router();

router.use(cookieParser());
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: false }));

router.post(
  "/register",
  validation.UserCreateAccountValidation,
  async (req:Request, res:Response) => {
    try {
      const instance = CUser.getInstance();

      const [dataInfo, token, expirationDate] =
        await instance?.createUserAccount(req.body);
      res
        .status(200)
        .cookie("session_token", token, { expires: new Date(expirationDate) })
        .send(dataInfo);
    } catch (e: any) {
      if (e?.cause == "Validation error") {
        res.status(400).send(e.message);
      } else {
        res.status(500).send();
      }
    }
  }
);



router.post(
  "/login",
  validation.UserLoginValidation,
  async (req: Request, res: Response) => {
    try {
      const instance = CUser.getInstance();
      const [dataInfo, token, expirationDate] = await instance?.logInUser(
        req.body
      );
      res
        .status(200)
        .cookie("session_token", token, { expires: new Date(expirationDate) })
        .send(dataInfo);
    } catch (e: any) {
      if (e?.cause == "Validation Error") {
        res.status(400).send(e.message);
      } else {
        res.status(500).send();
      }
    }
  }
);

export default router;
