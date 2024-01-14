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
  HasOne,
} from "sequelize-typescript";
import { IOrder_item } from "../interfaces/objInterfaces";
import Order from "./Order";
import Product from "./Product";
import Normal_User from "./Normal_user";
import Image from "./Image";

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
    as: "product_item",
    foreignKey: "product_id",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  declare product: Product;

  @AllowNull(false)
  @Column({
    type: DataType.INTEGER,
  })
  declare quantity: number;

  @AllowNull(false)
  @ForeignKey(() => Normal_User)
  @Column({
    type: DataType.INTEGER,
  })
  declare normal_uid: number;
  @BelongsTo(() => Normal_User, {
    foreignKey: "normal_uid",
    as: "user",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  @AllowNull(false)
  @Column({
    type: DataType.STRING,
  })
  declare item_name: string;

  @HasOne(() => Image, {
    foreignKey: "image_id",
  })
  declare image_id: Image;

  @AllowNull(false)
  @Column({
    type: DataType.DOUBLE,
  })
  declare item_price: number;

  @Column({
    type: DataType.STRING,
  })
  declare item_sub_title?: string;

  @AllowNull(false)
  @ForeignKey(() => Order)
  @Column({
    type: DataType.INTEGER,
  })
  declare order_id: number;

  @BelongsTo(() => Order, {
    as: "order_info",
    foreignKey: "order_id",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  declare order: Order;
}

export default Order_item;
