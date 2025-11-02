// routes/retailers.js - Retailer routes
// This file defines all routes related to retailers

const express = require('express');
const router = express.Router();
const retailersController = require('../controllers/retailersController');

// GET all retailers
router.get('/', retailersController.getAllRetailers);

// GET a single retailer by ID
router.get('/:id', retailersController.getRetailerById);

// POST create a new retailer
router.post('/', retailersController.createRetailer);

// PUT update a retailer
router.put('/:id', retailersController.updateRetailer);

// DELETE a retailer
router.delete('/:id', retailersController.deleteRetailer);

module.exports = router;
