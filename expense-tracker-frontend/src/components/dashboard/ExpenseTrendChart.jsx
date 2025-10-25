// src/components/dashboard/ExpenseTrendChart.jsx
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { formatCurrency } from '../../utils/currencyFormatter';

const ExpenseTrendChart = ({ chartData, darkMode }) => {
  const darkClasses = {
    text: darkMode ? "text-white" : "text-gray-900",
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className={`p-3 rounded-lg shadow-lg border ${
          darkMode ? "bg-gray-800 border-gray-600 text-white" : "bg-white border-gray-200 text-gray-900"
        }`}>
          <p className="font-semibold">{label}</p>
          <p className="text-blue-500">{formatCurrency(payload[0].value)}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className={`rounded-2xl shadow-lg border p-6 ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}>
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
  );
};

export default ExpenseTrendChart;