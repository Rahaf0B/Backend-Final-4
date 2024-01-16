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
import { IWishlist } from "../interfaces/objInterfaces";
import Normal_User from "./Normal_user";
import Product from "./Product";
import Product_wishlist from "./product_wishlist";

@Table({
  timestamps: false,
  tableName: "wishlist",
  modelName: "Wishlist",
})
class Wishlist extends Model<IWishlist> implements IWishlist {
  @AllowNull(false)
  @PrimaryKey
  @AutoIncrement
  @Column({
    type: DataType.INTEGER,
  })
  declare wishlist_id?: number;

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

  
  @BelongsToMany(() => Product, () => Product_wishlist)
  product: Product[];
}

export default Wishlist;
