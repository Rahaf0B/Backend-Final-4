import { Request, Response, NextFunction } from "express";
import CUser from "../classes/user";

async function checkExistSession(
  req: Request,
  res: Response,
  next: NextFunction
) {
  let token = req.headers.authorization as string;

  

  if (!token) {
    token=token?.split(" ")[1];

    req.uid = 0;
    next();
  } else {
    try {
      const returnreq=await authenticateUser(req, res, next);
      return returnreq;
    } catch (e: any) {
      return res.status(500);
    }
  }
}

async function authenticateUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  let token = req.headers.authorization as string;

  if (!token) {
    token=token?.split(" ")[1];

    return res.status(401).send("The session token is required");
  } else {
    const instance = CUser.getInstance();

    try {
      const sessionData = await instance.checkSession(token);
      const dateNow = new Date();
      if (!sessionData || dateNow > new Date(sessionData.expiration_date)) {
        return res.status(401).send("The session token is invalid");
      } else {
        req.uid = sessionData.uid;
        next();
      }
    } catch (e: any) {
      return res.status(500).end();
    }
  }
}

export default { authenticateUser, checkExistSession };