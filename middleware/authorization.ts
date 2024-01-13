import { Request, Response, NextFunction } from "express";
import { auth } from "../firebaseConfig";
import { initializeApp } from "firebase-admin/app";
import { getAppCheck } from "firebase-admin/app-check";
import admin from "firebase-admin";

import serviceAccount from "../firebase-adminsdk.json";

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as any),
});

async function authenticateUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const token = req.headers?.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).send("The session token is required");
  } else {
    try {
      const validation = await admin.auth().verifyIdToken(token);
      req.uid = validation.user_id;
      next();
    } catch (e: any) {
      return res.status(401).send("The token is invalid");
    }
  }
}

export default { authenticateUser };
