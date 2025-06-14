import  mongoose from 'mongoose';

const cartSchema = new mongoose.Schema({

    product:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
    }],
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    quantity: {
        type: Number,
        default: 1,
        required: true
    },
    totalPrice: {
        type: Number,
        required: true,
        default: 0
    },
    coupon: {
        type: String,
        default: null
    }


})

export const Cart = mongoose.model('Cart', cartSchema);