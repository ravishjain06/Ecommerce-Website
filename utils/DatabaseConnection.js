import mongoose from "mongoose";

export const connectToDatabase = async () => {
    const mongoURI = process.env.MONGODB_URI;
    if (!mongoURI) {
        console.error("❌ MONGODB_URI is not set in environment variables");
        process.exit(1);
    }

    try {
        await mongoose.connect(mongoURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log(`✅ Connected to MongoDB at ${mongoose.connection.host}`);
    } catch (error) {
        console.error("❌ Failed to connect to MongoDB:", error.message);
        process.exit(1);
    }
};
