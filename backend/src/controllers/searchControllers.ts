import { Request, Response } from "express"
import Hotel from "../models/hoterModel";
import { BookingType, HotelSearchResponse } from "../shared/types";
import { validationResult } from "express-validator";
import Stripe from "stripe";
import User from "../models/userModel";


const stripe = new Stripe(process.env.STRIPE_API_KEY as string);


//fetch single hotel details 
export const singleHotelDetails = async(req:Request,res:Response)=> {
  const errors = validationResult(req);
  if(!errors.isEmpty()){
    return res.status(400).json({errors:errors.array()}); 
  }

  const id = req.params.id.toString();

  try {
    const hotel = await Hotel.findById(id);
    res.json(hotel);
  } catch (error) {
    console.log(error);
    res.status(500).json({message:"Error fetching hotel"});
    
  }
}

//search hotels with sort and filters
export const searchHotels = async(req:Request,res:Response) => {
  
   try {

    const query = constructSearchQuery(req.query);

    let sortOptions ={}
    switch (req.query.sortOption){
        case "startRating":
            sortOptions = {starRating: -1};
            break;
        case "pricePerNightAsc":
            sortOptions = {pricePerNight: 1}
            break;
        case "pricePerNightDsc":
            sortOptions = {pricePerNight:-1}
            break;
        
    }

    const pageSize = 5;
    const pageNumber = parseInt(req.query.page ? req.query.page.toString() : "1");
    const skip = (pageNumber -1) * pageSize;

    const hotels = await Hotel.find(query).sort(sortOptions).skip(skip).limit(pageSize);
    
    const total = await Hotel.countDocuments(query);
    
    const response : HotelSearchResponse = {
        data: hotels,
        pagination:{
            total,
            page:pageNumber,
            pages: Math.ceil(total/pageSize)
        }
    };
    res.json(response);

   } catch (error) {
    console.log("error",error);
    res.status(500).json({message:"Somthing went to wrong"});
    
   }
}

//payment intent
export const paymentIntent = async(req:Request,res:Response) => {
  const {numberOfNights} = req.body;
  const hotelId  = req.params.hotelId;

  const user = await User.findById(req.userId);
  
  const hotel = await Hotel.findById(hotelId);
  if(!hotel){
    return res.status(400).json({message:"Hotel not found"});
  }
  const totalCost = hotel.pricePerNight * numberOfNights;
  

  const paymentIntent = await stripe.paymentIntents.create({
    amount:totalCost * 100,
    currency:"inr",
    description: 'Software development services',
    shipping: {
      name:JSON.stringify( user?.firstName),
      address: {
        line1: '510 Townsend St',
        city: 'calicut',
        state: 'CA',
        country: 'US',
      },
    },
    metadata:{
      hotelId,
      userId:req.userId,
    },
    
  })
 

  if(!paymentIntent.client_secret){
    return res.status(500).json({message:"Errror creating payment intent"})
  }

  const response = {
    paymentIntentId : paymentIntent.id,
    clientSecret :paymentIntent.client_secret.toString(),
    totalCost,
  };

  res.send(response)  ;

}

export const hotelBooking = async(req:Request,res:Response) => {
  
  try {
    const paymentIntentId = req.body.paymentIntentId;
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId as string,{
      apiKey: process.env.STRIPE_API_KEY as string
    });

    if(!paymentIntent){
      return res.status(400).json({message:"Payment intent not fount"});
    }

    if(
      paymentIntent.metadata.hotelId !== req.params.hotelId || 
      paymentIntent.metadata.userId !== req.userId
      ) {
        return res.status(400).json({message:"Payment intent mismatch"});
      }

      if(paymentIntent.status !== "succeeded"){
        return res.status(400).json({
          message:`payment intent not succeeded. Status ${paymentIntent.status}`
        })
      }

      const newBooking:BookingType = {
        ...req.body, 
        userId:req.userId
      };
      

      const hotel = await Hotel.findByIdAndUpdate({_id:req.params.hotelId},{
        $push:{
          bookings:newBooking,
        }
      });

      

      if(!hotel){
        return res.status(400).json({message:"hotel not found"});
      }

      await hotel.save();
      res.status(200).send();

  } catch (error) {
    console.log(error);
    res.status(500).json({message:"Somthing went wrong"});
    
  }
}



const constructSearchQuery = (queryParams: any) => {
    let constructedQuery: any = {};
  
    if (queryParams.destination) {
      constructedQuery.$or = [
        { city: new RegExp(queryParams.destination, "i") },
        { country: new RegExp(queryParams.destination, "i") },
      ];
    }
  
    if (queryParams.adultCount) {
      constructedQuery.adultCount = {
        $gte: parseInt(queryParams.adultCount),
      };
    }
  
    if (queryParams.childCount) {
      constructedQuery.childCount = {
        $gte: parseInt(queryParams.childCount),
      };
    }
  
    if (queryParams.facilities) {
      constructedQuery.facilities = {
        $all: Array.isArray(queryParams.facilities)
          ? queryParams.facilities
          : [queryParams.facilities],
      };
    }
  
    if (queryParams.types) {
      constructedQuery.type = {
        $in: Array.isArray(queryParams.types)
          ? queryParams.types
          : [queryParams.types],
      };
    }
  
    if (queryParams.stars) {
      const starRatings = Array.isArray(queryParams.stars)
        ? queryParams.stars.map((star: string) => parseInt(star))
        : parseInt(queryParams.stars);
  
      constructedQuery.starRating = { $in: starRatings };
    }
  
    if (queryParams.maxPrice) {
      constructedQuery.pricePerNight = {
        $lte: parseInt(queryParams.maxPrice).toString(),
      };
    }
  
    return constructedQuery;
  };