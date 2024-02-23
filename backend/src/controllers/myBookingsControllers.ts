import { Request, Response } from "express";
import Hotel from "../models/hoterModel";
import { hotelType } from "../shared/types";



export const allMyBookings = async(req:Request,res:Response) => {
    try {
        const hotels = await Hotel.find({
            // bookings:{$eleMatch:{userId:req.userId}}
            "bookings.userId": req.userId
        });

        const results = hotels.map((hotel)=>{
            const userBookings = hotel.bookings.filter(
                (booking)=> booking.userId === req.userId
            )

            const hotelWithUserBookings: hotelType = {
                ...hotel.toObject(),
                bookings:userBookings
            };
            return hotelWithUserBookings;
        });

        res.status(200).send(results);

        
    
    } catch (error) {
        console.log(error);
        res.status(500).json({message:"Unable to fetch bookings"});
        
    }
} 