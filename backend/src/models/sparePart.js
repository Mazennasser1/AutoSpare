import mongoose from "mongoose";

const sparePartSchema = new mongoose.Schema({
    storeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Store",
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    description: String,
    price: {
        type: Number,
        required: true,
    },
    category: String, // e.g., Engine, Brake, Electrical
    carBrand: String, // e.g., Toyota
    carModel: String, // e.g., Corolla
    carYear: Number,  // e.g., 2018
    quantity: {
        type: Number,
        default: 1,
    },
    images: [String], // Array of image URLs
    available: {
        type: Boolean,
        default: true,
    },
}, {
    timestamps: true
});

const SparePart = mongoose.model("SparePart", sparePartSchema);
export default SparePart;
