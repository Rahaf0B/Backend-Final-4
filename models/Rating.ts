import {
  Sequelize,
  DataType,
  Model,
  Table,
  Column,
  PrimaryKey,
  AutoIncrement,
  ForeignKey,
  AllowNull,
  BelongsTo,
} from "sequelize-typescript";
import { IRating } from "../interfaces/objInterfaces";
import Normal_User from "./Normal_user";
import Product from "./Product";

@Table({
  timestamps: false,
  tableName: "rating",
  modelName: "Rating",
})
class Rating extends Model<IRating> implements IRating {
  @AllowNull(false)
  @PrimaryKey
  @AutoIncrement
  @Column({
    type: DataType.INTEGER,
  })
  declare rating_id?: number;

  @AllowNull(false)
  @ForeignKey(() => Normal_User)
  @Column({
    type: DataType.STRING,
  })
  declare user_id: string;

  @BelongsTo(() => Normal_User, {
    foreignKey: "user_id",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  user: Normal_User;

  @Column({
    type: DataType.INTEGER,
  })
  declare values: number;

  @AllowNull(false)
  @ForeignKey(() => Product)
  @Column({
    type: DataType.INTEGER,
  })
  declare product_id: number;
  @BelongsTo(() => Product, {
    foreignKey: "product_id",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  product: Product;
}

export default Rating;
