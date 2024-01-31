import express from "express";
import productRoutes from './routes/products';
import brandRoutes from './routes/brands'
import cartRoutes from './routes/cart';
import wishListRoutes from './routes/wishlist';
import orderRoutes from './routes/order';
import authRoutes from './routes/user';
import './conections/sequelizeConnection'
import './middleware/imageuploader';
const { createProxyMiddleware } = require('http-proxy-middleware');

var cors = require('cors');


const app = express();
app.use(express.json())
app.use(express.urlencoded({extended: false}))
app.use(cors({"Access-Control-Allow-Origin": "*",
credentials: true,
"Access-Control-Allow-Credentials": true,

}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const port = 3000;

app.use('/product',productRoutes);
app.use('/brand',brandRoutes);
app.use('/cart',cartRoutes);
app.use('/wishlist',wishListRoutes);
app.use('/order',orderRoutes);
app.use('/auth',authRoutes);

app.use(express.static(__dirname + '/public'));
app.use('/images/product', express.static('images/product'));
app.use('/images/brand', express.static('images/brand'));
app.use('/images/category', express.static('images/category'));
app.use('/images/user', express.static('images/user'));


app.use(async (req:any, res:any, next:any)=>{ 
  res.status(404).send({message:"Not Found"});
});

app.listen(port, () => {
  console.log("Express app is listening on the port 3000!");
});
