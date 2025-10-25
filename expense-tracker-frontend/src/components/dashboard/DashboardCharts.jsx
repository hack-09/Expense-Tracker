// src/components/dashboard/DashboardCharts.jsx
import React from 'react';
import CategoryPieChart from './CategoryPieChart';
import ExpenseTrendChart from './ExpenseTrendChart';

const DashboardCharts = ({ chartData, darkMode }) => {
  if (!chartData) return null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <CategoryPieChart chartData={chartData} darkMode={darkMode} />
      <ExpenseTrendChart chartData={chartData} darkMode={darkMode} />
    </div>
  );
};

export default DashboardCharts;