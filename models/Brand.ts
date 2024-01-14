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
  HasOne,
  ForeignKey,
  BelongsTo,
} from "sequelize-typescript";
import { IBrand } from "../interfaces/objInterfaces";
import Image from "./Image";
import Product from "./Product";
import Discount from "./Discount";

@Table({
  timestamps: false,
  tableName: "brand",
  modelName: "Brand",
})
class Brand extends Model<IBrand> implements IBrand {
  @AllowNull(false)
  @PrimaryKey
  @AutoIncrement
  @Column({
    type: DataType.INTEGER,
  })
  declare brand_id?: number;

  @Unique(true)
  @AllowNull(false)
  @Column({
    type: DataType.STRING,
  })
  declare name: string;

  @HasOne(() => Image, {
    foreignKey: "image_id",
  })
  declare image?: Image;

  @ForeignKey(() => Discount)
  @Column({
    type: DataType.INTEGER,
  })
  declare discount_id?: number;

  @BelongsTo(() => Discount, { foreignKey: "discount_id" })
  declare discount?: Discount;

  @HasMany(() => Product, { foreignKey: "brand_id" })
  declare products?: Product[];
}

export default Brand;
