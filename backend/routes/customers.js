// routes/customers.js - Customer routes
// This file defines all routes related to customers

const express = require('express');
const router = express.Router();
const customersController = require('../controllers/customersController');

// GET all customers
router.get('/', customersController.getAllCustomers);

// GET a single customer by ID
router.get('/:id', customersController.getCustomerById);

// POST create a new customer
router.post('/', customersController.createCustomer);

// PUT update a customer
router.put('/:id', customersController.updateCustomer);

// DELETE a customer
router.delete('/:id', customersController.deleteCustomer);

module.exports = router;
