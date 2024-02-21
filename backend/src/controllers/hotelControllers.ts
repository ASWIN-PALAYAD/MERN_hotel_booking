import { Request, Response } from "express";
import cloudinary from 'cloudinary';
import Hotel  from "../models/hoterModel";
import {hotelType} from '../shared/types'




export const createHotel = async(req:Request,res:Response) => {
    try {
        const imageFiles = req.files as Express.Multer.File[];
        const newHotel: hotelType = req.body;

        //1. upload the images to cloudinary
        const imageUrls = await uploadImages(imageFiles);


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

export const getSingleHotelDetails = async(req:Request,res:Response) => {
    const id = req.params.id.toString();
    try {
        const hotel = await Hotel.findOne({
            _id:id,
            userId:req.userId
        });
        res.json(hotel);
    } catch (error) {
        res.status(500).json({message:"Error fetching hotels"})
    }
}

export const editHotelDetails = async(req:Request,res:Response) => {
    try {
        const updatedHotel:hotelType = req.body;
        updatedHotel.lastUpdated = new Date();

        const hotel  = await Hotel.findByIdAndUpdate({
            _id : req.params.hotelId,
            userId : req.userId,
        },updatedHotel,{new:true});

        if(!hotel){
            return res.status(404).json({message:"Hotel not found"})
        }

        const files = req.files as Express.Multer.File[];
        const updatedImageUrls = await uploadImages(files);

        hotel.imageUrls = [...updatedImageUrls,...(updatedHotel.imageUrls || [])];
        await hotel.save();
        res.status(201).json(hotel);

    } catch (error) {
        res.status(500).json({message:"Something went wrong"})
    }
}



// image upload 

async function uploadImages(imageFiles: Express.Multer.File[]) {
    const uploadPromises = imageFiles.map(async (image) => {
        const b64 = Buffer.from(image.buffer).toString("base64");
        let dataURI = "data:" + image.mimetype + ";base64," + b64;
        const res = await cloudinary.v2.uploader.upload(dataURI);
        return res.url;
    });

    const imageUrls = await Promise.all(uploadPromises);
    return imageUrls;
}
