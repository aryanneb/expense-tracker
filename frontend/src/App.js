import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [expenses, setExpenses] = useState([]);
  const [filteredExpenses, setFilteredExpenses] = useState([]);
  const [newExpense, setNewExpense] = useState({
    description: "",
    amount: "",
    date: "",
    category: "",
  });
  const [showForm, setShowForm] = useState(false);
  const [sortConfig, setSortConfig] = useState({
    key: "date",
    direction: "ascending",
  });
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedExpense, setSelectedExpense] = useState(null); // State for the selected expense

  const fetchExpenses = useCallback(async () => {
    try {
      const response = await axios.get("/api/expenses");
      setExpenses(response.data);
    } catch (error) {
      console.error("Error fetching expenses:", error);
    }
  }, []);

  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);

  const sortExpenses = useCallback(
    (key, direction) => {
      const sortedExpenses = [...filteredExpenses].sort((a, b) => {
        if (a[key] < b[key]) return direction === "ascending" ? -1 : 1;
        if (a[key] > b[key]) return direction === "ascending" ? 1 : -1;
        return 0;
      });
      setFilteredExpenses(sortedExpenses);
    },
    [filteredExpenses]
  );

  const filterExpenses = useCallback(() => {
    if (selectedCategory === "All") {
      setFilteredExpenses(expenses);
    } else {
      const filtered = expenses.filter(
        (expense) => expense.category === selectedCategory
      );
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
      setSelectedExpense(null); // Close the popup after deletion
    } catch (error) {
      console.error("Error deleting expense:", error);
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setNewExpense({
      ...newExpense,
      [name]: value,
    });
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    try {
      if (newExpense.id) {
        await axios.put(`/api/expenses/${newExpense.id}`, newExpense);
      } else {
        await axios.post("/api/expenses", newExpense);
      }
      setNewExpense({ description: "", amount: "", date: "", category: "" });
      setShowForm(false);
      fetchExpenses(); // Refresh the list of expenses after modifying or adding a new one
    } catch (error) {
      console.error("Error submitting expense:", error);
    }
  };

  const handleSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
    sortExpenses(key, direction);
  };

  const handlePopupClose = () => {
    setSelectedExpense(null);
  };

  const handlePopupSubmit = async (updatedExpense) => {
    try {
      if (updatedExpense.id) {
        await axios.put(`/api/expenses/${updatedExpense.id}`, updatedExpense);
      } else {
        await axios.post("/api/expenses", updatedExpense);
      }
      setSelectedExpense(null);
      fetchExpenses();
    } catch (error) {
      console.error("Error updating expense:", error);
    }
  };

  const uniqueCategories = Array.from(
    new Set(expenses.map((expense) => expense.category))
  );

  return (
    <div className="App fade-in">
      <header className="App-header">
        <h1>Expense Tracker</h1>
        <button onClick={() => setShowForm(!showForm)} className="slide-in">
          {showForm ? "Cancel" : "Add Expense"}
        </button>
        {showForm && (
          <form onSubmit={handleFormSubmit} className="expense-form slide-in">
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
        <div className="filter-container slide-in">
          <label htmlFor="category-filter">Filter by category:</label>
          <select
            id="category-filter"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="category-filter"
          >
            <option value="All">All</option>
            {uniqueCategories.map((category, index) => (
              <option key={index} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
        <div className="table-container slide-in">
          <table className="expense-table">
            <thead>
              <tr>
                <th onClick={() => handleSort("category")}>
                  Category{" "}
                  {sortConfig.key === "category" &&
                    (sortConfig.direction === "ascending" ? "↑" : "↓")}
                </th>
                <th onClick={() => handleSort("description")}>
                  Description{" "}
                  {sortConfig.key === "description" &&
                    (sortConfig.direction === "ascending" ? "↑" : "↓")}
                </th>
                <th onClick={() => handleSort("date")}>
                  Date{" "}
                  {sortConfig.key === "date" &&
                    (sortConfig.direction === "ascending" ? "↑" : "↓")}
                </th>
                <th onClick={() => handleSort("amount")}>
                  Amount{" "}
                  {sortConfig.key === "amount" &&
                    (sortConfig.direction === "ascending" ? "↑" : "↓")}
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredExpenses.map((expense) => (
                <tr
                  key={expense.id}
                  className="table-row fade-in"
                  onClick={() => setSelectedExpense(expense)} // Set selected expense
                >
                  <td>{expense.category}</td>
                  <td>{expense.description}</td>
                  <td>{new Date(expense.date).toLocaleDateString()}</td>
                  <td>{"$" + Number(expense.amount)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {selectedExpense && (
          <div className="popup">
            <div className="popup-content">
              <div className="popup-header">
                <h3>Modify Expense</h3>
                <button
                  type="button"
                  className="close-popup"
                  onClick={handlePopupClose}
                >
                  &times;
                </button>
              </div>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handlePopupSubmit(selectedExpense);
                }}
              >
                <div className="popup-field">
                  <label>Description:</label>
                  <input
                    type="text"
                    name="description"
                    value={selectedExpense.description}
                    onChange={(e) =>
                      setSelectedExpense({
                        ...selectedExpense,
                        description: e.target.value,
                      })
                    }
                    placeholder="Description"
                    required
                  />
                </div>
                <div className="popup-field">
                  <label>Amount:</label>
                  <input
                    type="number"
                    name="amount"
                    value={selectedExpense.amount}
                    onChange={(e) =>
                      setSelectedExpense({
                        ...selectedExpense,
                        amount: e.target.value,
                      })
                    }
                    placeholder="Amount"
                    required
                  />
                </div>
                <div className="popup-field">
                  <label>Date:</label>
                  <input
                    type="date"
                    name="date"
                    value={new Date(selectedExpense.date)
                      .toISOString()
                      .substring(0, 10)}
                    onChange={(e) =>
                      setSelectedExpense({
                        ...selectedExpense,
                        date: e.target.value,
                      })
                    }
                    required
                  />
                </div>
                <div className="popup-field">
                  <label>Category:</label>
                  <input
                    type="text"
                    name="category"
                    value={selectedExpense.category}
                    onChange={(e) =>
                      setSelectedExpense({
                        ...selectedExpense,
                        category: e.target.value,
                      })
                    }
                    placeholder="Category"
                    required
                  />
                </div>
                <div className="popup-buttons">
                  <button type="submit" className="modify-button">
                    Save Changes
                  </button>
                  <button
                    type="button"
                    className="delete-button"
                    onClick={() => deleteExpense(selectedExpense.id)}
                  >
                    Delete
                  </button>
                </div>
              </form>
            </div>
            <div className="popup-arrow"></div>
          </div>
        )}
      </header>
    </div>
  );
}

export default App;
