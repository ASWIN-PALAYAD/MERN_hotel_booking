import { Request, Response } from "express";
import { validationResult } from "express-validator";
import User from "../models/userModel";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';


export const loginUser = async(req:Request,res:Response) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({message:errors.array()});
    }

    const {email,password} = req.body;

    try {
        const user = await User.findOne({email}).maxTimeMS(20000);
        if(!user){
            return res.status(400).json({message:"Invalid credentials"})
        }

        const isMatch = await bcrypt.compare(password,user.password);
        if(!isMatch){
            return res.status(400).json({message:"Invalid credentials"})
        }

        const token = jwt.sign({userId:user._id},process.env.JWT_SECRET_KEY as string,{expiresIn:'1d'});

        res.cookie("auth_token",token,{
            httpOnly:true,
            secure:process.env.NODE_ENV === "production",
            maxAge:8640000,
        });
        res.status(200).json({userId:user._id})

    } catch (error) {
        console.log(error);
        res.status(500).json({message:'Something went wrong'});
        
    }
}

export const validateToken = (req:Request, res:Response)=> {
       res.status(200).send({userId:req.userId})
}

export const logout = (req:Request,res:Response) => {
    res.cookie('auth_token',"",{
        expires:new Date(0)
    });
    res.send();
}