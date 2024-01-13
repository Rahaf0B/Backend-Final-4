import {
  Sequelize,
  DataType,
  Model,
  Table,
  Column,
  PrimaryKey,
  ForeignKey,
  HasMany,
  AllowNull,
  BelongsTo,
  HasOne,
} from "sequelize-typescript";
import { INormal_user } from "../interfaces/objInterfaces";
import moment from "moment";
import Image from "./Image";
import User from "./User";
import Rating from "./Rating";
import Wishlist from "./Wishlist";
import Order from "./Order";
import Order_item from "./Order_item";
import Cart from "./Cart";

@Table({
  timestamps: false,
  tableName: "normal_User",
  modelName: "Normal_User",
})
class Normal_User extends Model<INormal_user> implements INormal_user {
  @ForeignKey(() => User)
  @AllowNull(false)
  @PrimaryKey
  @Column({
    type: DataType.STRING,
  })
  declare normal_uid: string;
  @BelongsTo(() => User, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  user: User;

  @Column({
    type: DataType.DATEONLY,
  })
  get DOB(): string {
    return moment(this.getDataValue("DOB"), "YYYY-MM-DD").format("YYYY-MM-DD");
  }

  @Column({
    type: DataType.INTEGER,
  })
  declare age?: number;

  @Column({
    type: DataType.INTEGER,
  })
  declare phone_number?: number;

  @HasOne(() => Image, {
    foreignKey: "image_id",
  })
  declare image_id?: Image;

  @HasMany(() => Rating, {
    foreignKey: "normal_uid",
  })
  declare rating: Rating[];

  @HasMany(() => Wishlist, {
    foreignKey: "normal_uid",
  })
  declare wishlist?: Wishlist[];

  @HasMany(() => Cart, {
    foreignKey: "normal_uid",
  })
  declare cart?: Cart[];

  @HasMany(() => Order, {
    foreignKey: "normal_uid",
  })
  declare orders?: Order[];

  @HasMany(() => Order_item, {
    foreignKey: "normal_uid",
  })
  declare order_items?: Order_item[];

}

export default Normal_User;
