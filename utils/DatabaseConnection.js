import mongoose from "mongoose";

export const connectToDatabase = async(req , res) =>{
    try {   
        await mongoose.connect(process.env.MONGODB_URI)
        console.log("Connected to MongoDB");
        
    } catch (error) {
        console.log(error);
        
    }
}