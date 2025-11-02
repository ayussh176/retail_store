// controllers/ordersController.js - Orders controller
// Handles business logic for orders

const db = require('../db');

exports.getAllOrders = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM orders');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getOrderById = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM orders WHERE id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ message: 'Order not found' });
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createOrder = async (req, res) => {
  try {
    const { customer_id, order_date, total_amount } = req.body;
    const [result] = await db.query(
      'INSERT INTO orders (customer_id, order_date, total_amount) VALUES (?, ?, ?)',
      [customer_id, order_date, total_amount]
    );
    res.status(201).json({ id: result.insertId, message: 'Order created successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateOrder = async (req, res) => {
  try {
    const { customer_id, order_date, total_amount } = req.body;
    await db.query(
      'UPDATE orders SET customer_id = ?, order_date = ?, total_amount = ? WHERE id = ?',
      [customer_id, order_date, total_amount, req.params.id]
    );
    res.json({ message: 'Order updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteOrder = async (req, res) => {
  try {
    await db.query('DELETE FROM orders WHERE id = ?', [req.params.id]);
    res.json({ message: 'Order deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
