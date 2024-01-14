import {
    Model,
    Table,
    Column,
    ForeignKey,
    DataType,
    BelongsTo,
  } from "sequelize-typescript";
  import Product from "./Product";
import Cart from "./Cart";
  

  @Table({
    timestamps: false,
    tableName: "product_cart",
    modelName: "Product_cart",
  })
  class Product_cart extends Model {
    @ForeignKey(() => Product)
    @Column({
      type: DataType.INTEGER,
    })
   declare product_id: number;
  
    @ForeignKey(() => Cart)
    @Column({
      type: DataType.INTEGER,
    })
   declare cart_id: number;
  
    @BelongsTo(() => Product, {
      foreignKey: "product_id",
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    })
    declare product: Product;
  
    @BelongsTo(() => Cart, {
      foreignKey: "cart_id",
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    })
    declare  cart: Cart;
  }
  export default Product_cart;
  