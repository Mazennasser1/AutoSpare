import express from 'express';
import mongoose from 'mongoose';
import Booking from '../models/booking.js';
import SparePart from '../models/sparePart.js';

const router = express.Router();

// Create new bookings with stock management
router.post('/', async (req, res) => {
    const { userId, cartItems } = req.body;
    
    if (!userId || !cartItems || cartItems.length === 0) {
        return res.status(400).json({ 
            success: false,
            message: 'User ID and cart items are required' 
        });
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        // Validate stock and prepare bookings
        const bookingPromises = cartItems.map(async (cartItem) => {
            const part = await SparePart.findById(cartItem._id).session(session);
            if (!part) {
                throw new Error(`Part ${cartItem._id} not found`);
            }
            if (part.quantity < cartItem.quantity) {
                throw new Error(`Insufficient stock for ${part.name}. Available: ${part.quantity}`);
            }

            // Reduce available quantity
            await SparePart.findByIdAndUpdate(
                cartItem._id,
                { $inc: { quantity: -cartItem.quantity } },
                { session }
            );

            return {
                userId,
                storeId: cartItem.storeId,
                partId: cartItem._id,
                quantity: cartItem.quantity,
                status: 'pending',
                pickupDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
                notes: cartItem.notes || `Reservation for ${part.name}`
            };
        });

        const bookings = await Promise.all(bookingPromises);
        const createdBookings = await Booking.insertMany(bookings, { session });

        await session.commitTransaction();
        
        res.status(201).json({
            success: true,
            message: 'Booking completed successfully',
            bookings: createdBookings
        });

    } catch (error) {
        await session.abortTransaction();
        console.error('Error creating booking:', error.message);
        res.status(400).json({ 
            success: false,
            message: error.message || 'Failed to create booking'
        });
    } finally {
        session.endSession();
    }
});

// Get user bookings
router.get('/user/:userId', async (req, res) => {
    try {
        const bookings = await Booking.find({ 
            userId: req.params.userId,
            status: { $ne: 'cancelled' } 
        })
        .populate('storeId', 'name location')
        .populate('partId', 'name price image');
        
        res.status(200).json({ 
            success: true,
            bookings: bookings || []
        });
    } catch (error) {
        console.error('Error fetching bookings:', error.message);
        res.status(500).json({ 
            success: false,
            message: 'Failed to fetch bookings' 
        });
    }
});

// Booking expiration check
const checkExpiredBookings = async () => {
    const session = await mongoose.startSession();
    try {
        await session.withTransaction(async () => {
            const twoDaysAgo = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000);
            
            const expiredBookings = await Booking.find({
                status: 'pending',
                $or: [
                    { pickupDate: { $lt: new Date() } },
                    { createdAt: { $lt: twoDaysAgo } }
                ]
            }).session(session);

            if (expiredBookings.length > 0) {
                // Restore stock
                await Promise.all(expiredBookings.map(async (booking) => {
                    await SparePart.findByIdAndUpdate(
                        booking.partId,
                        { $inc: { quantity: booking.quantity } },
                        { session }
                    );
                }));

                // Update status
                await Booking.updateMany(
                    { _id: { $in: expiredBookings.map(b => b._id) } },
                    { $set: { status: 'cancelled' } },
                    { session }
                );

                console.log(`Cancelled ${expiredBookings.length} expired bookings`);
            }
        });
    } catch (error) {
        console.error('Error in booking cleanup:', error.message);
    } finally {
        session.endSession();
    }
};

// Run cleanup every hour
setInterval(checkExpiredBookings, 60 * 60 * 1000);
// Initial run
checkExpiredBookings();

export const BookingRoutes = router;