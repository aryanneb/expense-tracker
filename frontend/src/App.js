import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [expenses, setExpenses] = useState([]);
  const [filteredExpenses, setFilteredExpenses] = useState([]);
  const [newExpense, setNewExpense] = useState({
    description: '',
    amount: '',
    date: '',
    category: ''
  });
  const [showForm, setShowForm] = useState(false);
  const [sortConfig, setSortConfig] = useState({ key: 'date', direction: 'ascending' });
  const [selectedCategory, setSelectedCategory] = useState('All');

  const fetchExpenses = useCallback(async () => {
    try {
      const response = await axios.get('/api/expenses');
      setExpenses(response.data);
    } catch (error) {
      console.error('Error fetching expenses:', error);
    }
  }, []);

  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);

  const sortExpenses = useCallback((key, direction) => {
    const sortedExpenses = [...filteredExpenses].sort((a, b) => {
      if (a[key] < b[key]) return direction === 'ascending' ? -1 : 1;
      if (a[key] > b[key]) return direction === 'ascending' ? 1 : -1;
      return 0;
    });
    setFilteredExpenses(sortedExpenses);
  }, [filteredExpenses]);

  const filterExpenses = useCallback(() => {
    if (selectedCategory === 'All') {
      setFilteredExpenses(expenses);
    } else {
      const filtered = expenses.filter(expense => expense.category === selectedCategory);
      setFilteredExpenses(filtered);
    }
  }, [expenses, selectedCategory]);

  useEffect(() => {
    filterExpenses();
  }, [expenses, selectedCategory, filterExpenses]);

  const deleteExpense = async (id) => {
    try {
      await axios.delete(`/api/expenses/${id}`);
      fetchExpenses(); // Refresh the list of expenses after deletion
    } catch (error) {
      console.error('Error deleting expense:', error);
    }
  };

  const modifyExpense = (expense) => {
    setNewExpense(expense);
    setShowForm(true);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setNewExpense({
      ...newExpense,
      [name]: value
    });
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    try {
      if (newExpense.id) {
        await axios.put(`/api/expenses/${newExpense.id}`, newExpense);
      } else {
        await axios.post('/api/expenses', newExpense);
      }
      setNewExpense({ description: '', amount: '', date: '', category: '' });
      setShowForm(false);
      fetchExpenses(); // Refresh the list of expenses after modifying or adding a new one
    } catch (error) {
      console.error('Error submitting expense:', error);
    }
  };

  const handleSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
    sortExpenses(key, direction);
  };

  const uniqueCategories = Array.from(new Set(expenses.map(expense => expense.category)));

  return (
    <div className="App">
      <header className="App-header">
        <h1>Expense Tracker</h1>
        <button onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : 'Add Expense'}
        </button>
        {showForm && (
          <form onSubmit={handleFormSubmit} className="expense-form">
            <input
              type="text"
              name="description"
              value={newExpense.description}
              onChange={handleInputChange}
              placeholder="Description"
              required
            />
            <input
              type="number"
              name="amount"
              value={newExpense.amount}
              onChange={handleInputChange}
              placeholder="Amount"
              required
            />
            <input
              type="date"
              name="date"
              value={newExpense.date}
              onChange={handleInputChange}
              required
            />
            <input
              type="text"
              name="category"
              value={newExpense.category}
              onChange={handleInputChange}
              placeholder="Category"
              required
            />
            <button type="submit">Submit</button>
          </form>
        )}
        <h2>All Expenses</h2>
        <div className="filter-container">
          <label htmlFor="category-filter">Filter by category:</label>
          <select
            id="category-filter"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="category-filter"
          >
            <option value="All">All</option>
            {uniqueCategories.map((category, index) => (
              <option key={index} value={category}>{category}</option>
            ))}
          </select>
        </div>
        <table className="expense-table">
          <thead>
            <tr>
              <th onClick={() => handleSort('category')}>
                Category {sortConfig.key === 'category' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
              </th>
              <th onClick={() => handleSort('description')}>
                Description {sortConfig.key === 'description' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
              </th>
              <th onClick={() => handleSort('date')}>
                Date {sortConfig.key === 'date' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
              </th>
              <th onClick={() => handleSort('amount')}>
                Amount {sortConfig.key === 'amount' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
              </th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredExpenses.map((expense) => (
              <tr key={expense.id} className="table-row">
                <td>{expense.category}</td>
                <td>{expense.description}</td>
                <td>{new Date(expense.date).toLocaleDateString()}</td>
                <td>{"$" + Number(expense.amount)}</td>
                <td>
                  <button
                    className="modify-button"
                    onClick={() => modifyExpense(expense)}
                  >
                    Modify
                  </button>
                  <button
                    className="delete-button"
                    onClick={() => deleteExpense(expense.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </header>
    </div>
  );
}

export default App;
