# Retail Store Management System

A comprehensive full-stack application for managing a retail store.  
Built with React (frontend), Express.js (backend), and Oracle SQL Plus (database).

## Features

- **Product Management:** Add, edit, delete, list products; manage details, categories, stock, and images.
- **Orders:** Create and process customer orders, track status (pending, shipped, delivered), view order history.
- **Cart:** Add products to cart, update quantities, remove items, place orders.
- **Inventory:** Real-time inventory tracking, low stock alerts, inventory analytics.
- **Customers:** Manage customer profiles, contact info, and purchase history.
- **Suppliers:** Supplier information management, products per supplier, analytics.
- **Retailers:** Multi-retailer support, dashboards, retailer-specific pricing.
- **Revenue Analytics:** Real-time reporting dashboards, revenue by product/category/time.

## Tech Stack

- **Frontend:** React, TypeScript, Vite, Tailwind CSS, shadcn/ui
- **Backend:** Express.js, Node.js
- **Database:** Oracle SQL Plus

## Setup Instructions

### 1. Clone the Repository

git clone https://github.com/ayussh176/retail_store.git
cd retail_store


### 2. Install Dependencies

**Backend:**
cd backend
npm install


**Frontend:**
cd ..
npm install


### 3. Configure Environment

Create a `.env` file in the `backend/` directory:
DB_USER=your_oracle_username
DB_PASSWORD=your_oracle_password
DB_CONNECTION_STRING=your_oracle_connection_string
PORT=4000
JWT_SECRET=your_jwt_secret_key
NODE_ENV=development


### 4. Create Database Tables

Connect with Oracle SQL Plus and run the SQL scripts (see below) to create all required tables: `products`, `customers`, `suppliers`, `retailers`, `orders`, `order_items`, `cart`.

_Refer to the repository or copy table schemas here if needed._

---

## Running the Project

**Start Backend:**
cd backend
npm start

The backend will run on `http://localhost:4000` (or your `.env` port).

**Start Frontend:**
npm run dev

Frontend runs on [http://localhost:8080](http://localhost:8080) by default.

---

## API Endpoints Overview

- **Products:**  
  `GET /products` | `GET /products/:id` | `POST /products` | `PUT /products/:id` | `DELETE /products/:id`
- **Orders:**  
  `GET /orders` | `GET /orders/:id` | `POST /orders` | `PUT /orders/:id` | `DELETE /orders/:id`
- **Customers:**  
  `GET /customers` | `GET /customers/:id` | `POST /customers` | `PUT /customers/:id` | `DELETE /customers/:id`
- **Suppliers:**  
  `GET /suppliers` | `GET /suppliers/:id` | `POST /suppliers` | `PUT /suppliers/:id` | `DELETE /suppliers/:id`
- **Retailers:**  
  `GET /retailers` | `GET /retailers/:id` | `POST /retailers` | `PUT /retailers/:id` | `DELETE /retailers/:id`
- **Cart:**  
  `GET /cart/:customerId` | `POST /cart` | `PUT /cart/:id` | `DELETE /cart/:id`

---


