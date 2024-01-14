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
} from "sequelize-typescript";
import { IUser } from "../interfaces/objInterfaces";
import Normal_User from "./Normal_user";
import Admin from "./Admin";
import Session from "./Session";

@Table({
  timestamps: false,
  tableName: "user",
  modelName: "User",
})
class User extends Model<IUser> implements IUser {
  @AllowNull(false)
  @PrimaryKey
  @Column({
    type: DataType.STRING,
  })
  declare uid?: string;

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
    type: DataType.STRING,
    values: ["Admin", "Normal_user"],
  })
  declare type?: string;

  
  @HasMany(() => Session, {
    foreignKey: "uid",
    })
  declare Session: Session[];

  
  @HasOne(() => Normal_User, {
    foreignKey: "admin_uid",
  })
  declare normal_user: Normal_User;

  @HasOne(() => Admin, {
    foreignKey: "normal_uid",
  })
  declare admin: Admin;
}

export default User;
