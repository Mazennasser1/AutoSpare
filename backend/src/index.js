import express from 'express';
import "dotenv/config";
import { AuthRoutes } from './routes/authRoutes.js';
import { StoreRoutes } from './routes/storeRoutes.js';
import { SparePartRoutes } from './routes/sparePartRoutes.js';
import { BookingRoutes } from './routes/bookingRoutes.js';
import { connectDB } from './lib/db.js';
import cors from 'cors';

const app = express();
app.use(cors());
const PORT = process.env.PORT || 3000;
app.use(express.json());

app.use("/api/auth",AuthRoutes);
app.use("/api/stores", StoreRoutes);
app.use("/api/spareParts", SparePartRoutes);
app.use("/api/bookings", BookingRoutes);

app.listen(PORT,'0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
    connectDB();
});


