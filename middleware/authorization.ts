
import { Request, Response, NextFunction } from "express";
import CUser from "../classes/user";


async function authenticateUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const token = req.cookies["session_token"];

  if (!token) {
    return res.status(401).send("The session token is required");
  } else {
    const instance=CUser.getInstance();

    try {
      const sessionData = await instance.checkSession(token);
      const dateNow = new Date();
      if (
        !sessionData ||
        dateNow.getDate() < new Date(sessionData.expiration_date).getDate()
      ) {
        return res.status(401).send("The session token is invalid");
      } else {
        req.uid = sessionData.uid.toString();
        next();
      }
    } catch (e: any) {
      return res.status(500);
    }
  }
}

export default { authenticateUser };
