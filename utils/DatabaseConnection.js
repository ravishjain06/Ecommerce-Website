import mongoose from "mongoose";

export const connectToDatabase = async () => {
    const mongoURI = process.env.MONGODB_URI;
    if (!mongoURI) {
        console.error("❌ MONGODB_URI is not set in environment variables");
        process.exit(1);
    }

    try {
        await mongoose.connect(mongoURI);
        console.log(`Connected to MongoDB`);
    } catch (error) {
        console.error("❌ Failed to connect to MongoDB:", error.message);
        process.exit(1);
    }
};
