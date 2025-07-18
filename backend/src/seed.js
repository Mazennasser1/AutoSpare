import mongoose from "mongoose";
import "dotenv/config";
import { connectDB } from "./lib/db.js";
import SparePart from "./models/sparePart.js";

// Connect to DB
await connectDB();

const storeId = "686fb4069e6a72724772c1e4"; // Your store ID

// Generate 50 spare parts
const brands = ["Toyota", "Honda", "Nissan", "Hyundai", "Chevrolet"];
const models = {
  Toyota: ["Corolla", "Camry", "Yaris"],
  Honda: ["Civic", "Accord", "Jazz"],
  Nissan: ["Sunny", "Altima", "Sentra"],
  Hyundai: ["Elantra", "Tucson", "Accent"],
  Chevrolet: ["Aveo", "Cruze", "Optra"]
};
const categories = ["Engine", "Brake", "Electrical", "Suspension", "Cooling"];
const years = [2015, 2016, 2017, 2018, 2019, 2020];

const parts = [];

for (let i = 0; i < 50; i++) {
  const brand = brands[Math.floor(Math.random() * brands.length)];
  const modelList = models[brand];
  const model = modelList[Math.floor(Math.random() * modelList.length)];
  const category = categories[Math.floor(Math.random() * categories.length)];
  const year = years[Math.floor(Math.random() * years.length)];

  parts.push({
    storeId: storeId,
    name: `${brand} ${model} ${category} Part`,
    description: `High-quality ${category.toLowerCase()} part for ${brand} ${model} ${year}`,
    price: Math.floor(Math.random() * 500 + 100), // 100-600
    category: category,
    carBrand: brand,
    carModel: model,
    carYear: year,
    quantity: Math.floor(Math.random() * 20 + 1),
    images: [`https://via.placeholder.com/300x200.png?text=${brand}+${category}`],
    available: true,
  });
}

try {
  await SparePart.insertMany(parts);
  console.log("✅ 50 Spare parts inserted successfully.");
} catch (err) {
  console.error("❌ Error inserting spare parts:", err);
}

process.exit();
