// src/components/expenses/ExpenseFilters.jsx
import React from 'react';

const ExpenseFilters = ({ 
  searchTerm, 
  setSearchTerm, 
  filterCategoryId, 
  setFilterCategoryId, 
  fromDate, 
  setFromDate, 
  toDate, 
  setToDate, 
  minAmount, 
  setMinAmount, 
  maxAmount, 
  setMaxAmount, 
  categories, 
  showFilters, 
  setShowFilters, 
  onApplyFilter, 
  onResetFilter, 
  darkMode 
}) => {
  const darkClasses = {
    card: darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200",
    text: darkMode ? "text-white" : "text-gray-900",
    input: darkMode 
      ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500" 
      : "bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-blue-500 focus:border-blue-500",
  };

  return (
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
          onClick={() => setShowFilters(!showFilters)}
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

      {/* Advanced Filters */}
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
            onClick={onApplyFilter}
            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-all duration-200 flex items-center space-x-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z" />
            </svg>
            <span>Apply Filters</span>
          </button>
          
          <button
            onClick={onResetFilter}
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
  );
};

export default ExpenseFilters;