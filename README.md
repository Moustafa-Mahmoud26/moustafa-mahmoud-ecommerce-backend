# E-Commerce REST API

A RESTful API for an e-commerce platform, built with Node.js, Express, and MongoDB (Mongoose). It supports category and product management, a shopping cart, and a full order checkout flow with stock tracking.

## Features / APIs Built

- **Categories API** — full CRUD
- **Products API** — full CRUD, dynamic filtering (category, price range, stock, search), category population
- **Cart API** — add/update/remove items, view and clear cart, server-side price and stock validation
- **Orders API** — checkout flow with stock verification and reduction, order status tracking

## Tech Stack

- **Node.js** — JavaScript runtime
- **Express.js** — web framework
- **MongoDB** — database
- **Mongoose** — ODM for MongoDB
- **express-validator** — request validation
- **express-mongo-sanitize** — protection against NoSQL injection

## Prerequisites

Before running this project, make sure you have installed:

- [Node.js](https://nodejs.org/) (v18 or higher)
- [MongoDB](https://www.mongodb.com/try/download/community) (local instance) or a [MongoDB Atlas](https://www.mongodb.com/atlas) cluster
- npm (comes bundled with Node.js)

## Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd "Ecommerce project"
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**

   Copy the example file and fill in your own values:
   ```bash
   cp .env.example .env
   ```
   See the [Environment Variables](#environment-variables) table below for what each value should be.

4. **Seed the database** (optional, but recommended for testing)
   ```bash
   npm run seed
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```
   Or, to run it in production mode:
   ```bash
   npm start
   ```

The API will be available at `http://localhost:<PORT>/api`.

## Environment Variables

Create a `.env` file in the project root with the following variables:

| Variable | Description | Example |
|---|---|---|
| `PORT` | Port the server runs on | `3000` |
| `NODE_ENV` | Environment mode (`development` or `production`) | `development` |
| `MONGO_URI` | MongoDB connection string | `mongodb://127.0.0.1:27017/ecommerce` |

A `.env.example` file is included in the repo with the same variable names and no real values, as a template.

## Project Structure

```
project/
├── config/                  # App-level configuration
├── db/
│   └── connection.js         # MongoDB connection logic
├── models/
│   ├── category.model.js     # Category schema
│   ├── product.model.js      # Product schema
│   ├── cart.model.js         # Cart schema
│   └── order.model.js        # Order schema
├── controllers/
│   ├── categoryController.js
│   ├── productController.js
│   ├── cartController.js
│   └── orderController.js
├── routes/
│   ├── categoryRoutes.js
│   ├── productRoutes.js
│   ├── cartRoutes.js
│   └── orderRoutes.js
├── middleware/
│   └── errorHandler.js       # Central error handler
├── utils/
│   ├── AppError.js           # Custom operational error class
│   └── asyncHandler.js       # Wraps async route handlers
├── postman/
│   ├── ecommerce-api.postman_collection.json
│   └── ecommerce-dev.postman_environment.json
├── seed.js                   # Database seed script
├── app.js                    # Application entry point
├── .env                       # Real environment variables (not committed)
├── .env.example                # Template for environment variables
├── .gitignore
└── package.json
```

**Folder explanations:**
- `config/` — general app configuration values
- `db/` — database connection setup
- `models/` — Mongoose schemas defining the shape of each collection
- `controllers/` — business logic for handling each request
- `routes/` — Express route definitions, mapping URLs to controllers
- `middleware/` — custom Express middleware (error handling)
- `utils/` — shared helper utilities (`AppError`, `asyncHandler`)
- `postman/` — exported Postman collection and environment for API testing

## API Endpoints

### Categories

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/categories` | Get all categories |
| GET | `/api/categories/:id` | Get a single category by ID |
| POST | `/api/categories` | Create a new category |
| PATCH | `/api/categories/:id` | Update a category |
| DELETE | `/api/categories/:id` | Delete a category |

### Products

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/products` | Get all products. Supports `?category=`, `?minPrice=`, `?maxPrice=`, `?inStock=true`, `?search=` |
| GET | `/api/products/:id` | Get a single product (category populated) |
| POST | `/api/products` | Create a new product |
| PATCH | `/api/products/:id` | Update a product |
| DELETE | `/api/products/:id` | Delete a product |

### Cart

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/cart` | View the cart |
| POST | `/api/cart/items` | Add an item to the cart |
| PATCH | `/api/cart/items/:productId` | Update an item's quantity (removes it if set to 0) |
| DELETE | `/api/cart/items/:productId` | Remove an item from the cart |
| DELETE | `/api/cart` | Clear the entire cart |

### Orders

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/orders` | Checkout — creates an order from the current cart |
| GET | `/api/orders` | Get all orders |
| GET | `/api/orders/:id` | Get a single order |
| PATCH | `/api/orders/:id/status` | Update an order's status |

## Response Format

All responses follow a consistent shape:
```json
{
  "status": "success",
  "message": "Descriptive message",
  "data": { }
}
```

Errors follow the same shape, with `status: "fail"` (client errors) or `status: "error"` (server errors):
```json
{
  "status": "fail",
  "message": "Product not found"
}
```

## Testing

A Postman collection and environment are included under `/postman`. Import both files into Postman, select the **E-Commerce API Dev** environment, and run the requests in each folder (Categories, Products, Cart, Orders).

## GitHub Repository

Here is the link for my repo: https://github.com/Moustafa-Mahmoud26/moustafa-mahmoud-ecommerce-backend

## License

ISC