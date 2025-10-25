// src/components/expenses/ExpensesList.jsx
import React from 'react';
import ExpenseRow from './ExpenseRow';
import { formatCurrency } from '../../utils/currencyFormatter';

const ExpensesList = ({ 
  expenses, 
  categories, 
  loading, 
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
    card: darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200",
    text: darkMode ? "text-white" : "text-gray-900",
    textMuted: darkMode ? "text-gray-300" : "text-gray-600",
    tableHeader: darkMode ? "bg-gray-700 text-gray-300" : "bg-gray-50 text-gray-500",
    tableRow: darkMode ? "hover:bg-gray-700" : "hover:bg-gray-50",
    border: darkMode ? "border-gray-700" : "border-gray-200",
  };

  const totalAmount = expenses.reduce((sum, exp) => sum + parseFloat(exp.amount), 0);

  if (loading) {
    return (
      <div className={`rounded-2xl shadow-2xl overflow-hidden ${darkClasses.card}`}>
        <div className="text-center py-12">
          <div className={`animate-spin rounded-full h-12 w-12 border-b-2 mx-auto ${
            darkMode ? "border-blue-400" : "border-blue-600"
          }`}></div>
          <p className={`mt-4 text-base ${darkClasses.textMuted}`}>Loading expenses...</p>
        </div>
      </div>
    );
  }

  if (expenses.length === 0) {
    return (
      <div className={`rounded-2xl shadow-2xl overflow-hidden ${darkClasses.card}`}>
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📊</div>
          <h3 className={`text-xl font-bold mb-2 ${darkClasses.text}`}>No expenses found</h3>
          <p className={darkClasses.textMuted}>Try adjusting your filters or add a new expense!</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`rounded-2xl shadow-2xl overflow-hidden ${darkClasses.card}`}>
      {/* List Header */}
      <div className={`px-4 sm:px-6 py-4 border-b ${darkClasses.border}`}>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-2 sm:space-y-0">
          <h2 className={`text-lg sm:text-xl font-bold ${darkClasses.text}`}>
            Expenses ({expenses.length})
          </h2>
          <div className={`text-base sm:text-lg font-semibold ${darkMode ? "text-green-400" : "text-green-600"}`}>
            {formatCurrency(totalAmount)}
          </div>
        </div>
      </div>

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
              {expenses.map(expense => (
                <ExpenseRow
                  key={expense.id}
                  expense={expense}
                  categories={categories}
                  editingId={editingId}
                  editTitle={editTitle}
                  setEditTitle={setEditTitle}
                  editAmount={editAmount}
                  setEditAmount={setEditAmount}
                  editCategoryId={editCategoryId}
                  setEditCategoryId={setEditCategoryId}
                  onStartEdit={onStartEdit}
                  onUpdateExpense={onUpdateExpense}
                  onCancelEdit={onCancelEdit}
                  onDeleteExpense={onDeleteExpense}
                  darkMode={darkMode}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ExpensesList;