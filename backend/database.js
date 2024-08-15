const express = require('express');
const mysql = require('mysql2');
require('dotenv').config();

const router = express.Router();

// MySQL Database Connection
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

db.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err);
        return;
    }
    console.log('Connected to MySQL database');
});

// Get all expenses
router.get('/api/expenses', (req, res) => {
    db.query('SELECT * FROM expenses', (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});

// Add a new expense
router.post('/api/expenses', (req, res) => {
    const { description, amount, date, category } = req.body;
    db.query('INSERT INTO expenses (description, amount, date, category) VALUES (?, ?, ?, ?)', 
    [description, amount, date, category], (err, results) => {
        if (err) throw err;
        res.status(201).json({ message: 'Expense added', id: results.insertId });
    });
});

// Delete an expense by ID
router.delete('/api/expenses/:id', (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM expenses WHERE id = ?', [id], (err, results) => {
        if (err) throw err;
        res.status(200).json({ message: 'Expense deleted' });
    });
});

// Update an expense by ID
router.put('/api/expenses/:id', (req, res) => {
    const { id } = req.params;
    const { description, amount, date, category } = req.body;
    const sql = 'UPDATE expenses SET description = ?, amount = ?, date = ?, category = ? WHERE id = ?';
    db.query(sql, [description, amount, date, category, id], (err, results) => {
        if (err) throw err;
        res.status(200).json({ message: 'Expense updated' });
    });
});

module.exports = router;
