import { Request, Response } from "express";
import cloudinary from 'cloudinary';
import Hotel  from "../models/hoterModel";
import {hotelType} from '../shared/types'




export const createHotel = async(req:Request,res:Response) => {
    try {
        const imageFiles = req.files as Express.Multer.File[];
        const newHotel: hotelType = req.body;

        //1. upload the images to cloudinary
        const uploadPromises = imageFiles.map(async(image)=>{
            const b64 = Buffer.from(image.buffer).toString("base64")
            let dataURI = "data:" + image.mimetype + ";base64," +b64;
            const res = await cloudinary.v2.uploader.upload(dataURI);
            return res.url
        });
        
        //2.if upload is successfull add the url the new hotel

        const imageUrls = await Promise.all(uploadPromises);
        newHotel.imageUrls = imageUrls;
        newHotel.lastUpdated = new Date();
        newHotel.userId = req.userId;


        //3. save the new hotel in database
            const hotel = new Hotel(newHotel);
            await hotel.save();
        //4.return a 201 status
        res.status(201).send(hotel);

    } catch (error) {
        console.log("Error creating hotel:", error);
        res.status(500).json({message:"Somthing went wrong"});
        
    }
}

export const getAllMyHotels = async(req:Request,res:Response) => {
    
    try {
        const hotels = await Hotel.find({userId:req.userId});
    res.json(hotels);
    } catch (error) {
        res.status(500).json({message:"Error fetching hotels"})
    }
}