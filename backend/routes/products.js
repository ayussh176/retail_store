// routes/products.js - Product routes
// This file defines all routes related to products

const express = require('express');
const router = express.Router();
const productsController = require('../controllers/productsController');

// GET all products
router.get('/', productsController.getAllProducts);

// GET a single product by ID
router.get('/:id', productsController.getProductById);

// POST create a new product
router.post('/', productsController.createProduct);

// PUT update a product
router.put('/:id', productsController.updateProduct);

// DELETE a product
router.delete('/:id', productsController.deleteProduct);

module.exports = router;
