// import { auth } from "../firebaseConfig";
import { IUser } from "../interfaces/objInterfaces";
import Session from "../models/Session";
import User from "../models/User";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcrypt";
import { NUMBER } from "sequelize";

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

  async generateOrUpdateSession(userId: number): Promise<[string, string]> {
    const token = uuidv4();

    const expiration_date = new Date();
    expiration_date.setDate(new Date().getDate() + 7);
    try {
      let data = await Session.create({
        token: token,
        expiration_date: expiration_date,
        uid: userId,
      });

      data = data.toJSON();
      return [data.token, data.expiration_date];
    } catch (e: any) {
      if (e.name === "SequelizeUniqueConstraintError") {
        return await this.generateOrUpdateSession(userId);
      } else {
        throw new Error(e.message);
      }
    }
  }

  async checkSession(token: string): Promise<Session> {
    const data = await Session.findOne({
      where: {
        token: token,
      },
    });

    return data;
  }

  async createUserAccount(data: IUser): Promise<[IUser, string, string]> {
    try {
      data.type = "normal_user";
      const dataAdded = await User.create(data);
      let dataToReturn = dataAdded.toJSON();
      delete dataToReturn.password;
      try {
        const [token, expirationDate] = await this.generateOrUpdateSession(
          dataToReturn.uid
        );
        return [dataToReturn, token, expirationDate];
      } catch (e: any) {
        if (e.name === "SequelizeUniqueConstraintError") {
          await this.generateOrUpdateSession(data.uid);
        }
      }
    } catch (e: any) {
      if (
        e.name === "SequelizeValidationError" ||
        e.name === "SequelizeUniqueConstraintError"
      ) {
        throw new Error(e?.errors[0]?.message, { cause: "Validation error" });
      } else {
        throw new Error(e);
      }
    }
  }

  async checkUserExists(key: string, value: string | number): Promise<IUser> {
    try {
      let userData = await User.findOne({
        where: {
          [key as keyof IUser]: value,
        },
      });
      if (!userData) {
        throw new Error("Invalid Data Try Again", {
          cause: "Validation Error",
        });
      }
      return userData.toJSON();
    } catch (e: any) {
      if (e.cause === "Validation Error") {
        throw new Error("Invalid Data Try Again", {
          cause: "Validation Error",
        });
      } else throw new Error(e);
    }
  }

  async logInUser(user: Partial<IUser>): Promise<[IUser, string, string]> {
    try {
      const userData = await this.checkUserExists("email", user.email);
      if (userData) {
        try {
          const validate = await bcrypt.compare(
            user.password,
            userData.password
          );
          if (validate) {
            delete userData.password;
            const [token, expirationDate] = await this.generateOrUpdateSession(
              userData.uid
            );
            return [userData, token, expirationDate];
          } else {
            throw new Error("Invalid Data Try Again", {
              cause: "Validation Error",
            });
          }
        } catch (e: any) {
          if (e.cause === "Validation Error") {
            throw new Error(e.message, {
              cause: "Validation Error",
            });
          } else throw new Error(e);
        }
      }
    } catch (e: any) {
      if (e.cause === "Validation Error") {
        throw new Error(e.message, {
          cause: "Validation Error",
        });
      } else throw new Error(e);
    }
  }
}
