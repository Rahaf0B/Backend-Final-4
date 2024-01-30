import { Sequelize } from "sequelize-typescript";
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
import dotenv from 'dotenv'
dotenv.config();

const sequelize = new Sequelize({
  database: process.env.DB,

  username: process.env.USER,
  password: process.env.PASSWORD,
  host: process.env.Host,
  port: 3306,
  dialect: "mysql",
});

sequelize.addModels([Rating,Address,Admin,Brand,Cart,Category,Discount,Image,Normal_User,Order_item,Order,Product_cart,Product_discount,Product_wishlist,Product,Session,User,Wishlist]);
sequelize
  .authenticate()
  .then(() => {
    console.log("Connection has been established successfully.");
    sequelize.sync({alter:true});//{ alter: true , force: false }
  })
  .catch((error) => {
    console.error("Unable to connect to the database:", error);
  });

export default {sequelize};