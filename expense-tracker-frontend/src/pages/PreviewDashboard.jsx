// PreviewDashboard.jsx
import React from "react";

const mockExpenses = [
  { id: 1, category: "Food", amount: 20, date: "2025-11-01" },
  { id: 2, category: "Transport", amount: 15, date: "2025-11-01" },
  { id: 3, category: "Shopping", amount: 50, date: "2025-11-02" },
];

const PreviewDashboard = () => {
  return (
    <div className="p-10 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Dashboard Preview</h1>
      <table className="w-full border rounded-lg">
        <thead className="bg-gray-200">
          <tr>
            <th className="p-3 text-left">Category</th>
            <th className="p-3 text-left">Amount</th>
            <th className="p-3 text-left">Date</th>
          </tr>
        </thead>
        <tbody>
          {mockExpenses.map((exp) => (
            <tr key={exp.id} className="border-b hover:bg-gray-50">
              <td className="p-3">{exp.category}</td>
              <td className="p-3">${exp.amount}</td>
              <td className="p-3">{exp.date}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PreviewDashboard;
