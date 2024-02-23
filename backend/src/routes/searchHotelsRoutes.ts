import express from "express";
import { hotelBooking, paymentIntent, searchHotels, singleHotelDetails } from "../controllers/searchControllers";
import { param } from "express-validator";
import Stripe from "stripe";
import verifyToken from "../middlewares/auth";

const stripe = new Stripe(process.env.STRIPE_API_KEY as string);
const router = express.Router();

router.get('/search',searchHotels);
router.get('/:id',[param("id").notEmpty().withMessage("Hotel ID is required")],singleHotelDetails);
router.post('/:hotelId/bookings/payment-intent',verifyToken,paymentIntent);
router.post('/:hotelId/bookings/confirm',verifyToken,hotelBooking);

export default router;