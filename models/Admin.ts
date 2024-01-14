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
  @ForeignKey(() => User)
  @AllowNull(false)
  @PrimaryKey
  @Column({
    type: DataType.INTEGER,
  })
  declare admin_uid: number;
  @BelongsTo(() => User, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
 declare user: User;
}

export default Admin;
