import {
  Sequelize,
  DataType,
  Model,
  Table,
  Column,
  PrimaryKey,
  AutoIncrement,
  BelongsToMany,
  AllowNull,
  HasMany,
} from "sequelize-typescript";
import { IDiscount } from "../interfaces/objInterfaces";
import Product from "./Product";
import Product_discount from "./Product_discount";
import Brand from "./Brand";
import Category from "./Category";

@Table({
  timestamps: false,
  tableName: "discount",
  modelName: "Discount",
})
class Discount extends Model<IDiscount> implements IDiscount {
  @AllowNull(false)
  @PrimaryKey
  @AutoIncrement
  @Column({
    type: DataType.INTEGER,
  })
  declare discount_id?: number;

  @AllowNull(false)
  @Column({
    type: DataType.DOUBLE,
  })
  declare value: number;

  @AllowNull(false)
  @Column({
    type: DataType.STRING,
  })
  declare type?: string;

  @BelongsToMany(() => Product, () => Product_discount)
  declare product?: Product[];
  @HasMany(() => Product_discount, { foreignKey: "discount_id" })
  declare product_discount?: Product_discount[];

  @HasMany(() => Brand, { foreignKey: "discount_id" })
  declare brands?: Brand[];

  @HasMany(() => Category, { foreignKey: "discount_id" })
  declare categories?: Category[];
}

export default Discount;