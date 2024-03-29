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
  HasOne,
  ForeignKey,
  BelongsTo,
  Unique,
} from "sequelize-typescript";
import { ICategory } from "../interfaces/objInterfaces";
import Image from "./Image";
import Product from "./Product";
import Discount from "./Discount";

@Table({
  timestamps: false,
  tableName: "category",
  modelName: "Category",
})
class Category extends Model<ICategory> implements ICategory {
  @AllowNull(false)
  @PrimaryKey
  @AutoIncrement
  @Column({
    type: DataType.INTEGER,
  })
  declare category_id?: number;

  @Unique(true)
  @AllowNull(false)
  @Column({
    type: DataType.STRING,
  })
  declare name: string;

  @HasOne(() => Image, {
    foreignKey: "category_id",
  })
  declare image?: Image;

  @ForeignKey(() => Discount)
  @Column({
    type: DataType.INTEGER,
  })
  declare discount_id?: number;

  @BelongsTo(() => Discount, { foreignKey: "discount_id" })
  declare discount?: Discount;

  @HasMany(() => Product, { foreignKey: "category_id" })
  declare products?: Product[];
}

export default Category;