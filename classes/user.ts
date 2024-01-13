import { auth } from "../firebaseConfig";
import { IUser } from "../interfaces/objInterfaces";
import User from "../models/User";

export default class CUser {
  private static instance: CUser;

  private constructor() {}

  public static getInstance(): CUser {
    if (CUser.instance) {
      return CUser.instance;
    }
    CUser.instance = new CUser();
    return CUser.instance;
  }

  async createUserAccount(dataUser: IUser) {
    try {
      const userCredential = await auth.createUserWithEmailAndPassword(
        dataUser.email,
        dataUser.password
      );

      const user = userCredential.user;

      dataUser.uid = user.uid;
      dataUser.type = "normal_user";

      const userCreated = User.create(dataUser);

      const token = user.getIdToken();
      const dataToReturn = (await userCreated).toJSON();
      delete dataToReturn.uid;
      delete dataToReturn.type;
      try {
        await Promise.all([userCreated, token]);

        return [dataToReturn, token, user.refreshToken];
      } catch (e: any) {
        throw new Error(e);
      }
    } catch (e: any) {
      if (e?.code === "auth/email-already-in-use") {
        throw new Error("Email Already Exists", { cause: "unique violation" });
      } else {
        throw new Error(e.message);
      }
    }
  }

  async loginUser(dataUser: Partial<IUser>) {
    try {
      const userCredential = await auth.signInWithEmailAndPassword(
        dataUser.email,
        dataUser.password
      );

      var user = userCredential.user;
      const token = await user.getIdToken();

      return [token, user.refreshToken];
    } catch (e: any) {
      if (e?.code === "auth/invalid-credential") {
        throw new Error("invalid credential", { cause: "invalid credential" });
      } else {
        throw new Error(e.message);
      }
    }
  }
}
