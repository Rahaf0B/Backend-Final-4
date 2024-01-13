import express from "express";
import {Sequelize} from 'sequelize';
import './conections/sequelizeConnection'
import userRoutes from './routes/user'
const app = express();

app.use('/auth',userRoutes);

app.use(async (req, res, next)=>{ 
  res.status(404).send({message:"Not Found"});
});

app.listen(3000, () => {
  console.log("Express app is listening on the port 3000!");
});
