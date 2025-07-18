import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    storeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Store",
        required: true,
    },
    partId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "SparePart",
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
        min: 1,
    },
    status: {
        type: String,
        enum: ["pending", "confirmed", "cancelled", "completed"],
        default: "pending",
    },
    bookedAt: {
        type: Date,
        default: Date.now,
    },
    pickupDate: Date,
    notes: String,
}, {
    timestamps: true
});

const Booking = mongoose.model("Booking", bookingSchema);
export default Booking;
