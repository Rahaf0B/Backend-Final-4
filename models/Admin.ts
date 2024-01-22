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
} from "sequelize-typescript";
import { IAdmin } from "../interfaces/objInterfaces";
import User from "./User";

@Table({
  timestamps: false,
  tableName: "admin",
  modelName: "Admin",
})
class Admin extends Model<IAdmin> implements IAdmin {
  @AllowNull(false)
  @PrimaryKey
  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    field: "admin_uid",
  })
  uid?: number;

  @BelongsTo(() => User, {
    foreignKey: "uid",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  user: User;
}

export default Admin;
