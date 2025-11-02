// routes/orders.js - Order routes
// This file defines all routes related to orders

const express = require('express');
const router = express.Router();
const ordersController = require('../controllers/ordersController');

// GET all orders
router.get('/', ordersController.getAllOrders);

// GET a single order by ID
router.get('/:id', ordersController.getOrderById);

// POST create a new order
router.post('/', ordersController.createOrder);

// PUT update an order
router.put('/:id', ordersController.updateOrder);

// DELETE an order
router.delete('/:id', ordersController.deleteOrder);

module.exports = router;
