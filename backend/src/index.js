import express from 'express';
import "dotenv/config";
import { AuthRoutes } from './routes/authRoutes.js';
import { connectDB } from './lib/db.js';

const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json());

app.use("/api/auth",AuthRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    connectDB();
});


