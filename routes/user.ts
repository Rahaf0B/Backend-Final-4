import express, { Router, Request, Response } from "express";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import CUser from "../classes/user";
import validation from "../middleware/validationRequest";
import authenticateUser from '../middleware/authorization'


const router = Router();

router.use(cookieParser());
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: false }));



router.post('/register', validation.UserCreateAccountValidation,async(req, res) => {
    try{
   const instance=CUser.getInstance();
   const [userData,token,refreshToken]=await instance.createUserAccount(req.body);
   res.setHeader('Authorization', 'Bearer '+ token); 
   res.setHeader('refreshToken', 'Bearer '+ refreshToken );
   res.status(200).send(userData);
    }catch(e:any){
        if(e?.cause=="unique violation"){
            res.status(400).send(e.message);
        }else{
            res.status(400).end();
        }
    }
    })



    router.post('/login', validation.UserLoginValidation,async(req, res) => {
       
        try{
            const instance=CUser.getInstance();
            const [token,refreshToken]=await instance.loginUser(req.body);
            res.setHeader('Authorization', 'Bearer '+ token); 
            res.setHeader('refreshToken', 'Bearer '+ refreshToken );
            res.status(200).send();
             }catch(e:any){
                 if(e?.cause=="invalid credential"){
                     res.status(403).send(e.message);
                 }else{
                    res.status(400).end();
                 }
             }
        })
        
        



     
  
    export default router;