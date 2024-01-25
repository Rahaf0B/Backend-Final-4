import {
  Model,
  Table,
  Column,
  ForeignKey,
  DataType,
  BelongsTo,
} from "sequelize-typescript";
import Product from "./Product";
import Discount from "./Discount";


@Table({
  timestamps: false,
  tableName: "product_discount",
  modelName: "Product_discount",
})
class Product_discount extends Model {
  @ForeignKey(() => Product)
  @Column({
    type: DataType.INTEGER,
  })
  declare product_id: number;

  @ForeignKey(() => Discount)
  @Column({
    type: DataType.INTEGER,
  })
  declare discount_id: number;



  @BelongsTo(() => Product, {
    foreignKey: "product_id",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  declare product: Product;

  @BelongsTo(() => Discount, {
    foreignKey: "discount_id",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  declare  discount: Discount;

}
export default Product_discount;