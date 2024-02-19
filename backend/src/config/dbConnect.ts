import mongoose, { connection } from "mongoose";
import 'dotenv/config';


const dbConnect = async() =>{
    try {
        const connected = await mongoose.connect(process.env.MONGO_URL as string)
        // .then(()=> 
        // console.log('Connected to database:',process.env.MONGO_URL)
        // )
            
        console.log('database connected');
        
    } catch (error:any) {
        console.log(`Error:${error.message}`);
        
    }
}

export default dbConnect;