import express from "express";
import { searchHotels } from "../controllers/searchControllers";


const router = express.Router();


router.get('/search',searchHotels);

export default router;