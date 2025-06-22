import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    brandName: {
        type: String,
        required: true,
    },
    rating: {
        type: Number,
        required: true,
    },
    image: {
        type: [String],
        required: true,
    },
    size: {
        type: String,
        enum: ["S", "M", "L", "XL", "XXL"],
    },
    category: {
        type: String,
        required: true,
    },
    
    clothing: {
        type: String,
        enum: ["mens", "women", "genz", "luxury"], 
        required: true,
    },

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    inStock: {
        type: Number,
        default: 0,
    }

})


export const Product = mongoose.model("Product", productSchema);