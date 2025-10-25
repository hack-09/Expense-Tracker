// src/components/dashboard/DashboardView.jsx
import React from 'react';
import DashboardStats from './DashboardStats';
import DashboardCharts from './DashboardCharts';

const DashboardView = ({ dashboardData, dashboardLoading, darkMode }) => {
  const darkClasses = {
    background: darkMode ? "bg-gray-900" : "bg-gray-50",
    card: darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200",
    text: darkMode ? "text-white" : "text-gray-900",
    textMuted: darkMode ? "text-gray-300" : "text-gray-600",
  };

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

      <DashboardStats summary={dashboardData.summary} darkMode={darkMode} />
      <DashboardCharts chartData={dashboardData.chartData} darkMode={darkMode} />
    </div>
  );
};

export default DashboardView;