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
} from "sequelize-typescript";
import { IAddress } from "../interfaces/objInterfaces";
import Order from "./Order";

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

  @HasMany(() => Order, { foreignKey: "address_id" })
  declare orders?: Order[];
}

export default Address;
