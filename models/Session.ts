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
    Unique,
    BeforeUpdate,
    BeforeCreate,
    BelongsTo,
    Association,
    IsEmail,
    Length,
    Is,
  } from "sequelize-typescript";
import User from "./User";
import moment from "moment";


  @Table({
    timestamps:false,
    tableName: "session",
    modelName: "Session",
  })
  class Session extends Model {

    @AllowNull(false)
    @PrimaryKey
    @AutoIncrement
    @Column({
      type: DataType.INTEGER,
    })
    declare session_id?: number;

    @AllowNull(false)
    @Column({
      type: DataType.DATE,
    })
    get expiration_date(): string{
      return moment(this.getDataValue("expiration_date").toString(),'YYYY-MM-DD').format('YYYY-MM-DD')

    }

    @Unique(true)
    @AllowNull(false)
    @Column({
      type: DataType.STRING(500),
      onDelete: "CASCADE",
    })
    declare token: string;


    @AllowNull(false)
  @ForeignKey(() => User)
  @Column({
    type: DataType.STRING,
  })
  declare uid: string;

  @BelongsTo(() => User, { foreignKey: "uid",   onDelete: "CASCADE",
  onUpdate: "CASCADE", })
  declare User: User;


  }


  export default Session;