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
import { NOW } from "sequelize";
import moment from "moment";

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
  declare user: Normal_User;

  @Column({
    type: DataType.INTEGER,

  })
  declare rating_value: number;

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
  declare product: Product;

  

  @AllowNull(false)
  @Column({
    type: DataType.TEXT,
  })
  declare comment?: string;

  @AllowNull(false)
  @Column({
    type: DataType.DATEONLY,
    defaultValue:NOW
  })
  get date(): string {
    return this.getDataValue("date")
      ? moment(this.getDataValue("date"), "YYYY-MM-DD").format("YYYY-MM-DD")
      : "";
  }

}

export default Rating;