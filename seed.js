import dotenv from "dotenv";
import { connect, disconnect } from "mongoose";
import Product from "./models/product.model.js";
import Category from "./models/category.model.js";
import Order from "./models/order.model.js";

dotenv.config();

const categories = [
  { name: "Mobile Phones", description: "Smartphones and accessories" },
  { name: "Laptops", description: "Laptops and notebooks" },
  { name: "Game Consoles", description: "Gaming consoles and accessories" },
];

connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("Connected to database successfully!");

    await Order.deleteMany();
    await Product.deleteMany();
    await Category.deleteMany();
    console.log("Old data cleared");

    const insertedCategories = await Category.insertMany(categories);
    console.log(`${insertedCategories.length} categories seeded`);

    const categoryMap = {};
    insertedCategories.forEach(cat => {
      categoryMap[cat.name] = cat._id;
    });

    const products = [
      { name: "Iphone 17", category: categoryMap["Mobile Phones"], price: 100000, stock: 10, inStock: true },
      { name: "Samsung S26", category: categoryMap["Mobile Phones"], price: 50000, stock: 0, inStock: false },
      { name: "Macbook", category: categoryMap["Laptops"], price: 200000, stock: 5, inStock: true },
      { name: "ASUS Vivobook", category: categoryMap["Laptops"], price: 40000, stock: 0, inStock: false },
      { name: "Playstation console", category: categoryMap["Game Consoles"], price: 500, stock: 8, inStock: true },
      { name: "XBox console", category: categoryMap["Game Consoles"], price: 450, stock: 0, inStock: false },
    ];

    const insertedProducts = await Product.insertMany(products);
    console.log(`${insertedProducts.length} products seeded`);

    console.log(`Seeding complete! ${insertedCategories.length} categories and ${insertedProducts.length} products added.`);
  })
  .catch(error => {
    console.error("Seeding failed:", error);
  })
  .finally(async () => {
    await disconnect();
    process.exit(0);
  });