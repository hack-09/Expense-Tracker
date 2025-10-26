// src/pages/Expenses.jsx
import React, { useState, useEffect } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";
import { useDarkMode } from "../hooks/useDarkMode";
import DashboardView from "../components/dashboard/DashboardView";
import AddExpenseForm from "../components/expenses/AddExpenseForm";
import ExpenseFilters from "../components/expenses/ExpenseFilters";
import ExpensesList from "../components/expenses/ExpensesList";

function Expenses() {
  const navigate = useNavigate();
  const { darkMode, toggleDarkMode } = useDarkMode();

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
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");
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

  // Fetch expenses & categories
  useEffect(() => {
    fetchExpenses();
    fetchCategories();
  }, []);

  // Fetch dashboard data when tab changes to dashboard or when expenses update
  useEffect(() => {
    if (activeTab === "dashboard") {
      if(dashboardData.summary === null || dashboardData.chartData === null)
        fetchDashboardData();
    }
  }, [activeTab, expenses]);

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

  const darkClasses = {
    background: darkMode ? "bg-gradient-to-br from-gray-900 to-gray-800" : "bg-gradient-to-br from-blue-50 to-indigo-100",
    card: darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200",
    text: darkMode ? "text-white" : "text-gray-900",
    textMuted: darkMode ? "text-gray-300" : "text-gray-600",
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
          <DashboardView
            dashboardData={dashboardData}
            dashboardLoading={dashboardLoading}
            darkMode={darkMode}
          />
        ) : (
          <div className="max-w-7xl mx-auto space-y-6">
            <AddExpenseForm
              title={title}
              setTitle={setTitle}
              amount={amount}
              setAmount={setAmount}
              categoryId={categoryId}
              setCategoryId={setCategoryId}
              categories={categories}
              onAddExpense={addExpense}
              darkMode={darkMode}
            />

            <ExpenseFilters
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              filterCategoryId={filterCategoryId}
              setFilterCategoryId={setFilterCategoryId}
              fromDate={fromDate}
              setFromDate={setFromDate}
              toDate={toDate}
              setToDate={setToDate}
              minAmount={minAmount}
              setMinAmount={setMinAmount}
              maxAmount={maxAmount}
              setMaxAmount={setMaxAmount}
              categories={categories}
              showFilters={showFilters}
              setShowFilters={setShowFilters}
              onApplyFilter={applyFilter}
              onResetFilter={resetFilter}
              darkMode={darkMode}
            />

            <ExpensesList
              expenses={filteredExpenses}
              categories={categories}
              loading={loading}
              editingId={editingId}
              editTitle={editTitle}
              setEditTitle={setEditTitle}
              editAmount={editAmount}
              setEditAmount={setEditAmount}
              editCategoryId={editCategoryId}
              setEditCategoryId={setEditCategoryId}
              onStartEdit={startEdit}
              onUpdateExpense={updateExpense}
              onCancelEdit={() => setEditingId(null)}
              onDeleteExpense={deleteExpense}
              darkMode={darkMode}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default Expenses;