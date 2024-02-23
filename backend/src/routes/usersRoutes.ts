import express from 'express';
import { myDetails, userRegister } from '../controllers/userControllers';
import { check } from 'express-validator';
import verifyToken from '../middlewares/auth';


const router = express.Router();



//routes

router.get('/me',verifyToken,myDetails)

router.post('/register',[
    check("firstName","Fistst Name  is required").isString(),
    check("lastName","Last Name is required").isString(),
    check("email","Email is required").isEmail(),
    check("password","password with 6 or more charactor required").isLength({min:6})
], userRegister);



export default router;