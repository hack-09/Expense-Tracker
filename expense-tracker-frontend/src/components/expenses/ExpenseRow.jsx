// src/components/expenses/ExpenseRow.jsx
import React from 'react';
import { formatCurrency } from '../../utils/currencyFormatter';

const ExpenseRow = ({ 
  expense, 
  categories, 
  editingId, 
  editTitle, 
  setEditTitle, 
  editAmount, 
  setEditAmount, 
  editCategoryId, 
  setEditCategoryId, 
  onStartEdit, 
  onUpdateExpense, 
  onCancelEdit, 
  onDeleteExpense, 
  darkMode 
}) => {
  const darkClasses = {
    text: darkMode ? "text-white" : "text-gray-900",
    textSecondary: darkMode ? "text-gray-400" : "text-gray-500",
    input: darkMode 
      ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500" 
      : "bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-blue-500 focus:border-blue-500",
  };

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

  if (editingId === expense.id) {
    return (
      <tr className={darkMode ? "hover:bg-gray-700" : "hover:bg-gray-50"}>
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
            {formatDate(expense.date)}
          </span>
        </td>
        <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
          <button
            onClick={() => onUpdateExpense(expense.id)}
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
            onClick={onCancelEdit}
            className={`px-3 py-1 rounded-lg transition-all duration-200 ${
              darkMode 
                ? "bg-gray-600 text-white hover:bg-gray-500" 
                : "bg-gray-400 text-white hover:bg-gray-500"
            }`}
          >
            Cancel
          </button>
        </td>
      </tr>
    );
  }

  return (
    <tr className={darkMode ? "hover:bg-gray-700" : "hover:bg-gray-50"}>
      <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div className={`w-2 h-2 rounded-full mr-2 ${
            parseFloat(expense.amount) > 100 ? "bg-red-500" : 
            parseFloat(expense.amount) > 50 ? "bg-yellow-500" : "bg-green-500"
          }`}></div>
          <span className={`font-medium ${darkClasses.text}`}>{expense.title}</span>
        </div>
      </td>
      <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
        <span className={`font-bold ${darkMode ? "text-red-400" : "text-red-600"}`}>
          {formatCurrency(parseFloat(expense.amount))}
        </span>
      </td>
      <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(expense.categoryId)}`}>
          {getCategoryName(expense.categoryId)}
        </span>
      </td>
      <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm">
        <span className={darkClasses.textSecondary}>
          {formatDate(expense.date)}
        </span>
      </td>
      <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm font-medium space-x-1">
        <button
          onClick={() => onStartEdit(expense)}
          className={`px-3 py-1 rounded-lg transition-all duration-200 ${
            darkMode 
              ? "bg-blue-600 text-white hover:bg-blue-700" 
              : "bg-blue-500 text-white hover:bg-blue-600"
          }`}
        >
          Edit
        </button>
        <button
          onClick={() => onDeleteExpense(expense.id)}
          className={`px-3 py-1 rounded-lg transition-all duration-200 ${
            darkMode 
              ? "bg-red-600 text-white hover:bg-red-700" 
              : "bg-red-500 text-white hover:bg-red-600"
          }`}
        >
          Delete
        </button>
      </td>
    </tr>
  );
};

export default ExpenseRow;