import {
  Model,
  Table,
  Column,
  ForeignKey,
  DataType,
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
}
export default Product_discount;
