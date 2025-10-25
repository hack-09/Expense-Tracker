import React, { useState, useEffect } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from "recharts";

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
  const [activeTab, setActiveTab] = useState("dashboard"); // "dashboard" or "expenses"
  const [dashboardData, setDashboardData] = useState({
    summary: null,
    chartData: null
  });
  const [dashboardLoading, setDashboardLoading] = useState(false);

  // Filter states
  const [filterCategoryId, setFilterCategoryId] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [minAmount, setMinAmount] = useState("");
  const [maxAmount, setMaxAmount] = useState("");

  // Color palette for charts
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#FF6B6B', '#4ECDC4'];

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

  // Fetch dashboard data when tab changes to dashboard or when expenses update
  useEffect(() => {
    if (activeTab === "dashboard") {
      fetchDashboardData();
    }
  }, [activeTab, expenses]); // Re-fetch when expenses change or tab changes

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

  const fetchDashboardData = async () => {
    setDashboardLoading(true);
    try {
      const [summaryRes, chartRes] = await Promise.all([
        api.get("/expenses/summary"),
        api.get("/expenses/chart-data")
      ]);
      
      setDashboardData({
        summary: summaryRes.data,
        chartData: chartRes.data
      });
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
      setError("Failed to load dashboard data");
    } finally {
      setDashboardLoading(false);
    }
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
    
    const expDate = new Date(exp.date);
    const matchesFromDate = !fromDate || expDate >= new Date(fromDate);
    const matchesToDate = !toDate || expDate <= new Date(toDate + 'T23:59:59');
    
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

  // Custom tooltip for charts
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className={`p-3 rounded-lg shadow-lg border ${
          darkMode ? "bg-gray-800 border-gray-600 text-white" : "bg-white border-gray-200 text-gray-900"
        }`}>
          <p className="font-semibold">{label}</p>
          <p className="text-blue-500">
            {formatCurrency(payload[0].value)}
          </p>
        </div>
      );
    }
    return null;
  };

  // Dashboard Components
  const DashboardStats = () => {
    const { summary } = dashboardData;
    if (!summary) return null;

    const stats = [
      {
        title: "Total Spent",
        value: formatCurrency(summary.totalSpent),
        color: "text-blue-600",
        icon: (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
          </svg>
        )
      },
      {
        title: "Avg Per Day",
        value: formatCurrency(summary.averagePerDay),
        color: "text-green-600",
        icon: (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        )
      },
      {
        title: "Top Category",
        value: summary.topCategory,
        color: "text-purple-600",
        icon: (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
        )
      }
    ];

    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className={`rounded-2xl shadow-lg border p-6 ${darkClasses.card}`}>
            <div className="flex items-center justify-between">
              <div>
                <h3 className={`text-lg font-medium ${darkClasses.textMuted}`}>
                  {stat.title}
                </h3>
                <p className={`text-2xl font-bold mt-2 ${stat.color}`}>
                  {stat.value}
                </p>
              </div>
              <div className={`p-3 rounded-xl ${darkMode ? "bg-gray-700" : "bg-gray-100"}`}>
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const DashboardCharts = () => {
    const { chartData } = dashboardData;
    if (!chartData) return null;

    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Pie Chart */}
        <div className={`rounded-2xl shadow-lg border p-6 ${darkClasses.card}`}>
          <h3 className={`text-xl font-semibold mb-4 ${darkClasses.text}`}>
            Expenses by Category
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={chartData.byCategory}
                dataKey="amount"
                nameKey="category"
                cx="50%"
                cy="50%"
                outerRadius={120}
                label={({ category, percent }) => `${category} (${(percent * 100).toFixed(0)}%)`}
                labelLine={false}
              >
                {chartData.byCategory.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Line Chart */}
        <div className={`rounded-2xl shadow-lg border p-6 ${darkClasses.card}`}>
          <h3 className={`text-xl font-semibold mb-4 ${darkClasses.text}`}>
            Expenses Over Time
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart
              data={chartData.byMonth}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? "#374151" : "#e5e7eb"} />
              <XAxis 
                dataKey="month" 
                stroke={darkMode ? "#9CA3AF" : "#6B7280"}
                fontSize={12}
              />
              <YAxis 
                stroke={darkMode ? "#9CA3AF" : "#6B7280"}
                fontSize={12}
                tickFormatter={(value) => formatCurrency(value)}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Line
                type="monotone"
                dataKey="amount"
                stroke="#8884d8"
                strokeWidth={2}
                activeDot={{ r: 8 }}
                name="Monthly Expenses"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  };

  const DashboardView = () => {
    if (dashboardLoading) {
      return (
        <div className="text-center py-12">
          <div className={`animate-spin rounded-full h-12 w-12 border-b-2 mx-auto ${
            darkMode ? "border-blue-400" : "border-blue-600"
          }`}></div>
          <p className={`mt-4 ${darkClasses.textMuted}`}>Loading dashboard...</p>
        </div>
      );
    }

    if (!dashboardData.summary || !dashboardData.chartData) {
      return (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📊</div>
          <h3 className={`text-xl font-bold mb-2 ${darkClasses.text}`}>No Data Available</h3>
          <p className={darkClasses.textMuted}>
            Start adding expenses to see your dashboard data.
          </p>
        </div>
      );
    }

    return (
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className={`rounded-2xl p-6 mb-8 shadow-2xl ${darkClasses.card}`}>
          <div className="flex items-center space-x-4">
            <div className={`p-3 rounded-2xl ${darkMode ? "bg-purple-600" : "bg-purple-500"}`}>
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div>
              <h1 className={`text-3xl font-bold ${darkClasses.text}`}>Dashboard Overview</h1>
              <p className={`mt-1 ${darkClasses.textMuted}`}>
                Insights into your spending patterns
              </p>
            </div>
          </div>
        </div>

        <DashboardStats />
        <DashboardCharts />

        {/* Category Breakdown Table */}
        {dashboardData.summary.categoryBreakdown && (
          <div className={`rounded-2xl shadow-lg border p-6 mt-8 ${darkClasses.card}`}>
            <h3 className={`text-xl font-semibold mb-4 ${darkClasses.text}`}>
              Category Breakdown
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className={darkClasses.tableHeader}>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">Category</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">Amount</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">Percentage</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {Object.entries(dashboardData.summary.categoryBreakdown)
                    .sort(([,a], [,b]) => b - a)
                    .map(([category, amount]) => {
                      const percentage = ((amount / dashboardData.summary.totalSpent) * 100).toFixed(1);
                      return (
                        <tr key={category} className={darkClasses.tableRow}>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <span className={`font-medium ${darkClasses.text}`}>{category}</span>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <span className={`font-bold ${darkMode ? "text-green-400" : "text-green-600"}`}>
                              {formatCurrency(amount)}
                            </span>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <span className={darkClasses.textSecondary}>
                              {percentage}%
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    );
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
    <div className={`min-h-screen transition-all duration-300 ${darkClasses.background}`}>
      {/* Header */}
      <div className={`shadow-2xl ${darkMode ? "bg-gray-800" : "bg-white"}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <div className={`p-2 rounded-xl ${darkMode ? "bg-blue-600" : "bg-blue-500"}`}>
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <h1 className={`text-2xl font-bold ${darkClasses.text}`}>Expense Tracker</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Navigation Tabs */}
              <div className="flex space-x-2">
                <button
                  onClick={() => setActiveTab("dashboard")}
                  className={`px-4 py-2 rounded-lg transition-all duration-200 ${
                    activeTab === "dashboard" 
                      ? "bg-blue-500 text-white shadow-lg" 
                      : darkMode ? "bg-gray-700 text-gray-300 hover:bg-gray-600" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  Dashboard
                </button>
                <button
                  onClick={() => setActiveTab("expenses")}
                  className={`px-4 py-2 rounded-lg transition-all duration-200 ${
                    activeTab === "expenses" 
                      ? "bg-green-500 text-white shadow-lg" 
                      : darkMode ? "bg-gray-700 text-gray-300 hover:bg-gray-600" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  Expenses
                </button>
              </div>

              {/* Dark Mode Toggle */}
              <button
                onClick={toggleDarkMode}
                className={`p-2 rounded-lg transition-colors duration-200 ${
                  darkMode 
                    ? "bg-yellow-400 text-gray-900 hover:bg-yellow-300" 
                    : "bg-gray-700 text-white hover:bg-gray-600"
                }`}
              >
                {darkMode ? "🌙" : "☀️"}
              </button>
              
              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-all duration-200 flex items-center space-x-2"
              >
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
          <div className={`rounded-xl p-4 border ${darkClasses.error} shadow-lg`}>
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
        </div>
      )}

      {/* Main Content */}
      <div className="py-8 px-4 sm:px-6 lg:px-8">
        {activeTab === "dashboard" ? (
          <DashboardView />
        ) : (
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Your existing Expenses component content goes here */}
            {/* Add Expense Form */}
            <div className={`rounded-2xl shadow-2xl p-6 ${darkClasses.card}`}>
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
            <div className={`rounded-2xl shadow-2xl p-6 ${darkClasses.card}`}>
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
        )}
      </div>
    </div>
  );
}

export default Expenses;