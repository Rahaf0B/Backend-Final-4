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
    type: DataType.INTEGER,
  })
  declare normal_uid: number;

  @BelongsTo(() => Normal_User, {
    foreignKey: "normal_uid",
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

  @AllowNull(false)
  @Column({
    type: DataType.STRING,
  })
  declare comment: string;

  declare product_id: number;
  @BelongsTo(() => Product, {
    foreignKey: "product_id",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  product: Product;
}

export default Rating;
