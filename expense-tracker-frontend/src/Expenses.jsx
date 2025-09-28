import React, { useState, useEffect } from "react";
import axios from "axios";

function Expenses() {
  const [expenses, setExpenses] = useState([]);
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editAmount, setEditAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const API_URL = "http://localhost:5237/api/expenses";

  // Fetch all expenses
  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.get(API_URL);
      setExpenses(res.data);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch expenses");
    } finally {
      setLoading(false);
    }
  };

  // Add a new expense
  const addExpense = async (e) => {
    if (e) e.preventDefault();
    if (!title.trim() || !amount) return;

    setError("");
    try {
      const res = await axios.post(API_URL, {
        title: title.trim(),
        amount: parseFloat(amount),
        date: new Date()
      });
      setExpenses([...expenses, res.data]);
      setTitle("");
      setAmount("");
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
      await axios.delete(`${API_URL}/${id}`);
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
  };

  // Update expense
  const updateExpense = async (id) => {
    if (!editTitle.trim() || !editAmount) return;

    setError("");
    try {
      await axios.put(`${API_URL}/${id}`, {
        id,
        title: editTitle.trim(),
        amount: parseFloat(editAmount),
        date: new Date()
      });
      setExpenses(expenses.map(exp => 
        exp.id === id ? { ...exp, title: editTitle, amount: editAmount } : exp
      ));
      setEditingId(null);
    } catch (err) {
      console.error(err);
      setError("Failed to update expense");
    }
  };

  // Calculate total expenses
  const totalAmount = expenses.reduce((sum, exp) => sum + parseFloat(exp.amount), 0);

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 pb-6 border-b border-gray-200">
          <div className="mb-4 sm:mb-0">
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              💸 Expense Tracker
            </h1>
            <p className="text-gray-600 mt-2">Manage your expenses easily</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-green-600">
              ${totalAmount.toFixed(2)}
            </div>
            <div className="text-sm text-gray-500">
              {expenses.length} {expenses.length === 1 ? 'expense' : 'expenses'}
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center">
              <div className="text-red-600 text-sm">{error}</div>
              <button
                onClick={() => setError("")}
                className="ml-auto text-red-500 hover:text-red-700"
              >
                ×
              </button>
            </div>
          </div>
        )}

        {/* Add Expense Form */}
        <form onSubmit={addExpense} className="mb-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Expense Title
              </label>
              <input
                id="title"
                type="text"
                placeholder="Dinner, Groceries, etc."
                value={title}
                onChange={e => setTitle(e.target.value)}
                maxLength={50}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
            </div>
            <div>
              <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-2">
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
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
            </div>
            <div className="flex items-end">
              <button
                type="submit"
                disabled={!title.trim() || !amount}
                className="w-full px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
              >
                <span className="mr-2">+</span>
                Add Expense
              </button>
            </div>
          </div>
        </form>

        {/* Expenses List */}
        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading expenses...</p>
            </div>
          ) : expenses.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
              <div className="text-6xl mb-4">📊</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No expenses yet</h3>
              <p className="text-gray-500">Add your first expense using the form above!</p>
            </div>
          ) : (
            expenses.map(exp => (
              <div
                key={exp.id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
              >
                {editingId === exp.id ? (
                  // Edit Mode
                  <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Title
                        </label>
                        <input
                          type="text"
                          value={editTitle}
                          onChange={e => setEditTitle(e.target.value)}
                          placeholder="Expense title"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Amount ($)
                        </label>
                        <input
                          type="number"
                          value={editAmount}
                          onChange={e => setEditAmount(e.target.value)}
                          placeholder="0.00"
                          min="0"
                          step="0.01"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div className="flex items-end space-x-2">
                        <button
                          onClick={() => updateExpense(exp.id)}
                          disabled={!editTitle.trim() || !editAmount}
                          className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:ring-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                        >
                          <span className="mr-2">💾</span>
                          Save
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="flex-1 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 focus:ring-2 focus:ring-gray-500 transition-colors flex items-center justify-center"
                        >
                          <span className="mr-2">❌</span>
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  // View Mode
                  <div className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between">
                      <div className="flex-1">
                        <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-6">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {exp.title}
                          </h3>
                          <div className="text-xl font-bold text-red-600">
                            ${parseFloat(exp.amount).toFixed(2)}
                          </div>
                          <div className="text-sm text-gray-500">
                            {formatDate(exp.date)}
                          </div>
                        </div>
                      </div>
                      <div className="flex space-x-2 mt-4 md:mt-0">
                        <button
                          onClick={() => startEdit(exp)}
                          className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 focus:ring-2 focus:ring-yellow-500 transition-colors flex items-center"
                        >
                          <span className="mr-2">✏️</span>
                          Edit
                        </button>
                        <button
                          onClick={() => deleteExpense(exp.id)}
                          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:ring-2 focus:ring-red-500 transition-colors flex items-center"
                        >
                          <span className="mr-2">🗑️</span>
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Footer Stats */}
        {expenses.length > 0 && !loading && (
          <div className="mt-8 text-center text-sm text-gray-500">
            Total of {expenses.length} {expenses.length === 1 ? 'expense' : 'expenses'} • 
            ${totalAmount.toFixed(2)} spent
          </div>
        )}
      </div>
    </div>
  );
}

export default Expenses;