import React, { useState, useEffect } from 'react';
import './App.css';

const API_BASE_URL = 'http://localhost:3001/api';

function App() {
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [stats, setStats] = useState(null);
  const [newTransaction, setNewTransaction] = useState({
    description: '',
    amount: ''
  });
  const [loading, setLoading] = useState(true);

  // Fetch all data
  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch transactions
      const transactionsRes = await fetch(`${API_BASE_URL}/transactions`);
      const transactionsData = await transactionsRes.json();
      
      // Fetch categories
      const categoriesRes = await fetch(`${API_BASE_URL}/categories`);
      const categoriesData = await categoriesRes.json();
      
      // Fetch stats
      const statsRes = await fetch(`${API_BASE_URL}/stats`);
      const statsData = await statsRes.json();
      
      setTransactions(transactionsData.data || []);
      setCategories(categoriesData.data || []);
      setStats(statsData.data || null);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Add new transaction
  const handleAddTransaction = async (e) => {
    e.preventDefault();
    
    if (!newTransaction.description || !newTransaction.amount) {
      alert('Please fill in all fields');
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/transactions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newTransaction),
      });

      if (response.ok) {
        setNewTransaction({ description: '', amount: '' });
        fetchData();
      }
    } catch (error) {
      console.error('Error adding transaction:', error);
    }
  };

  // Update transaction category
  const handleCategoryChange = async (transactionId, newCategory) => {
    try {
      const response = await fetch(`${API_BASE_URL}/transactions/${transactionId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ category: newCategory }),
      });

      if (response.ok) {
        fetchData();
      }
    } catch (error) {
      console.error('Error updating category:', error);
    }
  };

  // Format currency
  const formatCurrency = (amount) => {
    return `Rs. ${Math.abs(amount).toLocaleString('en-IN')}`;
  };

  // Format date
  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="App">
      <header className="app-header">
        <h1>💰 Bank Transaction Manager</h1>
        <p>UPI Summary & Categorization</p>
      </header>

      {/* Overall Statistics */}
      {stats && (
        <div className="stats-container">
          <div className="stat-card income">
            <h3>Total Income</h3>
            <p className="stat-value">₹{stats.totalIncome.toLocaleString('en-IN')}</p>
          </div>
          <div className="stat-card expense">
            <h3>Total Expense</h3>
            <p className="stat-value">₹{stats.totalExpense.toLocaleString('en-IN')}</p>
          </div>
          <div className="stat-card balance">
            <h3>Net Balance</h3>
            <p className="stat-value">₹{stats.netBalance.toLocaleString('en-IN')}</p>
          </div>
          <div className="stat-card savings">
            <h3>Expected Savings</h3>
            <p className="stat-value">₹{stats.totalCashbackSavings.toLocaleString('en-IN')}</p>
          </div>
        </div>
      )}

      {/* Category Progress Blocks */}
      <div className="categories-section">
        <h2>📊 Category Breakdown</h2>
        <div className="categories-grid">
          {categories.map((category) => (
            <div key={category.category} className="category-block">
              <div className="category-header">
                <h3>{category.category}</h3>
                <span className="transaction-count">{category.transactionCount} transactions</span>
              </div>
              <div className="category-stats">
                <div className="category-stat">
                  <span className="label">Spent:</span>
                  <span className="value expense-text">₹{category.totalSpent.toLocaleString('en-IN')}</span>
                </div>
                <div className="category-stat">
                  <span className="label">Received:</span>
                  <span className="value income-text">₹{category.totalReceived.toLocaleString('en-IN')}</span>
                </div>
                <div className="category-stat">
                  <span className="label">Net:</span>
                  <span className={`value ${category.netAmount >= 0 ? 'income-text' : 'expense-text'}`}>
                    ₹{category.netAmount.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
              <div className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={{ 
                    width: `${Math.min((category.totalSpent / (stats?.totalExpense || 1)) * 100, 100)}%` 
                  }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Transaction Form */}
      <div className="add-transaction-section">
        <h2>➕ Add New Transaction</h2>
        <form onSubmit={handleAddTransaction} className="transaction-form">
          <input
            type="text"
            placeholder="Transaction description (e.g., Paid Rs. 250 to Zomato)"
            value={newTransaction.description}
            onChange={(e) => setNewTransaction({ ...newTransaction, description: e.target.value })}
            className="form-input"
          />
          <input
            type="number"
            placeholder="Amount (negative for expense, positive for income)"
            value={newTransaction.amount}
            onChange={(e) => setNewTransaction({ ...newTransaction, amount: e.target.value })}
            className="form-input"
          />
          <button type="submit" className="btn-primary">Add Transaction</button>
        </form>
      </div>

      {/* Transaction Stream */}
      <div className="transactions-section">
        <h2>📜 Transaction Stream</h2>
        <div className="transactions-list">
          {transactions.map((transaction) => (
            <div key={transaction.id} className="transaction-card">
              <div className="transaction-main">
                <div className="transaction-info">
                  <p className="transaction-description">{transaction.description}</p>
                  <p className="transaction-date">{formatDate(transaction.timestamp)}</p>
                </div>
                <div className="transaction-amount-section">
                  <p className={`transaction-amount ${transaction.amount >= 0 ? 'income' : 'expense'}`}>
                    {transaction.amount >= 0 ? '+' : '-'} {formatCurrency(transaction.amount)}
                  </p>
                </div>
              </div>
              
              <div className="transaction-footer">
                <div className="category-selector">
                  <label>Category:</label>
                  <select
                    value={transaction.category}
                    onChange={(e) => handleCategoryChange(transaction.id, e.target.value)}
                    className="category-dropdown"
                  >
                    <option value="Food & Dining">Food & Dining</option>
                    <option value="Travel">Travel</option>
                    <option value="Salary">Salary</option>
                    <option value="Shopping">Shopping</option>
                    <option value="Entertainment">Entertainment</option>
                    <option value="Utilities">Utilities</option>
                    <option value="Miscellaneous">Miscellaneous</option>
                  </select>
                </div>
              </div>

              {/* Cashback/Savings Indicator */}
              {transaction.hasCashback && transaction.expectedSavings > 0 && (
                <div className="cashback-indicator">
                  <span className="cashback-icon">🎉</span>
                  <span className="cashback-text">
                    Expected Savings: <strong>₹{transaction.expectedSavings}</strong>
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;

// Made with Bob
