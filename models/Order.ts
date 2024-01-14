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
} from "sequelize-typescript";
import { IOrder, IOrder_item } from "../interfaces/objInterfaces";
import Order_item from "./Order_item";
import Address from "./Address";
import Normal_User from "./Normal_user";

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
    type: DataType.STRING,
  })
  declare normal_uid: number;
  @BelongsTo(() => Normal_User, {
    foreignKey: "normal_uid",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  user: Normal_User;

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
    type: DataType.BOOLEAN,
  })
  declare payment_type: string;

  @AllowNull(false)
  @ForeignKey(() => Address)
  @Column({
    type: DataType.INTEGER,
  })
  declare address_id: number;
  @BelongsTo(() => Address, { foreignKey: "address_id" })
  address: Address;

  @HasMany(() => Order_item, { foreignKey: "order_id" })
  declare items: IOrder_item[];
}

export default Order;
