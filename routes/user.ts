import express, { Router, Request, Response } from "express";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import CUser from "../classes/user";
import validation from "../middleware/validationRequest";
import authenticateUser from "../middleware/authorization";
import authorization from "../middleware/authorization";
import {
  cloudinaryImageUploadMethod,
  upload,
} from "../middleware/imageuploader";

const router = Router();

router.use(cookieParser());
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: false }));

router.post(
  "/register",
  validation.UserCreateAccountValidation,
  async (req: Request, res: Response) => {
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

router.patch(
  "/editInfo",
  authorization.authenticateUser,
  validation.UserEditInfoValidation,
  async (req: Request, res: Response) => {
    try {
      const instance = CUser.getInstance();
      const dataInfo = await instance.EditUserInfo(req.uid, req.body);
      res.status(200).send(dataInfo);
    } catch (error: any) {
      if (error.cause === "SequelizeUniqueConstraintError") {
        res.status(400).send(error.message);
      } else res.status(500).end();
    }
  }
);

router.post(
  "/upload-image",
  authorization.authenticateUser,
  upload("user").array("images"),
  validation.ImageValidation,
  async (req: Request, res: Response) => {
    try {
      const instance = CUser.getInstance();
      const urlImage = await instance.updateUserImage(req.files, req.uid);
      res.status(200).send(urlImage);
    } catch (err: any) {
      res.status(500).end();
    }
  }
);

router.delete(
  "/delete-image",
  authorization.authenticateUser,
  async (req: Request, res: Response) => {
    try {
      const instance = CUser.getInstance();
      const urlImage = await instance.deleteUserImage(req.uid);
      res.status(200).send(urlImage);
    } catch (err: any) {
      res.status(500).end();
    }
  }
);

router.get(
  "/address",
  authorization.authenticateUser,
  async (req: Request, res: Response) => {
    try {
      const instance = CUser.getInstance();

      const dataInfo = await instance.getUserAddresses(req.uid);
      res.status(200).send(dataInfo);
    } catch (e: any) {
      if (e?.cause == "Validation Error") {
        res.status(400).send(e.message);
      } else {
        res.status(500).send();
      }
    }
  }
);

router.get(
  "/user-info",
  authorization.authenticateUser,
  async (req: Request, res: Response) => {
    try {
      const instance = CUser.getInstance();

      const dataInfo = await instance.getUserInfo(req.uid);
      res.status(200).send(dataInfo);
    } catch (e: any) {
      if (e?.cause == "Validation Error") {
        res.status(400).send(e.message);
      } else {
        res.status(500).send();
      }
    }
  }
);
router.patch(
  "/change-password",
  validation.changePasswordValidation,
  authorization.authenticateUser,
  async (req: Request, res: Response) => {
    try {
      const instance = CUser.getInstance();

      const dataInfo = await instance.changePassword(req.body, req.uid);
      res.status(200).cookie("session_token", "").send();
    } catch (e: any) {
      if (e?.cause == "Validation Error") {
        res.status(400).send(e.message);
      } else {
        res.status(500).send();
      }
    }
  }
);

router.post(
  "/add-reviews",
  authorization.authenticateUser,
  validation.validateAddReview,
  async (req: Request, res: Response) => {
    try {
      const instance = CUser.getInstance();

      const dataInfo = await instance.addUserReview(req.body, req.uid);
      res.status(200).send(dataInfo);
    } catch (e: any) {
      if(e.cause=="not_found"){
        res.status(400).send(e.message);

      }
      res.status(500).send();
    }
  }
);
router.post(
  "/logout",
  authorization.authenticateUser,
  async (req: Request, res: Response) => {
    try {
      const instance = CUser.getInstance();
      const dataInfo = await instance.clearSession(req.uid);
      res.status(200).send(dataInfo);
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
