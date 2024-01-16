import express from "express";
import {Sequelize} from 'sequelize';
import routes from './routes/routes';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const port = 3000;
app.use(routes.router);


const app = express();



app.use(async (req, res, next)=>{ 
  res.status(404).send({message:"Not Found"});
});

app.listen(port, () => {

app.listen(3000, () => {
  console.log("Express app is listening on the port 3000!");
});
