import express from "express";
import { searchHotels, singleHotelDetails } from "../controllers/searchControllers";
import { param } from "express-validator";


const router = express.Router();

router.get('/search',searchHotels);
router.get('/:id',[param("id").notEmpty().withMessage("Hotel ID is required")],singleHotelDetails);

export default router;