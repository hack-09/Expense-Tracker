import React, { useState, useEffect } from "react";
import axios from "axios";

function Expenses() {
  const [expenses, setExpenses] = useState([]);
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editAmount, setEditAmount] = useState("");
  const [loading, setLoading] = useState(false);

  const API_URL = "http://localhost:5237/api/expenses";

  // Fetch all expenses
  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    setLoading(true);
    try {
      const res = await axios.get(API_URL);
      setExpenses(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Add a new expense
  const addExpense = async () => {
    if (!title.trim() || !amount) return;

    try {
      const res = await axios.post(API_URL, {
        title: title.trim(),
        amount: parseFloat(amount),
        date: new Date()
      });
      setExpenses([...expenses, res.data]);
      setTitle("");
      setAmount("");
    } catch (err) {
      console.error(err);
    }
  };

  // Delete expense
  const deleteExpense = async (id) => {
    if (!window.confirm("Are you sure you want to delete this expense?")) return;

    try {
      await axios.delete(`${API_URL}/${id}`);
      setExpenses(expenses.filter(exp => exp.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  // Start editing
  const startEdit = (expense) => {
    setEditingId(expense.id);
    setEditTitle(expense.title);
    setEditAmount(expense.amount);
  };

  // Update expense
  const updateExpense = async (id) => {
    if (!editTitle.trim() || !editAmount) return;

    try {
      await axios.put(`${API_URL}/${id}`, {
        id,
        title: editTitle.trim(),
        amount: parseFloat(editAmount),
        date: new Date()
      });
      setExpenses(expenses.map(exp => 
        exp.id === id ? { ...exp, title: editTitle, amount: editAmount } : exp
      ));
      setEditingId(null);
    } catch (err) {
      console.error(err);
    }
  };

  // Calculate total expenses
  const totalAmount = expenses.reduce((sum, exp) => sum + parseFloat(exp.amount), 0);

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    addExpense();
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>💸 Expense Tracker</h1>
        <div style={styles.summary}>
          <div style={styles.total}>Total: ${totalAmount.toFixed(2)}</div>
          <div style={styles.count}>{expenses.length} expenses</div>
        </div>
      </div>

      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.inputGroup}>
          <input
            style={styles.input}
            type="text"
            placeholder="Expense title"
            value={title}
            onChange={e => setTitle(e.target.value)}
            maxLength={50}
          />
          <input
            style={styles.input}
            type="number"
            placeholder="Amount"
            value={amount}
            onChange={e => setAmount(e.target.value)}
            min="0"
            step="0.01"
          />
          <button 
            style={styles.addButton}
            type="submit"
            disabled={!title.trim() || !amount}
          >
            + Add Expense
          </button>
        </div>
      </form>

      {loading ? (
        <div style={styles.loading}>Loading expenses...</div>
      ) : (
        <div style={styles.expensesList}>
          {expenses.length === 0 ? (
            <div style={styles.emptyState}>
              <div style={styles.emptyIcon}>📊</div>
              <div>No expenses yet</div>
              <div style={styles.emptySubtitle}>Add your first expense above!</div>
            </div>
          ) : (
            expenses.map(exp => (
              <div key={exp.id} style={styles.expenseItem}>
                {editingId === exp.id ? (
                  <div style={styles.editForm}>
                    <input
                      style={styles.editInput}
                      type="text"
                      value={editTitle}
                      onChange={e => setEditTitle(e.target.value)}
                      placeholder="Expense title"
                    />
                    <input
                      style={styles.editInput}
                      type="number"
                      value={editAmount}
                      onChange={e => setEditAmount(e.target.value)}
                      placeholder="Amount"
                      min="0"
                      step="0.01"
                    />
                    <div style={styles.editActions}>
                      <button 
                        style={styles.saveButton}
                        onClick={() => updateExpense(exp.id)}
                        disabled={!editTitle.trim() || !editAmount}
                      >
                        💾 Save
                      </button>
                      <button 
                        style={styles.cancelButton}
                        onClick={() => setEditingId(null)}
                      >
                        ❌ Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div style={styles.expenseContent}>
                    <div style={styles.expenseInfo}>
                      <div style={styles.expenseTitle}>{exp.title}</div>
                      <div style={styles.expenseAmount}>${parseFloat(exp.amount).toFixed(2)}</div>
                      <div style={styles.expenseDate}>
                        {new Date(exp.date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </div>
                    </div>
                    <div style={styles.expenseActions}>
                      <button 
                        style={styles.editButton}
                        onClick={() => startEdit(exp)}
                      >
                        ✏️ Edit
                      </button>
                      <button 
                        style={styles.deleteButton}
                        onClick={() => deleteExpense(exp.id)}
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "800px",
    margin: "0 auto",
    padding: "20px",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    backgroundColor: "#f8f9fa",
    minHeight: "100vh"
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "30px",
    paddingBottom: "20px",
    borderBottom: "2px solid #e9ecef"
  },
  title: {
    color: "#2c3e50",
    margin: 0,
    fontSize: "2.5rem",
    fontWeight: "700"
  },
  summary: {
    textAlign: "right"
  },
  total: {
    fontSize: "1.5rem",
    fontWeight: "600",
    color: "#27ae60"
  },
  count: {
    color: "#7f8c8d",
    fontSize: "0.9rem"
  },
  form: {
    marginBottom: "30px"
  },
  inputGroup: {
    display: "flex",
    gap: "10px",
    flexWrap: "wrap"
  },
  input: {
    padding: "12px 15px",
    borderRadius: "8px",
    border: "2px solid #ddd",
    fontSize: "16px",
    flex: "1",
    minWidth: "150px",
    transition: "border-color 0.3s",
    outline: "none"
  },
  inputFocus: {
    borderColor: "#3498db"
  },
  addButton: {
    padding: "12px 25px",
    borderRadius: "8px",
    backgroundColor: "#3498db",
    color: "#fff",
    border: "none",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "background-color 0.3s",
    minWidth: "140px"
  },
  addButtonHover: {
    backgroundColor: "#2980b9"
  },
  addButtonDisabled: {
    backgroundColor: "#bdc3c7",
    cursor: "not-allowed"
  },
  expensesList: {
    display: "flex",
    flexDirection: "column",
    gap: "15px"
  },
  expenseItem: {
    backgroundColor: "white",
    borderRadius: "12px",
    padding: "20px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
    transition: "transform 0.2s, box-shadow 0.2s"
  },
  expenseItemHover: {
    transform: "translateY(-2px)",
    boxShadow: "0 4px 15px rgba(0,0,0,0.15)"
  },
  expenseContent: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center"
  },
  expenseInfo: {
    display: "flex",
    alignItems: "center",
    gap: "20px",
    flexWrap: "wrap"
  },
  expenseTitle: {
    fontSize: "18px",
    fontWeight: "600",
    color: "#2c3e50"
  },
  expenseAmount: {
    fontSize: "20px",
    fontWeight: "700",
    color: "#e74c3c"
  },
  expenseDate: {
    color: "#7f8c8d",
    fontSize: "14px"
  },
  expenseActions: {
    display: "flex",
    gap: "10px"
  },
  editButton: {
    padding: "8px 15px",
    borderRadius: "6px",
    backgroundColor: "#f39c12",
    color: "white",
    border: "none",
    cursor: "pointer",
    fontSize: "14px",
    transition: "background-color 0.3s"
  },
  deleteButton: {
    padding: "8px 15px",
    borderRadius: "6px",
    backgroundColor: "#e74c3c",
    color: "white",
    border: "none",
    cursor: "pointer",
    fontSize: "14px",
    transition: "background-color 0.3s"
  },
  editForm: {
    display: "flex",
    gap: "10px",
    alignItems: "center",
    flexWrap: "wrap"
  },
  editInput: {
    padding: "8px 12px",
    borderRadius: "6px",
    border: "2px solid #ddd",
    fontSize: "14px",
    minWidth: "120px"
  },
  editActions: {
    display: "flex",
    gap: "5px"
  },
  saveButton: {
    padding: "8px 15px",
    borderRadius: "6px",
    backgroundColor: "#27ae60",
    color: "white",
    border: "none",
    cursor: "pointer",
    fontSize: "14px"
  },
  cancelButton: {
    padding: "8px 15px",
    borderRadius: "6px",
    backgroundColor: "#95a5a6",
    color: "white",
    border: "none",
    cursor: "pointer",
    fontSize: "14px"
  },
  loading: {
    textAlign: "center",
    padding: "40px",
    fontSize: "18px",
    color: "#7f8c8d"
  },
  emptyState: {
    textAlign: "center",
    padding: "60px 20px",
    color: "#7f8c8d"
  },
  emptyIcon: {
    fontSize: "48px",
    marginBottom: "15px"
  },
  emptySubtitle: {
    fontSize: "14px",
    marginTop: "5px"
  }
};

// Add hover effects
const addHoverEffects = () => {
  const style = document.createElement('style');
  style.textContent = `
    input:focus { border-color: #3498db !important; }
    button:hover:not(:disabled) { opacity: 0.9; transform: translateY(-1px); }
    .expense-item:hover { transform: translateY(-2px); box-shadow: 0 4px 15px rgba(0,0,0,0.15); }
  `;
  document.head.appendChild(style);
};

// Initialize hover effects
addHoverEffects();

export default Expenses;