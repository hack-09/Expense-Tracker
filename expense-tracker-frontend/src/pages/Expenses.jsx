import React, { useState, useEffect } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

function Expenses() {
  const navigate = useNavigate();

  const [expenses, setExpenses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editAmount, setEditAmount] = useState("");
  const [editCategoryId, setEditCategoryId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [darkMode, setDarkMode] = useState(false);

  // Filter states
  const [filterCategoryId, setFilterCategoryId] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [minAmount, setMinAmount] = useState("");
  const [maxAmount, setMaxAmount] = useState("");

  // Load dark mode preference from localStorage
  useEffect(() => {
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    setDarkMode(savedDarkMode);
  }, []);

  // Save dark mode preference to localStorage
  useEffect(() => {
    localStorage.setItem('darkMode', darkMode);
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Fetch expenses & categories
  useEffect(() => {
    fetchExpenses();
    fetchCategories();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token"); // remove token
    navigate("/login"); // redirect to login page
  };

  const fetchExpenses = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get("/expenses"); // <-- use api, not axios
      setExpenses(res.data);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch expenses");
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await api.get("/categories");
      setCategories(res.data);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch categories");
    }
  };

  // Add a new expense
  const addExpense = async (e) => {
    if (e) e.preventDefault();
    if (!title.trim() || !amount || !categoryId) return;

    setError("");
    try {
      const res = await api.post("/expenses", {
        title: title.trim(),
        amount: parseFloat(amount),
        categoryId: parseInt(categoryId),
        date: new Date()
      });
      setExpenses([...expenses, res.data]);
      setTitle("");
      setAmount("");
      setCategoryId("");
    } catch (err) {
      console.error(err);
      setError("Failed to add expense");
    }
  };

  // Delete expense
  const deleteExpense = async (id) => {
    if (!window.confirm("Are you sure you want to delete this expense?")) return;

    setError("");
    try {
      await api.delete(`/expenses/${id}`);
      setExpenses(expenses.filter(exp => exp.id !== id));
    } catch (err) {
      console.error(err);
      setError("Failed to delete expense");
    }
  };

  // Start editing
  const startEdit = (expense) => {
    setEditingId(expense.id);
    setEditTitle(expense.title);
    setEditAmount(expense.amount);
    setEditCategoryId(expense.categoryId);
  };

  // Update expense
  const updateExpense = async (id) => {
    if (!editTitle.trim() || !editAmount || !editCategoryId) return;

    setError("");
    try {
      await api.put(`/expenses/${id}`, {
        id,
        title: editTitle.trim(),
        amount: parseFloat(editAmount),
        categoryId: parseInt(editCategoryId),
        date: new Date()
      });
      setExpenses(expenses.map(exp =>
        exp.id === id ? { ...exp, title: editTitle, amount: editAmount, categoryId: editCategoryId } : exp
      ));
      setEditingId(null);
    } catch (err) {
      console.error(err);
      setError("Failed to update expense");
    }
  };

  // Apply filter
  const applyFilter = async () => {
    setLoading(true);
    setError("");
    try {
      const params = {};
      if (filterCategoryId) params.categoryId = filterCategoryId;
      if (fromDate) params.fromDate = fromDate;
      if (toDate) params.toDate = toDate;
      if (minAmount) params.minAmount = minAmount;
      if (maxAmount) params.maxAmount = maxAmount;

      const res = await api.get("/expenses/filter", { params });
      setExpenses(res.data);
    } catch (err) {
      console.error(err);
      setError("Failed to apply filters");
    } finally {
      setLoading(false);
    }
  };

  // Reset filter
  const resetFilter = () => {
    setFilterCategoryId("");
    setFromDate("");
    setToDate("");
    setMinAmount("");
    setMaxAmount("");
    fetchExpenses();
  };

  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  // Calculate totals
  const totalAmount = expenses.reduce((sum, exp) => sum + parseFloat(exp.amount), 0);

  // Helper: Get category name by id
  const getCategoryName = (id) => {
    const cat = categories.find(c => c.id === id);
    return cat ? cat.name : "Unknown";
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Dark mode classes
  const darkClasses = {
    background: darkMode ? "bg-gray-900" : "bg-gray-50",
    card: darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200",
    text: darkMode ? "text-white" : "text-gray-900",
    textMuted: darkMode ? "text-gray-300" : "text-gray-600",
    textSecondary: darkMode ? "text-gray-400" : "text-gray-500",
    border: darkMode ? "border-gray-700" : "border-gray-200",
    input: darkMode 
      ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500" 
      : "bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-blue-500 focus:border-blue-500",
    tableHeader: darkMode ? "bg-gray-700 text-gray-300" : "bg-gray-50 text-gray-500",
    tableRow: darkMode ? "hover:bg-gray-700" : "hover:bg-gray-50",
    error: darkMode ? "bg-red-900 border-red-800 text-red-200" : "bg-red-50 border-red-200 text-red-600",
    button: {
      primary: darkMode 
        ? "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500" 
        : "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500",
      secondary: darkMode 
        ? "bg-gray-600 hover:bg-gray-700 focus:ring-gray-500" 
        : "bg-gray-500 hover:bg-gray-600 focus:ring-gray-500",
      danger: darkMode 
        ? "bg-red-600 hover:bg-red-700 focus:ring-red-500" 
        : "bg-red-600 hover:bg-red-700 focus:ring-red-500"
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-200 ${darkClasses.background} py-8 px-4 sm:px-6 lg:px-8`}>
      <div className="max-w-6xl mx-auto">
        {/* Header with Dark Mode Toggle */}
        <div className={`flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 pb-6 border-b ${darkClasses.border}`}>
          <div className="mb-4 sm:mb-0">
            <h1 className={`text-3xl font-bold ${darkClasses.text} flex items-center`}>
              💸 Expense Tracker
            </h1>
            <p className={`mt-2 ${darkClasses.textMuted}`}>Manage and filter your expenses easily</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <div className={`text-2xl font-bold ${darkMode ? "text-green-400" : "text-green-600"}`}>
                ${totalAmount.toFixed(2)}
              </div>
              <div className={`text-sm ${darkClasses.textSecondary}`}>
                {expenses.length} {expenses.length === 1 ? 'expense' : 'expenses'}
              </div>
            </div>
            {/* Dark Mode Toggle Button */}
            <button
              onClick={toggleDarkMode}
              className={`p-2 rounded-lg transition-colors duration-200 ${
                darkMode 
                  ? "bg-yellow-400 text-gray-900 hover:bg-yellow-300" 
                  : "bg-gray-700 text-white hover:bg-gray-600"
              } focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                darkMode ? "focus:ring-offset-gray-900 focus:ring-yellow-400" : "focus:ring-offset-gray-50 focus:ring-gray-700"
              }`}
              aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
            >
              {darkMode ? (
                // Sun icon for light mode
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                </svg>
              ) : (
                // Moon icon for dark mode
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                </svg>
              )}
            </button>
            
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-2 rounded"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className={`mb-6 p-4 rounded-lg border ${darkClasses.error}`}>
            <div className="flex items-center">
              <div className="text-sm">{error}</div>
              <button
                onClick={() => setError("")}
                className={`ml-auto ${darkMode ? "text-red-300 hover:text-red-100" : "text-red-500 hover:text-red-700"}`}
              >
                ×
              </button>
            </div>
          </div>
        )}

        {/* Add Expense Form */}
        <form onSubmit={addExpense} className={`mb-8 rounded-lg shadow-sm border p-6 ${darkClasses.card}`}>
          <h2 className={`text-lg font-semibold mb-4 ${darkClasses.text}`}>Add New Expense</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label htmlFor="title" className={`block text-sm font-medium mb-2 ${darkClasses.text}`}>
                Expense Title
              </label>
              <input
                id="title"
                type="text"
                placeholder="Dinner, Groceries, etc."
                value={title}
                onChange={e => setTitle(e.target.value)}
                maxLength={50}
                className={`w-full px-4 py-3 border rounded-lg transition-colors ${darkClasses.input}`}
              />
            </div>
            <div>
              <label htmlFor="amount" className={`block text-sm font-medium mb-2 ${darkClasses.text}`}>
                Amount ($)
              </label>
              <input
                id="amount"
                type="number"
                placeholder="0.00"
                value={amount}
                onChange={e => setAmount(e.target.value)}
                min="0"
                step="0.01"
                className={`w-full px-4 py-3 border rounded-lg transition-colors ${darkClasses.input}`}
              />
            </div>
            <div>
              <label htmlFor="category" className={`block text-sm font-medium mb-2 ${darkClasses.text}`}>
                Category
              </label>
              <select
                id="category"
                value={categoryId}
                onChange={e => setCategoryId(e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg transition-colors ${darkClasses.input}`}
              >
                <option value="">Select Category</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
            <div className="flex items-end">
              <button
                type="submit"
                disabled={!title.trim() || !amount || !categoryId}
                className={`w-full px-6 py-3 text-white font-medium rounded-lg focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center ${darkClasses.button.primary} ${
                  darkMode ? "focus:ring-offset-gray-800" : "focus:ring-offset-white"
                }`}
              >
                <span className="mr-2">+</span>
                Add Expense
              </button>
            </div>
          </div>
        </form>

        {/* Filter Section */}
        <div className={`rounded-lg shadow-sm border p-6 mb-8 ${darkClasses.card}`}>
          <h2 className={`text-lg font-semibold mb-4 ${darkClasses.text}`}>Filters</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-4">
            <div>
              <label className={`block text-sm font-medium mb-2 ${darkClasses.text}`}>
                Category
              </label>
              <select
                value={filterCategoryId}
                onChange={e => setFilterCategoryId(e.target.value)}
                className={`w-full border rounded-lg p-3 transition-colors ${darkClasses.input}`}
              >
                <option value="">All Categories</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={`block text-sm font-medium mb-2 ${darkClasses.text}`}>
                From Date
              </label>
              <input
                type="date"
                value={fromDate}
                onChange={e => setFromDate(e.target.value)}
                className={`w-full border rounded-lg p-3 transition-colors ${darkClasses.input}`}
              />
            </div>
            <div>
              <label className={`block text-sm font-medium mb-2 ${darkClasses.text}`}>
                To Date
              </label>
              <input
                type="date"
                value={toDate}
                onChange={e => setToDate(e.target.value)}
                className={`w-full border rounded-lg p-3 transition-colors ${darkClasses.input}`}
              />
            </div>
            <div>
              <label className={`block text-sm font-medium mb-2 ${darkClasses.text}`}>
                Min Amount
              </label>
              <input
                type="number"
                placeholder="Min"
                value={minAmount}
                onChange={e => setMinAmount(e.target.value)}
                className={`w-full border rounded-lg p-3 transition-colors ${darkClasses.input}`}
              />
            </div>
            <div>
              <label className={`block text-sm font-medium mb-2 ${darkClasses.text}`}>
                Max Amount
              </label>
              <input
                type="number"
                placeholder="Max"
                value={maxAmount}
                onChange={e => setMaxAmount(e.target.value)}
                className={`w-full border rounded-lg p-3 transition-colors ${darkClasses.input}`}
              />
            </div>
            <div className="flex items-end space-x-2">
              <button
                onClick={applyFilter}
                className={`flex-1 px-4 py-3 text-white rounded-lg focus:ring-2 focus:ring-offset-2 transition-colors ${darkClasses.button.primary} ${
                  darkMode ? "focus:ring-offset-gray-800" : "focus:ring-offset-white"
                }`}
              >
                Apply
              </button>
              <button
                onClick={resetFilter}
                className={`flex-1 px-4 py-3 text-white rounded-lg focus:ring-2 focus:ring-offset-2 transition-colors ${darkClasses.button.secondary} ${
                  darkMode ? "focus:ring-offset-gray-800" : "focus:ring-offset-white"
                }`}
              >
                Reset
              </button>
            </div>
          </div>
        </div>

        {/* Expenses List */}
        <div className={`rounded-lg shadow-sm border overflow-hidden ${darkClasses.card}`}>
          {loading ? (
            <div className="text-center py-12">
              <div className={`animate-spin rounded-full h-12 w-12 border-b-2 mx-auto ${
                darkMode ? "border-blue-400" : "border-blue-600"
              }`}></div>
              <p className={`mt-4 ${darkClasses.textMuted}`}>Loading expenses...</p>
            </div>
          ) : expenses.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📊</div>
              <h3 className={`text-lg font-medium mb-2 ${darkClasses.text}`}>No expenses found</h3>
              <p className={darkClasses.textMuted}>Try adjusting your filters or add a new expense!</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className={darkClasses.tableHeader}>
                    <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider">
                      Title
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {expenses.map(exp => (
                    <tr key={exp.id} className={darkClasses.tableRow}>
                      {editingId === exp.id ? (
                        // Edit Mode
                        <>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <input
                              type="text"
                              value={editTitle}
                              onChange={e => setEditTitle(e.target.value)}
                              className={`w-full px-3 py-2 border rounded-lg transition-colors ${darkClasses.input}`}
                            />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <input
                              type="number"
                              value={editAmount}
                              onChange={e => setEditAmount(e.target.value)}
                              className={`w-full px-3 py-2 border rounded-lg transition-colors ${darkClasses.input}`}
                            />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <select
                              value={editCategoryId}
                              onChange={e => setEditCategoryId(e.target.value)}
                              className={`w-full px-3 py-2 border rounded-lg transition-colors ${darkClasses.input}`}
                            >
                              {categories.map(cat => (
                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                              ))}
                            </select>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <span className={darkClasses.textSecondary}>
                              {formatDate(exp.date)}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                            <button
                              onClick={() => updateExpense(exp.id)}
                              disabled={!editTitle.trim() || !editAmount || !editCategoryId}
                              className={`${darkMode ? "text-green-400 hover:text-green-300" : "text-green-600 hover:text-green-900"} disabled:opacity-50 disabled:cursor-not-allowed`}
                            >
                              Save
                            </button>
                            <button
                              onClick={() => setEditingId(null)}
                              className={darkMode ? "text-gray-400 hover:text-gray-300" : "text-gray-600 hover:text-gray-900"}
                            >
                              Cancel
                            </button>
                          </td>
                        </>
                      ) : (
                        // View Mode
                        <>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <span className={darkClasses.text}>{exp.title}</span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold">
                            <span className={darkMode ? "text-red-400" : "text-red-600"}>
                              ${parseFloat(exp.amount).toFixed(2)}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <span className={darkClasses.textSecondary}>
                              {getCategoryName(exp.categoryId)}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <span className={darkClasses.textSecondary}>
                              {formatDate(exp.date)}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                            <button
                              onClick={() => startEdit(exp)}
                              className={darkMode ? "text-blue-400 hover:text-blue-300" : "text-blue-600 hover:text-blue-900"}
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => deleteExpense(exp.id)}
                              className={darkMode ? "text-red-400 hover:text-red-300" : "text-red-600 hover:text-red-900"}
                            >
                              Delete
                            </button>
                          </td>
                        </>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Footer Stats */}
        {expenses.length > 0 && !loading && (
          <div className={`mt-6 text-center text-sm ${darkClasses.textSecondary}`}>
            Showing {expenses.length} {expenses.length === 1 ? 'expense' : 'expenses'} • 
            Total: ${totalAmount.toFixed(2)}
          </div>
        )}
      </div>
    </div>
  );
}

export default Expenses;