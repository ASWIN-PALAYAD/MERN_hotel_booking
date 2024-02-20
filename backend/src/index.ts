import express,{Request,Response} from 'express';
import cors from 'cors';
import 'dotenv/config';
import dbConnect from './config/dbConnect';
import userRoutes from './routes/usersRoutes'
import authRoutes from './routes/authRoutes';
import myHotelRoutes from './routes/myHotelsRoutes';
import cookieParser from 'cookie-parser';
import path from 'path';
import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET
})


const app = express();

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cors({
    origin:process.env.FRONTEND_URL,
    credentials:true,
}));


app.use(express.static(path.join(__dirname,"../../frontend/dist")));

app.use('/api/auth',authRoutes)
app.use('/api/users',userRoutes);
app.use('/api/my-hotels',myHotelRoutes);

app.get('*',(req:Request,res:Response)=> {
    res.send(path.join(__dirname,"../../frontend/dist/index.html"));
})



app.listen(5001,()=>{
    dbConnect();
    console.log('Server running on localhost:5001'); 
    
})  