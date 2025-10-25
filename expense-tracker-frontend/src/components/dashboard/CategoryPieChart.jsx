// src/components/dashboard/CategoryPieChart.jsx
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";

const CategoryPieChart = ({ chartData, darkMode }) => {
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8", "#82CA9D", "#FF6B6B"];

  const darkClasses = {
    card: darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200",
    text: darkMode ? "text-white" : "text-gray-900",
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className={`p-3 rounded-lg shadow-lg border ${
          darkMode ? "bg-gray-800 border-gray-600 text-white" : "bg-white border-gray-200 text-gray-900"
        }`}>
          <p className="font-semibold">{payload[0].name}</p>
          <p className="text-blue-500">₹{payload[0].value}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className={`shadow-lg border ${darkClasses.card}`}>
      <CardContent className="p-6">
        <h3 className={`text-xl font-semibold mb-4 ${darkClasses.text}`}>
          Expenses by Category
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={chartData.byCategory}
              dataKey="amount"
              nameKey="category"
              cx="50%"
              cy="50%"
              outerRadius={120}
              label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
              labelLine={false}
            >
              {chartData.byCategory.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default CategoryPieChart;