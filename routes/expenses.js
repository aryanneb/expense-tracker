const express = require('express');
const router = express.Router();
const db = require('../models/db'); // Correct path to db.js

// Get all expenses
router.get('/', (req, res) => {
    db.query('SELECT * FROM expenses', (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});

// Add a new expense
router.post('/', (req, res) => {
    const { description, amount, date, category } = req.body;
    db.query('INSERT INTO expenses (description, amount, date, category) VALUES (?, ?, ?, ?)', 
    [description, amount, date, category], (err, results) => {
        if (err) throw err;
        res.status(201).json({ message: 'Expense added', id: results.insertId });
    });
});

module.exports = router;
