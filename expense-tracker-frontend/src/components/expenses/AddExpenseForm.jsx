// src/components/expenses/AddExpenseForm.jsx
import React from 'react';

const AddExpenseForm = ({ 
  title, 
  setTitle, 
  amount, 
  setAmount, 
  categoryId, 
  setCategoryId, 
  categories, 
  onAddExpense, 
  darkMode 
}) => {
  const darkClasses = {
    card: darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200",
    text: darkMode ? "text-white" : "text-gray-900",
    input: darkMode 
      ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500" 
      : "bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-blue-500 focus:border-blue-500",
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onAddExpense(e);
  };

  return (
    <div className={`rounded-2xl shadow-2xl p-6 ${darkClasses.card}`}>
      <h2 className={`text-xl font-bold mb-4 ${darkClasses.text} flex items-center`}>
        <svg className="w-6 h-6 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
        Add New Expense
      </h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
            Amount (₹)
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
  );
};

export default AddExpenseForm;