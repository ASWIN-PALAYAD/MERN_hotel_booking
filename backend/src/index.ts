import express,{Request,Response} from 'express';
import cors from 'cors';
import 'dotenv/config';
import dbConnect from './config/dbConnect';
import userRoutes from './routes/usersRoutes'
import authRoutes from './routes/authRoutes';
import cookieParser from 'cookie-parser';
import path from 'path';




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



app.listen(5001,()=>{
    dbConnect();
    console.log('Server running on localhost:5001'); 
    
})