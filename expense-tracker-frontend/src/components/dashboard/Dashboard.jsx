// src/components/dashboard/Dashboard.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import DashboardStats from "./DashboardStats";
import CategoryPieChart from "./CategoryPieChart";
import ExpenseTrendChart from "./ExpenseTrendChart";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5237";

const Dashboard = ({ darkMode }) => {
  const [summary, setSummary] = useState(null);
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const darkClasses = {
    background: darkMode ? "bg-gray-900" : "bg-gray-50",
    text: darkMode ? "text-white" : "text-gray-900",
  };

  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("No authentication token found");
          setLoading(false);
          return;
        }

        const headers = { Authorization: `Bearer ${token}` };

        const [summaryRes, chartRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/api/expenses/summary`, { headers }),
          axios.get(`${API_BASE_URL}/api/expenses/chart-data`, { headers }),
        ]);

        setSummary(summaryRes.data);
        setChartData(chartRes.data);
        setError("");
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError("Failed to load dashboard data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className={`min-h-screen ${darkClasses.background} flex items-center justify-center`}>
        <div className="text-center">
          <div className={`animate-spin rounded-full h-12 w-12 border-b-2 mx-auto ${
            darkMode ? "border-blue-400" : "border-blue-600"
          }`}></div>
          <p className={`mt-4 ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
            Loading dashboard...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`min-h-screen ${darkClasses.background} flex items-center justify-center`}>
        <div className="text-center">
          <div className="text-6xl mb-4">📊</div>
          <h3 className={`text-xl font-bold mb-2 ${darkClasses.text}`}>Dashboard Error</h3>
          <p className={darkMode ? "text-gray-300" : "text-gray-600"}>{error}</p>
        </div>
      </div>
    );
  }

  if (!summary || !chartData) {
    return (
      <div className={`min-h-screen ${darkClasses.background} flex items-center justify-center`}>
        <div className="text-center">
          <div className="text-6xl mb-4">📊</div>
          <h3 className={`text-xl font-bold mb-2 ${darkClasses.text}`}>No Data Available</h3>
          <p className={darkMode ? "text-gray-300" : "text-gray-600"}>
            Start adding expenses to see your dashboard data.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${darkClasses.background} py-8 px-4 sm:px-6 lg:px-8`}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className={`rounded-2xl p-6 mb-8 shadow-2xl ${darkMode ? "bg-gray-800" : "bg-white"}`}>
          <div className="flex items-center space-x-4">
            <div className={`p-3 rounded-2xl ${darkMode ? "bg-purple-600" : "bg-purple-500"}`}>
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div>
              <h1 className={`text-3xl font-bold ${darkClasses.text}`}>Dashboard Overview</h1>
              <p className={`mt-1 ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                Insights into your spending patterns
              </p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <DashboardStats summary={summary} darkMode={darkMode} />

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <CategoryPieChart chartData={chartData} darkMode={darkMode} />
          <ExpenseTrendChart chartData={chartData} darkMode={darkMode} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;