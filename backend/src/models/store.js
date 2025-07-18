import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const storeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,

    },
    phone: {
        type: String,
        required: true,
        unique: true,

    },
    location: {
        city: { type: String, required: true,unique: true},
        address: { type: String, required: true ,unique: true},
        coordinates: {
            lat: { type: Number },
            lng: { type: Number },
        }
    },
    storePicture: {
        type: String,
        default: "",
    },
});

const Store = mongoose.model("Store", storeSchema);
export default Store;
