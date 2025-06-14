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