import {
    Sequelize,
    DataType,
    Model,
    Table,
    Column,
    PrimaryKey,
    ForeignKey,
    AllowNull,
    BelongsTo,
    AutoIncrement,
    BelongsToMany,
  } from "sequelize-typescript";
  import { ICart } from "../interfaces/objInterfaces";
  import Normal_User from "./Normal_user";
  import Product from "./Product";
  import Product_cart from "./Product_cart";
  
  @Table({
    timestamps: false,
    tableName: "cart",
    modelName: "Cart",
  })
  class Cart extends Model<ICart> implements ICart {
    @AllowNull(false)
    @PrimaryKey
    @AutoIncrement
    @Column({
      type: DataType.INTEGER,
    })
    declare cart_id?: number;
  
    @AllowNull(false)
    @ForeignKey(() => Normal_User)
    @Column({
      type: DataType.INTEGER,
    })
    declare normal_uid: number;
    
    @BelongsTo(() => Normal_User, {
      foreignKey: "normal_uid",
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    })
    user: Normal_User;
  
    @BelongsToMany(() => Product, () => Product_cart)
    declare product: Product[];
  }
  
  export default Cart;
  