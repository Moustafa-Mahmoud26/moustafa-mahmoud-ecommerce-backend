import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import sanitize from "express-mongo-sanitize";
import dotenv from "dotenv";
import connectDB from "./db/connection.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import errorHandler from "./middleware/errorHandler.js";
import AppError from "./utils/AppError.js";

dotenv.config();
connectDB();

const app = express();

app.use(express.json());
app.use(cors());
app.use(sanitize());
app.use(bodyParser.json({ urlencoded: true }));

app.use("/api/categories", categoryRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);

app.use((req, res, next) => {
  next(new AppError(`Route ${req.originalUrl} not found`, 404));
});

app.use(errorHandler);

const port = process.env.PORT;

app.listen(port, () => console.log(`Server is running at http://localhost:${port}.`));