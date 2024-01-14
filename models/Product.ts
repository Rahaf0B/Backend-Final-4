import {
  Sequelize,
  DataType,
  Model,
  Table,
  Column,
  PrimaryKey,
  AutoIncrement,
  BelongsToMany,
  ForeignKey,
  HasMany,
  AllowNull,
  BelongsTo,
  Default,
  BeforeCreate,
} from "sequelize-typescript";
import { IImage, IProduct } from "../interfaces/objInterfaces";
import Image from "./Image";
import Rating from "./Rating";
import Order_item from "./Order_item";
import Product_discount from "./Product_discount";
import Discount from "./Discount";
import Brand from "./Brand";
import Category from "./Category";
import moment from "moment";
import Wishlist from "./Wishlist";
import Product_wishlist from "./product_wishlist";
import Cart from "./Cart";
import Product_cart from "./Product_cart";


@Table({
  timestamps: false,
  tableName: "product",
  modelName: "Product",
})
class Product extends Model<IProduct> implements IProduct {
  @AllowNull(false)
  @PrimaryKey
  @AutoIncrement
  @Column({
    type: DataType.INTEGER,
  })
  declare product_id?: number;

  @AllowNull(false)
  @Column({
    type: DataType.STRING,
  })
  declare name: string;

  @Column({
    type: DataType.STRING,
  })
  declare sub_title?: string;

  @Column({
    type: DataType.TEXT,
  })
  declare description?: string;

  @AllowNull(false)
  @Default(0)
  @Column({
    type: DataType.INTEGER,
  })
  declare quantity: number;

  @Column({
    type: DataType.DATEONLY,
  })
  get created_at(): string {
    return moment(this.getDataValue("created_at"), "YYYY-MM-DD").format(
      "YYYY-MM-DD"
    );
  }
  set created_at(value: string) {
    this.setDataValue("created_at", value);
  }

  @ForeignKey(() => Category)
  @Column({
    type: DataType.INTEGER,
  })
  declare category_id?: number;
  @BelongsTo(() => Category, { foreignKey: "category_id" })
  category: Category;

  @ForeignKey(() => Brand)
  @Column({
    type: DataType.INTEGER,
  })
  declare brand_id?: number;
  @BelongsTo(() => Brand, { foreignKey: "brand_id" })
  brand: Brand;

  @AllowNull(false)
  @Column({
    type: DataType.DOUBLE,
  })
  declare price: number;

  @HasMany(() => Image, { foreignKey: "product_id" })
  declare image: IImage[];

  @HasMany(() => Rating, {
    foreignKey: "product_id",
  })
  declare rating?: Rating[];

  @HasMany(() => Order_item, { foreignKey: "product_id" })
  declare order_item?: Order_item[];

  @BelongsToMany(() => Wishlist, () => Product_wishlist)
  declare wishlist?: Wishlist[];

  @BelongsToMany(() => Discount, () => Product_discount)
  declare discount?: Discount[];

  @BelongsToMany(() => Cart, () => Product_cart)
  declare cart?: Cart[];

  @BeforeCreate
  static setCreatedDate(instance: Product) {
    instance.created_at = new Date().getDate().toString();
  }
}

export default Product;
