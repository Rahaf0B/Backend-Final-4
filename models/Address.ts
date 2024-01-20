import {
  Sequelize,
  DataType,
  Model,
  Table,
  Column,
  PrimaryKey,
  AutoIncrement,
  HasMany,
  AllowNull,
  Unique,
  IsEmail,
  Length,
  BelongsTo,
  ForeignKey,
} from "sequelize-typescript";
import { IAddress } from "../interfaces/objInterfaces";
import Order from "./Order";
import Normal_User from "./Normal_user";

@Table({
  timestamps: false,
  tableName: "address",
  modelName: "Address",
})
class Address extends Model<IAddress> implements IAddress {
  @AllowNull(false)
  @PrimaryKey
  @AutoIncrement
  @Column({
    type: DataType.INTEGER,
  })
  declare address_id?: number;

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

  @IsEmail
  @AllowNull(false)
  @Column({
    type: DataType.STRING,
  })
  declare email: string;

  @AllowNull(false)
  @Column({
    type: DataType.STRING,
  })
  declare location: string;

  @AllowNull(false)
  @Column({
    type: DataType.INTEGER,
  })
  declare phone_number: number;

  @AllowNull(false)
  @ForeignKey(() => Normal_User)
  @Column({
    type: DataType.INTEGER,
  })
  declare normal_uid: number;
  @BelongsTo(() => Normal_User, {
    foreignKey: "normal_uid",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  declare user: Normal_User;

  @HasMany(() => Order, { foreignKey: "address_id" })
  declare orders?: Order[];
}

export default Address;