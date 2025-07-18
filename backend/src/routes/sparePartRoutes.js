import express from 'express';
import SparePart from '../models/sparePart.js';

const router = express.Router();

// Get all spare parts
router.get('/', async (req, res) => {
    try {
        const page = req.query.page || 1;
        const limit = req.query.limit || 5;
        const skip = (page - 1) * limit;
        const spareParts = await SparePart.find()
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 }) // Sort by creation date, newest first
            .populate('storeId', 'name location'); // Populate store details
            
        const totalSpareParts = await SparePart.countDocuments();
        res.status(200).json({
            spareParts,
            total: totalSpareParts,
            page: parseInt(page),
            pages: Math.ceil(totalSpareParts / limit)
        });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error', error });
        console.error('Error fetching spare parts:', error);
    }
});
// Get spare part by ID
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const sparePart = await SparePart.findById(id).populate('storeId', 'name location ');
        if (!sparePart) {
            return res.status(404).json({ message: 'Spare part not found' });
        }
        res.status(200).json(sparePart);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error', error });
        console.error('Error fetching spare part:', error);
    }
});

export const SparePartRoutes = router;