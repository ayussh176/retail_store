// routes/orderItems.js - Order Items routes
// This file defines all routes related to order items

const express = require('express');
const router = express.Router();

// GET all order items
router.get('/', (req, res) => {
  res.json({ message: 'Get all order items' });
});

// GET order items by order ID
router.get('/order/:orderId', (req, res) => {
  res.json({ message: `Get order items for order ${req.params.orderId}` });
});

// POST create a new order item
router.post('/', (req, res) => {
  res.json({ message: 'Create order item' });
});

// PUT update an order item
router.put('/:id', (req, res) => {
  res.json({ message: `Update order item ${req.params.id}` });
});

// DELETE an order item
router.delete('/:id', (req, res) => {
  res.json({ message: `Delete order item ${req.params.id}` });
});

module.exports = router;
