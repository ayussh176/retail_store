// routes/suppliers.js - Supplier routes
// This file defines all routes related to suppliers

const express = require('express');
const router = express.Router();
const suppliersController = require('../controllers/suppliersController');

// GET all suppliers
router.get('/', suppliersController.getAllSuppliers);

// GET a single supplier by ID
router.get('/:id', suppliersController.getSupplierById);

// POST create a new supplier
router.post('/', suppliersController.createSupplier);

// PUT update a supplier
router.put('/:id', suppliersController.updateSupplier);

// DELETE a supplier
router.delete('/:id', suppliersController.deleteSupplier);

module.exports = router;
