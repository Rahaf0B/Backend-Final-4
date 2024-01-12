import {
  Model,
  Table,
  Column,
  ForeignKey,
  DataType,
  BelongsTo,
} from "sequelize-typescript";
import Product from "./Product";
import Wishlist from "./Wishlist";

@Table({
  timestamps: false,
  tableName: "product_wishlist",
  modelName: "Product_wishlist",
})
class Product_wishlist extends Model {
  @ForeignKey(() => Product)
  @Column({
    type: DataType.INTEGER,
  })
  product_id: number;

  @ForeignKey(() => Wishlist)
  @Column({
    type: DataType.INTEGER,
  })
  wishlist_id: number;

  @BelongsTo(() => Product, {
    foreignKey: "product_id",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  product: Product;

  @BelongsTo(() => Wishlist, {
    foreignKey: "wishlist_id",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  wishlist: Wishlist;
}
export default Product_wishlist;
