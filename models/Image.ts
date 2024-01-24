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
  Default,
} from "sequelize-typescript";
import { IImage } from "../interfaces/objInterfaces";
import Normal_User from "./Normal_user";
import Brand from "./Brand";
import Category from "./Category";
import Product from "./Product";
import Order_item from "./Order_item";

@Table({
  timestamps: false,
  tableName: "image",
  modelName: "Image",
})
class Image extends Model<IImage> implements IImage {
  @AllowNull(false)
  @PrimaryKey
  @AutoIncrement
  @Column({
    type: DataType.INTEGER,
  })
  declare image_id?: number;

  @AllowNull(false)
  @Column({
    type: DataType.STRING,
  })
  declare name: string;

  @AllowNull(false)
  @Column({
    type: DataType.STRING,
  })
  declare url: string;

  @AllowNull(false)
  @Default(false)
  @Column({
    type: DataType.BOOLEAN,
  })
  declare type?: boolean;

  @ForeignKey(() => Normal_User)
  @Column({
    type: DataType.INTEGER,
  })
  declare normal_uid?: number;

  @BelongsTo(() => Normal_User, {
    foreignKey: "normal_uid",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  declare user?: Normal_User;

  @ForeignKey(() => Brand)
  @Column({
    type: DataType.INTEGER,
  })
  declare brand_id?: number;

  @BelongsTo(() => Brand, {
    foreignKey: "brand_id",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  declare brand?: Brand;

  @ForeignKey(() => Category)
  @Column({
    type: DataType.INTEGER,
  })
  declare category_id?: number;

  @BelongsTo(() => Category, {
    foreignKey: "category_id",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  declare category?: Category;

  @ForeignKey(() => Product)
  @Column({
    type: DataType.INTEGER,
  })
  declare product_id?: number;

  @BelongsTo(() => Product, {
    foreignKey: "product_id",
  })
  declare product?: Product;



  @ForeignKey(() => Order_item)
  @Column({
    type: DataType.INTEGER,
  })
  declare order_item_id?: number;

  @BelongsTo(() => Order_item, {
    foreignKey: "order_item_id",
  })
  declare order_item: Order_item;

}

export default Image;