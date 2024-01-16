import express from "express";
import productRoutes from './routes/products';
import brandRoutes from './routes/brands'
import cartRoutes from './routes/cart';
import wishListRoutes from './routes/wishlist';
import orderRoutes from './routes/order';
import authRoutes from './routes/user';
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const port = 3000;
app.use('/product',productRoutes);
app.use('/brand',brandRoutes);
app.use('/cart',cartRoutes);
app.use('/wishlist',wishListRoutes);
app.use('/order',orderRoutes);
app.use('/auth',authRoutes);

app.use(async (req:any, res:any, next:any)=>{ 
  res.status(404).send({message:"Not Found"});
});

app.listen(port, () => {
  console.log("Express app is listening on the port 3000!");
});
