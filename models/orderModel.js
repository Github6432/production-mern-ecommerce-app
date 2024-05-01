import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    products: [{
        type: mongoose.ObjectId,
        ref: 'Product',
    }],
    payment: {},
    buyer: {
        type: mongoose.ObjectId,
        ref: 'Users',
    },
    status: {
        type: String,
        default: 'Not Process',
        enum: ['Not Process', 'Processing', 'Shiped', 'Deliverd', 'Cancel'],
    },
}, {timestamps: true});

export default mongoose.model("Order", orderSchema);