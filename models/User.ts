import {
  Sequelize,
  DataType,
  Model,
  Table,
  Column,
  PrimaryKey,
  AllowNull,
  Unique,
  Length,
  IsEmail,
  HasOne,
  HasMany,
  AutoIncrement,
  AfterCreate,
  BeforeCreate,
} from "sequelize-typescript";
import { IUser } from "../interfaces/objInterfaces";
import Normal_User from "./Normal_user";
import Admin from "./Admin";
import Session from "./Session";
import bcrypt from "bcrypt";

@Table({
  timestamps: false,
  tableName: "user",
  modelName: "User",
})
class User extends Model<IUser> implements IUser {
  @AllowNull(false)
  @PrimaryKey
  @AutoIncrement
  @Column({
    type: DataType.INTEGER,
  })
  declare uid?: number;

  @AllowNull(false)
  @Length({ min: 3, max: 10 })
  @Column({
    type: DataType.STRING(10),
  })
  declare first_name: string;

  @AllowNull(false)
  @Length({ min: 3, max: 10 })
  @Column({
    type: DataType.STRING(10),
  })
  declare last_name: string;

  @Unique(true)
  @IsEmail
  @AllowNull(false)
  @Column({
    type: DataType.STRING,
  })
  declare email: string;

  @AllowNull(false)
  @Column({
    type: DataType.STRING(100),
    values: ["admin", "normal_user"],
  })
  declare type?: string;

  @AllowNull(false)
  @Column({
    type: DataType.STRING(1000),
  })
  declare password?: string;

  @HasMany(() => Session, {
    foreignKey: "uid",
  })
  declare Session: Session[];

  @HasOne(() => Normal_User, {
    foreignKey: "normal_uid",
  })
  declare normal_user: Normal_User;

  @HasOne(() => Admin, {
    foreignKey: "admin_uid",
  })
  declare admin: Admin;

  @BeforeCreate
  static passwordEncryption(instance: User) {
    try {
      const salt = bcrypt.genSaltSync(10);
      instance.password = bcrypt.hashSync(instance.password, salt);
    } catch (e: any) {
      throw new Error(e.message);
    }
  }
}

export default User;
