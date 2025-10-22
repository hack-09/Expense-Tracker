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
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  // Filter states
  const [filterCategoryId, setFilterCategoryId] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [minAmount, setMinAmount] = useState("");
  const [maxAmount, setMaxAmount] = useState("");

  // Stats
  const [stats, setStats] = useState({
    total: 0,
    thisMonth: 0,
    lastMonth: 0,
    average: 0
  });

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

  // Calculate stats when expenses change
  useEffect(() => {
    calculateStats();
  }, [expenses]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const fetchExpenses = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get("/expenses");
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

  const calculateStats = () => {
    const now = new Date();
    const thisMonth = now.getMonth();
    const thisYear = now.getFullYear();
    const lastMonth = thisMonth === 0 ? 11 : thisMonth - 1;
    const lastMonthYear = thisMonth === 0 ? thisYear - 1 : thisYear;

    const thisMonthExpenses = expenses.filter(exp => {
      const expDate = new Date(exp.date);
      return expDate.getMonth() === thisMonth && expDate.getFullYear() === thisYear;
    });

    const lastMonthExpenses = expenses.filter(exp => {
      const expDate = new Date(exp.date);
      return expDate.getMonth() === lastMonth && expDate.getFullYear() === lastMonthYear;
    });

    const total = expenses.reduce((sum, exp) => sum + parseFloat(exp.amount), 0);
    const thisMonthTotal = thisMonthExpenses.reduce((sum, exp) => sum + parseFloat(exp.amount), 0);
    const lastMonthTotal = lastMonthExpenses.reduce((sum, exp) => sum + parseFloat(exp.amount), 0);
    const average = expenses.length > 0 ? total / expenses.length : 0;

    setStats({
      total,
      thisMonth: thisMonthTotal,
      lastMonth: lastMonthTotal,
      average
    });
  };

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

  const startEdit = (expense) => {
    setEditingId(expense.id);
    setEditTitle(expense.title);
    setEditAmount(expense.amount);
    setEditCategoryId(expense.categoryId);
  };

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

  const resetFilter = () => {
    setFilterCategoryId("");
    setFromDate("");
    setToDate("");
    setMinAmount("");
    setMaxAmount("");
    setSearchTerm("");
    fetchExpenses();
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  // Filter expenses based on search (client-side only)
  const filteredExpenses = expenses.filter(exp => {
    const matchesSearch = exp.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !filterCategoryId || exp.categoryId === parseInt(filterCategoryId);
    
    // Date range filtering (client-side)
    const expDate = new Date(exp.date);
    const matchesFromDate = !fromDate || expDate >= new Date(fromDate);
    const matchesToDate = !toDate || expDate <= new Date(toDate + 'T23:59:59');
    
    // Amount range filtering (client-side)
    const expAmount = parseFloat(exp.amount);
    const matchesMinAmount = !minAmount || expAmount >= parseFloat(minAmount);
    const matchesMaxAmount = !maxAmount || expAmount <= parseFloat(maxAmount);
    
    return matchesSearch && matchesCategory && matchesFromDate && matchesToDate && matchesMinAmount && matchesMaxAmount;
  });

  const totalAmount = filteredExpenses.reduce((sum, exp) => sum + parseFloat(exp.amount), 0);

  const getCategoryName = (id) => {
    const cat = categories.find(c => c.id === id);
    return cat ? cat.name : "Unknown";
  };

  const getCategoryColor = (id) => {
    const colors = [
      "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
      "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
      "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
      "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
      "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300",
    ];
    const index = id % colors.length;
    return colors[index];
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  // Dark mode classes
  const darkClasses = {
    background: darkMode ? "bg-gradient-to-br from-gray-900 to-gray-800" : "bg-gradient-to-br from-blue-50 to-indigo-100",
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
  };

  return (
    <div className={`min-h-screen transition-all duration-300 ${darkClasses.background} py-8 px-4 sm:px-6 lg:px-8`}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className={`rounded-2xl p-6 mb-8 shadow-2xl ${darkMode ? "bg-gray-800" : "bg-white"}`}>
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-4 lg:space-y-0">
            <div className="flex items-center space-x-4">
              <div className={`p-3 rounded-2xl ${darkMode ? "bg-blue-600" : "bg-blue-500"}`}>
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <div>
                <h1 className={`text-3xl font-bold ${darkClasses.text}`}>Expense Tracker</h1>
                <p className={`mt-1 ${darkClasses.textMuted}`}>Manage your finances with ease</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              {/* Stats Summary */}
              <div className={`hidden sm:block p-3 rounded-xl ${darkMode ? "bg-gray-700" : "bg-blue-50"}`}>
                <div className="text-right">
                  <div className={`text-xl font-bold ${darkMode ? "text-green-400" : "text-green-600"}`}>
                    {formatCurrency(stats.total)}
                  </div>
                  <div className={`text-xs ${darkClasses.textSecondary}`}>
                    Total Expenses
                  </div>
                </div>
              </div>

              {/* Dark Mode Toggle */}
              <button
                onClick={toggleDarkMode}
                className={`p-3 rounded-xl transition-all duration-300 transform hover:scale-105 ${
                  darkMode 
                    ? "bg-yellow-400 text-gray-900 hover:bg-yellow-300" 
                    : "bg-gray-700 text-white hover:bg-gray-600"
                } shadow-lg`}
                aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
              >
                {darkMode ? (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                  </svg>
                )}
              </button>
              
              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-3 rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center space-x-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
            <div className={`p-4 rounded-xl shadow-lg ${darkMode ? "bg-gray-700" : "bg-white"} border-l-4 border-blue-500`}>
              <p className={`text-xs ${darkClasses.textSecondary}`}>This Month</p>
              <p className={`text-lg font-bold mt-1 ${darkClasses.text}`}>{formatCurrency(stats.thisMonth)}</p>
            </div>

            <div className={`p-4 rounded-xl shadow-lg ${darkMode ? "bg-gray-700" : "bg-white"} border-l-4 border-green-500`}>
              <p className={`text-xs ${darkClasses.textSecondary}`}>Last Month</p>
              <p className={`text-lg font-bold mt-1 ${darkClasses.text}`}>{formatCurrency(stats.lastMonth)}</p>
            </div>

            <div className={`p-4 rounded-xl shadow-lg ${darkMode ? "bg-gray-700" : "bg-white"} border-l-4 border-purple-500`}>
              <p className={`text-xs ${darkClasses.textSecondary}`}>Average</p>
              <p className={`text-lg font-bold mt-1 ${darkClasses.text}`}>{formatCurrency(stats.average)}</p>
            </div>

            <div className={`p-4 rounded-xl shadow-lg ${darkMode ? "bg-gray-700" : "bg-white"} border-l-4 border-yellow-500`}>
              <p className={`text-xs ${darkClasses.textSecondary}`}>Total Count</p>
              <p className={`text-lg font-bold mt-1 ${darkClasses.text}`}>{expenses.length}</p>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className={`mb-6 rounded-xl p-4 border ${darkClasses.error} shadow-lg`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <span className="font-medium">{error}</span>
              </div>
              <button
                onClick={() => setError("")}
                className={`p-1 rounded ${darkMode ? "hover:bg-red-800" : "hover:bg-red-100"}`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* Add Expense Form - Separate Section */}
        <div className={`rounded-2xl shadow-2xl p-6 mb-6 ${darkClasses.card}`}>
          <h2 className={`text-xl font-bold mb-4 ${darkClasses.text} flex items-center`}>
            <svg className="w-6 h-6 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add New Expense
          </h2>
          <form onSubmit={addExpense} className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className={`block text-sm font-medium mb-2 ${darkClasses.text}`}>
                Expense Title
              </label>
              <input
                type="text"
                placeholder="Dinner, Groceries, etc."
                value={title}
                onChange={e => setTitle(e.target.value)}
                maxLength={50}
                className={`w-full px-4 py-3 border-2 rounded-xl transition-all duration-200 ${darkClasses.input} focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
              />
            </div>
            <div>
              <label className={`block text-sm font-medium mb-2 ${darkClasses.text}`}>
                Amount ($)
              </label>
              <input
                type="number"
                placeholder="0.00"
                value={amount}
                onChange={e => setAmount(e.target.value)}
                min="0"
                step="0.01"
                className={`w-full px-4 py-3 border-2 rounded-xl transition-all duration-200 ${darkClasses.input} focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
              />
            </div>
            <div>
              <label className={`block text-sm font-medium mb-2 ${darkClasses.text}`}>
                Category
              </label>
              <select
                value={categoryId}
                onChange={e => setCategoryId(e.target.value)}
                className={`w-full px-4 py-3 border-2 rounded-xl transition-all duration-200 ${darkClasses.input} focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
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
                className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-3 rounded-xl font-semibold hover:from-green-600 hover:to-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 shadow-lg flex items-center justify-center"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Add Expense
              </button>
            </div>
          </form>
        </div>

        {/* Search and Filters Section */}
        <div className={`rounded-2xl shadow-2xl p-6 mb-6 ${darkClasses.card}`}>
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-4">
            <h2 className={`text-xl font-bold ${darkClasses.text} flex items-center mb-4 lg:mb-0`}>
              <svg className="w-6 h-6 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z" />
              </svg>
              Search & Filters
            </h2>
            
            {/* Mobile Filter Toggle */}
            <button
              onClick={toggleFilters}
              className={`lg:hidden px-4 py-2 rounded-lg transition-all duration-200 ${
                darkMode 
                  ? "bg-gray-700 text-white hover:bg-gray-600" 
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              } flex items-center justify-center space-x-2`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z" />
              </svg>
              <span>{showFilters ? 'Hide Filters' : 'Show Filters'}</span>
            </button>
          </div>

          {/* Search Bar */}
          <div className="mb-6">
            <label className={`block text-sm font-medium mb-2 ${darkClasses.text}`}>Search Expenses</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search by expense title..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className={`w-full px-4 py-3 pl-10 border-2 rounded-xl transition-all duration-200 ${darkClasses.input} focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
              />
              <svg className="w-5 h-5 absolute left-3 top-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          {/* Advanced Filters - Always visible on desktop, toggleable on mobile */}
          <div className={`${showFilters ? 'block' : 'hidden'} lg:block`}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-4">
              <div>
                <label className={`block text-sm font-medium mb-2 ${darkClasses.text}`}>Category</label>
                <select
                  value={filterCategoryId}
                  onChange={e => setFilterCategoryId(e.target.value)}
                  className={`w-full px-3 py-2 border-2 rounded-lg ${darkClasses.input}`}
                >
                  <option value="">All Categories</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${darkClasses.text}`}>From Date</label>
                <input
                  type="date"
                  value={fromDate}
                  onChange={e => setFromDate(e.target.value)}
                  className={`w-full px-3 py-2 border-2 rounded-lg ${darkClasses.input}`}
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${darkClasses.text}`}>To Date</label>
                <input
                  type="date"
                  value={toDate}
                  onChange={e => setToDate(e.target.value)}
                  className={`w-full px-3 py-2 border-2 rounded-lg ${darkClasses.input}`}
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${darkClasses.text}`}>Min Amount</label>
                <input
                  type="number"
                  placeholder="Min"
                  value={minAmount}
                  onChange={e => setMinAmount(e.target.value)}
                  className={`w-full px-3 py-2 border-2 rounded-lg ${darkClasses.input}`}
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${darkClasses.text}`}>Max Amount</label>
                <input
                  type="number"
                  placeholder="Max"
                  value={maxAmount}
                  onChange={e => setMaxAmount(e.target.value)}
                  className={`w-full px-3 py-2 border-2 rounded-lg ${darkClasses.input}`}
                />
              </div>
            </div>

            {/* Filter Actions */}
            <div className="flex gap-3">
              <button
                onClick={applyFilter}
                className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-all duration-200 flex items-center space-x-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z" />
                </svg>
                <span>Apply Filters</span>
              </button>
              
              <button
                onClick={resetFilter}
                className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition-all duration-200 flex items-center space-x-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span>Reset All</span>
              </button>
            </div>
          </div>
        </div>

        {/* Expenses List */}
        <div className={`rounded-2xl shadow-2xl overflow-hidden ${darkClasses.card}`}>
          {/* List Header */}
          <div className={`px-4 sm:px-6 py-4 border-b ${darkClasses.border}`}>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-2 sm:space-y-0">
              <h2 className={`text-lg sm:text-xl font-bold ${darkClasses.text}`}>
                Expenses ({filteredExpenses.length})
              </h2>
              <div className={`text-base sm:text-lg font-semibold ${darkMode ? "text-green-400" : "text-green-600"}`}>
                {formatCurrency(totalAmount)}
              </div>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className={`animate-spin rounded-full h-12 w-12 border-b-2 mx-auto ${
                darkMode ? "border-blue-400" : "border-blue-600"
              }`}></div>
              <p className={`mt-4 text-base ${darkClasses.textMuted}`}>Loading expenses...</p>
            </div>
          ) : filteredExpenses.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📊</div>
              <h3 className={`text-xl font-bold mb-2 ${darkClasses.text}`}>No expenses found</h3>
              <p className={darkClasses.textMuted}>Try adjusting your filters or add a new expense!</p>
            </div>
          ) : (
            <div className="overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className={darkClasses.tableHeader}>
                      <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Title</th>
                      <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Amount</th>
                      <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Category</th>
                      <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Date</th>
                      <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {filteredExpenses.map(exp => (
                      <tr key={exp.id} className={`transition-all duration-200 ${darkClasses.tableRow}`}>
                        {editingId === exp.id ? (
                          // Edit Mode
                          <>
                            <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                              <input
                                type="text"
                                value={editTitle}
                                onChange={e => setEditTitle(e.target.value)}
                                className={`w-full px-3 py-2 border-2 rounded-lg ${darkClasses.input}`}
                              />
                            </td>
                            <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                              <input
                                type="number"
                                value={editAmount}
                                onChange={e => setEditAmount(e.target.value)}
                                className={`w-full px-3 py-2 border-2 rounded-lg ${darkClasses.input}`}
                              />
                            </td>
                            <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                              <select
                                value={editCategoryId}
                                onChange={e => setEditCategoryId(e.target.value)}
                                className={`w-full px-3 py-2 border-2 rounded-lg ${darkClasses.input}`}
                              >
                                {categories.map(cat => (
                                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                                ))}
                              </select>
                            </td>
                            <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm">
                              <span className={darkClasses.textSecondary}>
                                {formatDate(exp.date)}
                              </span>
                            </td>
                            <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                              <button
                                onClick={() => updateExpense(exp.id)}
                                disabled={!editTitle.trim() || !editAmount || !editCategoryId}
                                className={`px-3 py-1 rounded-lg transition-all duration-200 ${
                                  darkMode 
                                    ? "bg-green-600 text-white hover:bg-green-700 disabled:bg-gray-600" 
                                    : "bg-green-500 text-white hover:bg-green-600 disabled:bg-gray-400"
                                } disabled:cursor-not-allowed`}
                              >
                                Save
                              </button>
                              <button
                                onClick={() => setEditingId(null)}
                                className={`px-3 py-1 rounded-lg transition-all duration-200 ${
                                  darkMode 
                                    ? "bg-gray-600 text-white hover:bg-gray-500" 
                                    : "bg-gray-400 text-white hover:bg-gray-500"
                                }`}
                              >
                                Cancel
                              </button>
                            </td>
                          </>
                        ) : (
                          // View Mode
                          <>
                            <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className={`w-2 h-2 rounded-full mr-2 ${
                                  parseFloat(exp.amount) > 100 ? "bg-red-500" : 
                                  parseFloat(exp.amount) > 50 ? "bg-yellow-500" : "bg-green-500"
                                }`}></div>
                                <span className={`font-medium ${darkClasses.text}`}>{exp.title}</span>
                              </div>
                            </td>
                            <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                              <span className={`font-bold ${
                                darkMode ? "text-red-400" : "text-red-600"
                              }`}>
                                {formatCurrency(parseFloat(exp.amount))}
                              </span>
                            </td>
                            <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(exp.categoryId)}`}>
                                {getCategoryName(exp.categoryId)}
                              </span>
                            </td>
                            <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm">
                              <span className={darkClasses.textSecondary}>
                                {formatDate(exp.date)}
                              </span>
                            </td>
                            <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm font-medium space-x-1">
                              <button
                                onClick={() => startEdit(exp)}
                                className={`px-3 py-1 rounded-lg transition-all duration-200 ${
                                  darkMode 
                                    ? "bg-blue-600 text-white hover:bg-blue-700" 
                                    : "bg-blue-500 text-white hover:bg-blue-600"
                                }`}
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => deleteExpense(exp.id)}
                                className={`px-3 py-1 rounded-lg transition-all duration-200 ${
                                  darkMode 
                                    ? "bg-red-600 text-white hover:bg-red-700" 
                                    : "bg-red-500 text-white hover:bg-red-600"
                                }`}
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
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Expenses;