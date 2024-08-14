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


// Delete an expense by ID
router.delete('/:id', (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM expenses WHERE id = ?', [id], (err, results) => {
        if (err) throw err;
        res.status(200).json({ message: 'Expense deleted' });
    });
});

// Update an expense by ID
router.put('/:id', (req, res) => {
    const { id } = req.params;
    const { description, amount, date, category } = req.body;
    const sql = 'UPDATE expenses SET description = ?, amount = ?, date = ?, category = ? WHERE id = ?';
    db.query(sql, [description, amount, date, category, id], (err, results) => {
        if (err) throw err;
        res.status(200).json({ message: 'Expense updated' });
    });
});


module.exports = router;
