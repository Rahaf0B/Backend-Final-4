import {
  Sequelize,
  DataType,
  Model,
  Table,
  Column,
  PrimaryKey,
  AutoIncrement,
  ForeignKey,
  HasMany,
  AllowNull,
  BelongsTo,
  IsEmail,
  Length,
} from "sequelize-typescript";
import { IOrder } from "../interfaces/objInterfaces";
import Order_item from "./Order_item";
import Address from "./Address";
import Normal_User from "./Normal_user";
import moment from "moment";
import { NOW } from "sequelize";

@Table({
  timestamps: false,
  tableName: "order",
  modelName: "Order",
})
class Order extends Model<IOrder> implements IOrder {
  @AllowNull(false)
  @PrimaryKey
  @AutoIncrement
  @Column({
    type: DataType.INTEGER,
  })
  declare order_id?: number;

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

  @AllowNull(false)
  @Column({
    type: DataType.DOUBLE,
  })
  declare total_price: number;

  @AllowNull(false)
  @Column({
    type: DataType.INTEGER,
    values: ["0", "1", "2"],
  })
  declare status: number;

  @AllowNull(false)
  @Column({
    type: DataType.BOOLEAN,
  })
  declare payment_status: boolean;

  @AllowNull(false)
  @Column({
    type: DataType.STRING,
  })
  declare payment_type?: string;

  @AllowNull(false)
  @Column({
    type: DataType.DATEONLY,
    defaultValue:NOW
  })
  get date(): string {
    return this.getDataValue("date")
      ? moment(this.getDataValue("date"), "YYYY-MM-DD").format("YYYY-MM-DD")
      : "";
  }

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
    type: DataType.BIGINT,
  })
  declare phone_number: number;
  
  @AllowNull(false)
  @ForeignKey(() => Address)
  @Column({
    type: DataType.INTEGER,
  })
  declare address_id?: number;
  @BelongsTo(() => Address, { foreignKey: "address_id" })
  declare address?: Address;

  @HasMany(() => Order_item, { foreignKey: "order_id" })
  declare order_items: Order_item[];
}

export default Order;
