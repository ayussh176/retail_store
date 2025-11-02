// controllers/retailersController.js - Retailers controller
const db = require('../db');
exports.getAllRetailers = async (req, res) => {
  try { const [rows] = await db.query('SELECT * FROM retailers'); res.json(rows); }
  catch (error) { res.status(500).json({ error: error.message }); }
};
exports.getRetailerById = async (req, res) => {
  try { const [rows] = await db.query('SELECT * FROM retailers WHERE id = ?', [req.params.id]); if (rows.length === 0) return res.status(404).json({ message: 'Retailer not found' }); res.json(rows[0]); }
  catch (error) { res.status(500).json({ error: error.message }); }
};
exports.createRetailer = async (req, res) => {
  try { const { name, location, contact } = req.body; const [result] = await db.query('INSERT INTO retailers (name, location, contact) VALUES (?, ?, ?)', [name, location, contact]); res.status(201).json({ id: result.insertId, message: 'Retailer created' }); }
  catch (error) { res.status(500).json({ error: error.message }); }
};
exports.updateRetailer = async (req, res) => {
  try { const { name, location, contact } = req.body; await db.query('UPDATE retailers SET name = ?, location = ?, contact = ? WHERE id = ?', [name, location, contact, req.params.id]); res.json({ message: 'Retailer updated' }); }
  catch (error) { res.status(500).json({ error: error.message }); }
};
exports.deleteRetailer = async (req, res) => {
  try { await db.query('DELETE FROM retailers WHERE id = ?', [req.params.id]); res.json({ message: 'Retailer deleted' }); }
  catch (error) { res.status(500).json({ error: error.message }); }
};
