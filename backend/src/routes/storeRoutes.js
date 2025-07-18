import express from 'express';
import Store from '../models/store.js';
import SparePart from '../models/sparePart.js';

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const stores = await Store.find();
        res.status(200).json(stores);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error', error });
        console.error('Error fetching stores:', error);
    }
});
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const store = await Store.findById(id);
        if (!store) {
            return res.status(404).json({ message: 'Store not found' });
        }
        res.status(200).json(store);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error', error });
        console.error('Error fetching store:', error);
    }
});
router.get('/:id/spareParts', async (req, res) => {
    const { id } = req.params;
    try {
        const spareParts = await SparePart.find({ storeId: id });
        if (!spareParts) {
            return res.status(404).json({ message: 'No spare parts found for this store' });
        }
        res.status(200).json(spareParts);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error', error });
        console.error('Error fetching spare parts:', error);
    }
});

export const StoreRoutes = router;
