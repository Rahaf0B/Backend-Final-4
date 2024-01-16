import express from "express";
import routes from './routes/routes';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const port = 3000;
app.use(routes.router);

app.use(async (req:any, res:any, next:any)=>{ 
  res.status(404).send({message:"Not Found"});
});

app.listen(port, () => {
  console.log("Express app is listening on the port 3000!");
});
