import {
  Sequelize,
  DataType,
  Model,
  Table,
  Column,
  PrimaryKey,
  AutoIncrement,
  ForeignKey,
  AllowNull,
  BelongsTo,
} from "sequelize-typescript";
import { IOrder_item } from "../interfaces/objInterfaces";
import Order from "./Order";
import Product from "./Product";
import Normal_User from "./Normal_user";

@Table({
  timestamps: false,
  tableName: "order_item",
  modelName: "Order_item",
})
class Order_item extends Model<IOrder_item> implements IOrder_item {
  @AllowNull(false)
  @PrimaryKey
  @AutoIncrement
  @Column({
    type: DataType.INTEGER,
  })
  declare order_item_id?: number;

  @AllowNull(false)
  @ForeignKey(() => Product)
  @Column({
    type: DataType.INTEGER,
  })
  declare product_id: number;
  @BelongsTo(() => Product, {
    as:"product_item",
    foreignKey: "product_id",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  product: Product;

  @AllowNull(false)
  @Column({
    type: DataType.INTEGER,
  })
  declare quantity: number;

  @AllowNull(false)
  @ForeignKey(() => Normal_User)
  @Column({
    type: DataType.STRING,
  })
  declare normal_uid: string;
  @BelongsTo(() => Normal_User, {
    foreignKey: "normal_uid",
    as:"user",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })

  @AllowNull(false)
  @Column({
    type: DataType.DOUBLE,
  })
  declare item_price: number;

  @AllowNull(false)
  @ForeignKey(() => Order)
  @Column({
    type: DataType.INTEGER,
  })
  declare order_id: number;

  @BelongsTo(() => Order, {
    as:"order_info",
    foreignKey: "order_id",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  order: Order;
}

export default Order_item;
