import express from 'express';
import verifyToken from '../middlewares/auth';
import { allMyBookings } from '../controllers/myBookingsControllers';



const router = express.Router();


router.get('/',verifyToken,allMyBookings);

export default router