import { Sequelize } from "sequelize-typescript";
import dbConfig from "../db.config";
import Address from "../models/Address";
import Admin from "../models/Admin";
import Brand from "../models/Brand";
import Category from "../models/Category";
import Discount from "../models/Discount";
import Image from "../models/Image";
import Normal_User from "../models/Normal_user";
import Order_item from "../models/Order_item";
import Order from "../models/Order";
import Product_discount from "../models/Product_discount";
import Product from "../models/Product";
import Rating from "../models/Rating";
import User from "../models/User";
import Wishlist from "../models/Wishlist";
import Product_wishlist from "../models/product_wishlist";
import Cart from "../models/Cart";
import Product_cart from "../models/Product_cart";
import Session from "../models/Session";


const sequelize = new Sequelize({
  database: dbConfig.DB,

  username: dbConfig.USER,
  password: dbConfig.PASSWORD,
  host: dbConfig.Host,
  port: 3306,
  dialect: "mysql",
});

sequelize.addModels([Address,Admin,Brand,Cart,Category,Discount,Image,Normal_User,Order_item,Order,Product_cart,Product_discount,Product_wishlist,Product,Rating,Session,User,Wishlist]);
sequelize
  .authenticate()
  .then(() => {
    console.log("Connection has been established successfully.");
    //sequelize.sync();//{ alter: true , force: false }
  })
  .catch((error) => {
    console.error("Unable to connect to the database:", error);
  });

export default {sequelize};
