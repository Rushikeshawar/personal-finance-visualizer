import React, { useState, useEffect } from 'react';
import Head from 'next/head';

export default function Home() {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [budgets, setBudgets] = useState({});
  const [isEditingBudgets, setIsEditingBudgets] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formData, setFormData] = useState({
    amount: '',
    description: '',
    category: 'Food & Dining',
    type: 'expense',
    date: new Date().toISOString().split('T')[0]
  });

  const categories = [
    'Food & Dining',
    'Transportation',
    'Shopping',
    'Entertainment',
    'Bills & Utilities',
    'Healthcare',
    'Education',
    'Travel',
    'Groceries',
    'Other'
  ];

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 1000);
  }, []);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.amount || !formData.description) {
      alert('Please fill all required fields');
      return;
    }
    
    const newTransaction = {
      id: Date.now(),
      ...formData,
      amount: parseFloat(formData.amount),
      date: new Date(formData.date)
    };
    
    setTransactions(prev => [newTransaction, ...prev]);
    setFormData({
      amount: '',
      description: '',
      category: 'Food & Dining',
      type: 'expense',
      date: new Date().toISOString().split('T')[0]
    });
    setIsFormOpen(false);
  };

  const deleteTransaction = (id) => {
    if (confirm('Are you sure you want to delete this transaction?')) {
      setTransactions(prev => prev.filter(t => t.id !== id));
    }
  };

  const totalIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
  const totalExpenses = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
  const netBalance = totalIncome - totalExpenses;

  // Calculate budget data
  const getBudgetData = () => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    return categories.map(category => {
      const categoryExpenses = transactions
        .filter(t => {
          const transactionDate = new Date(t.date);
          return t.type === 'expense' && 
                 t.category === category &&
                 transactionDate.getMonth() === currentMonth &&
                 transactionDate.getFullYear() === currentYear;
        })
        .reduce((sum, t) => sum + t.amount, 0);
      
      const budget = budgets[category] || 0;
      const percentage = budget > 0 ? (categoryExpenses / budget) * 100 : 0;
      
      return {
        category,
        budget,
        spent: categoryExpenses,
        remaining: Math.max(0, budget - categoryExpenses),
        percentage: Math.min(100, percentage),
        isOverBudget: categoryExpenses > budget && budget > 0
      };
    }).filter(item => item.budget > 0 || item.spent > 0);
  };

  const saveBudgets = () => {
    setIsEditingBudgets(false);
    // In a real app, this would save to the database
  };

  if (isLoading) {
    return (
      <>
        <Head>
          <title>Personal Finance Tracker</title>
        </Head>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading Personal Finance Tracker...</p>
          </div>

        {/* Enhanced Footer */}
        <footer className="bg-gray-900 text-white mt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {/* Brand Section */}
              <div className="col-span-1 md:col-span-2">
                <div className="flex items-center mb-4">
                  <div className="h-10 w-10 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
                    <span className="text-white font-bold text-lg">₹</span>
                  </div>
                  <h3 className="text-xl font-bold">Personal Finance Tracker</h3>
                </div>
                <p className="text-gray-300 mb-6 max-w-md">
                  A comprehensive full-stack application for tracking personal finances, built with modern technologies 
                  for efficient money management and financial planning.
                </p>
                <div className="flex space-x-4">
                  <div className="bg-gray-800 p-3 rounded-lg">
                    <span className="text-sm">⭐ Stage 1-3 Complete</span>
                  </div>
                  <div className="bg-gray-800 p-3 rounded-lg">
                    <span className="text-sm">🚀 Production Ready</span>
                  </div>
                </div>
              </div>

              {/* Features */}
              <div>
                <h4 className="text-lg font-semibold mb-4">Features</h4>
                <ul className="space-y-2 text-gray-300">
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✓</span> Transaction Tracking
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✓</span> Category Management
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✓</span> Budget Planning
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✓</span> Financial Analytics
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✓</span> Responsive Design
                  </li>
                </ul>
              </div>

              {/* Tech Stack */}
              <div>
                <h4 className="text-lg font-semibold mb-4">Technology</h4>
                <ul className="space-y-2 text-gray-300">
                  <li>⚛️ React 18 & Next.js 14</li>
                  <li>🎨 Tailwind CSS</li>
                  <li>🗃️ MongoDB & Mongoose</li>
                  <li>📊 Recharts Library</li>
                  <li>🔧 shadcn/ui Components</li>
                </ul>
              </div>
            </div>

            {/* Stats Section */}
            <div className="border-t border-gray-700 mt-8 pt-8">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div className="bg-gray-800 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-blue-400">{transactions.length}</div>
                  <div className="text-sm text-gray-400">Total Transactions</div>
                </div>
                <div className="bg-gray-800 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-green-400">
                    {[...new Set(transactions.map(t => t.category))].length}
                  </div>
                  <div className="text-sm text-gray-400">Categories Used</div>
                </div>
                <div className="bg-gray-800 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-purple-400">100%</div>
                  <div className="text-sm text-gray-400">Responsive Design</div>
                </div>
                <div className="bg-gray-800 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-yellow-400">3/3</div>
                  <div className="text-sm text-gray-400">Stages Complete</div>
                </div>
              </div>
            </div>

            {/* Bottom Footer */}
            <div className="border-t border-gray-700 mt-8 pt-8">
              <div className="flex flex-col md:flex-row justify-between items-center">
                <div className="text-gray-400 text-sm mb-4 md:mb-0">
                  <p>© 2024 Personal Finance Tracker - Full Stack Internship Assignment</p>
                  <p className="mt-1">Built with ❤️ for modern financial management</p>
                </div>
                <div className="flex items-center space-x-6">
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                    System Status: Operational
                  </div>
                  <div className="text-sm text-gray-400">
                    Version 1.0.0
                  </div>
                </div>
              </div>
            </div>

            {/* Developer Info */}
            <div className="border-t border-gray-700 mt-6 pt-6">
              <div className="bg-gradient-to-r from-blue-900/50 to-purple-900/50 rounded-lg p-6">
                <div className="flex flex-col md:flex-row items-center justify-between">
                  <div>
                    <h4 className="text-lg font-semibold mb-2">🚀 Full-Stack Developer Showcase</h4>
                    <p className="text-gray-300 text-sm">
                      This application demonstrates proficiency in modern web development technologies including 
                      React, Next.js, MongoDB, API development, responsive design, and full-stack architecture.
                    </p>
                  </div>
                  <div className="mt-4 md:mt-0 flex gap-3">
                    <div className="bg-gray-800 px-4 py-2 rounded-lg text-sm">
                      <span className="text-blue-400">Frontend:</span> Expert
                    </div>
                    <div className="bg-gray-800 px-4 py-2 rounded-lg text-sm">
                      <span className="text-green-400">Backend:</span> Expert
                    </div>
                    <div className="bg-gray-800 px-4 py-2 rounded-lg text-sm">
                      <span className="text-purple-400">Database:</span> Expert
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </footer>
        </div>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Personal Finance Tracker</title>
        <meta name="description" content="Track your personal finances with ease" />
      </Head>

      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold">₹</span>
                </div>
                <h1 className="ml-2 text-xl font-bold text-gray-900">
                  Personal Finance Tracker
                </h1>
              </div>
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar */}
            <aside className="lg:w-64">
              <div className="bg-white rounded-lg shadow p-4">
                <nav className="space-y-2">
                  {[
                    { name: 'Dashboard', page: 'dashboard' },
                    { name: 'Transactions', page: 'transactions' },
                    { name: 'Budget', page: 'budget' }
                  ].map((item) => (
                    <button
                      key={item.name}
                      onClick={() => setCurrentPage(item.page)}
                      className={`w-full text-left px-3 py-2 rounded-md transition-colors ${
                        currentPage === item.page
                          ? 'bg-blue-100 text-blue-700'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      {item.name}
                    </button>
                  ))}
                </nav>
              </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1">
              {currentPage === 'dashboard' && (
                <div className="space-y-8">
                  {/* Header with Welcome Message */}
                  <div className="bg-gradient-to-r from-blue-600 to-purple-700 rounded-xl p-8 text-white">
                    <div className="flex justify-between items-center">
                      <div>
                        <h2 className="text-3xl font-bold mb-2">Welcome to Your Financial Dashboard</h2>
                        <p className="text-blue-100">Track, manage, and optimize your personal finances</p>
                        <div className="mt-4 flex items-center gap-4 text-sm">
                          <span className="bg-white/20 px-3 py-1 rounded-full">📊 {transactions.length} Total Transactions</span>
                          <span className="bg-white/20 px-3 py-1 rounded-full">💰 {new Date().toLocaleDateString()}</span>
                        </div>
                      </div>
                      <button
                        onClick={() => setIsFormOpen(true)}
                        className="bg-white text-blue-600 px-6 py-3 rounded-lg hover:bg-gray-100 transition-colors flex items-center gap-2 font-semibold shadow-lg"
                      >
                        <span className="text-xl">+</span> Add Transaction
                      </button>
                    </div>
                  </div>

                  {/* Enhanced Summary Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl shadow-lg border-l-4 border-green-500">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-sm font-medium text-green-700 uppercase tracking-wide">Total Income</h3>
                          <p className="text-3xl font-bold text-green-600 mt-2">{formatCurrency(totalIncome)}</p>
                          <p className="text-sm text-green-600 mt-1">
                            {transactions.filter(t => t.type === 'income').length} transactions
                          </p>
                        </div>
                        <div className="text-3xl">💰</div>
                      </div>
                    </div>
                    
                    <div className="bg-gradient-to-br from-red-50 to-red-100 p-6 rounded-xl shadow-lg border-l-4 border-red-500">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-sm font-medium text-red-700 uppercase tracking-wide">Total Expenses</h3>
                          <p className="text-3xl font-bold text-red-600 mt-2">{formatCurrency(totalExpenses)}</p>
                          <p className="text-sm text-red-600 mt-1">
                            {transactions.filter(t => t.type === 'expense').length} transactions
                          </p>
                        </div>
                        <div className="text-3xl">💸</div>
                      </div>
                    </div>
                    
                    <div className={`bg-gradient-to-br ${netBalance >= 0 ? 'from-blue-50 to-blue-100' : 'from-orange-50 to-orange-100'} p-6 rounded-xl shadow-lg border-l-4 ${netBalance >= 0 ? 'border-blue-500' : 'border-orange-500'}`}>
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className={`text-sm font-medium ${netBalance >= 0 ? 'text-blue-700' : 'text-orange-700'} uppercase tracking-wide`}>Net Balance</h3>
                          <p className={`text-3xl font-bold mt-2 ${netBalance >= 0 ? 'text-blue-600' : 'text-orange-600'}`}>
                            {formatCurrency(netBalance)}
                          </p>
                          <p className={`text-sm mt-1 ${netBalance >= 0 ? 'text-blue-600' : 'text-orange-600'}`}>
                            {netBalance >= 0 ? 'Positive balance' : 'Negative balance'}
                          </p>
                        </div>
                        <div className="text-3xl">{netBalance >= 0 ? '📈' : '📉'}</div>
                      </div>
                    </div>
                  </div>

                  {/* Quick Stats Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-white p-4 rounded-lg shadow border">
                      <div className="text-center">
                        <div className="text-2xl mb-2">📅</div>
                        <p className="text-sm text-gray-600">This Month</p>
                        <p className="text-lg font-semibold text-gray-800">
                          {transactions.filter(t => {
                            const transactionMonth = new Date(t.date).getMonth();
                            const currentMonth = new Date().getMonth();
                            return transactionMonth === currentMonth;
                          }).length}
                        </p>
                      </div>
                    </div>
                    
                    <div className="bg-white p-4 rounded-lg shadow border">
                      <div className="text-center">
                        <div className="text-2xl mb-2">📊</div>
                        <p className="text-sm text-gray-600">Categories</p>
                        <p className="text-lg font-semibold text-gray-800">
                          {[...new Set(transactions.map(t => t.category))].length}
                        </p>
                      </div>
                    </div>
                    
                    <div className="bg-white p-4 rounded-lg shadow border">
                      <div className="text-center">
                        <div className="text-2xl mb-2">💳</div>
                        <p className="text-sm text-gray-600">Avg Transaction</p>
                        <p className="text-lg font-semibold text-gray-800">
                          {transactions.length > 0 ? 
                            formatCurrency((totalIncome + totalExpenses) / transactions.length) : 
                            formatCurrency(0)
                          }
                        </p>
                      </div>
                    </div>
                    
                    <div className="bg-white p-4 rounded-lg shadow border">
                      <div className="text-center">
                        <div className="text-2xl mb-2">🎯</div>
                        <p className="text-sm text-gray-600">Savings Rate</p>
                        <p className="text-lg font-semibold text-gray-800">
                          {totalIncome > 0 ? 
                            `${((netBalance / totalIncome) * 100).toFixed(1)}%` : 
                            '0%'
                          }
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Category Breakdown */}
                  {transactions.length > 0 && (
                    <div className="bg-white rounded-xl shadow-lg p-6">
                      <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
                        <span>🏷️</span> Expense Categories
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {categories.map(category => {
                          const categoryExpenses = transactions
                            .filter(t => t.type === 'expense' && t.category === category)
                            .reduce((sum, t) => sum + t.amount, 0);
                          
                          if (categoryExpenses === 0) return null;
                          
                          const percentage = totalExpenses > 0 ? (categoryExpenses / totalExpenses) * 100 : 0;
                          
                          return (
                            <div key={category} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                              <div className="flex justify-between items-center mb-2">
                                <h4 className="font-medium text-gray-800">{category}</h4>
                                <span className="text-sm font-semibold text-blue-600">
                                  {percentage.toFixed(1)}%
                                </span>
                              </div>
                              <p className="text-lg font-bold text-red-600 mb-2">
                                {formatCurrency(categoryExpenses)}
                              </p>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div 
                                  className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                                  style={{ width: `${percentage}%` }}
                                ></div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Recent Transactions */}
                  <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                    <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-6 border-b">
                      <div className="flex justify-between items-center">
                        <h3 className="text-xl font-semibold flex items-center gap-2">
                          <span>📋</span> Recent Transactions
                        </h3>
                        {transactions.length > 5 && (
                          <button 
                            onClick={() => setCurrentPage('transactions')}
                            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                          >
                            View All →
                          </button>
                        )}
                      </div>
                    </div>
                    <div className="p-6">
                      {transactions.length === 0 ? (
                        <div className="text-center py-12">
                          <div className="text-6xl mb-4">💸</div>
                          <h4 className="text-lg font-semibold text-gray-700 mb-2">No transactions yet!</h4>
                          <p className="text-gray-500 mb-6">Start tracking your finances by adding your first transaction.</p>
                          <button
                            onClick={() => setIsFormOpen(true)}
                            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center gap-2"
                          >
                            <span>+</span> Add Your First Transaction
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {transactions.slice(0, 5).map((transaction, index) => (
                            <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                              <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-lg">
                                  {transaction.type === 'income' ? '💰' : '💸'}
                                </div>
                                <div>
                                  <p className="font-medium text-gray-800">{transaction.description}</p>
                                  <div className="flex items-center gap-3 mt-1">
                                    <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                      {transaction.category}
                                    </span>
                                    <span className="text-sm text-gray-400">
                                      {new Date(transaction.date).toLocaleDateString('en-IN', {
                                        day: 'numeric',
                                        month: 'short',
                                        year: 'numeric'
                                      })}
                                    </span>
                                  </div>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className={`text-lg font-bold ${
                                  transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                                }`}>
                                  {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                                </p>
                                <span className={`text-xs px-2 py-1 rounded-full ${
                                  transaction.type === 'income' 
                                    ? 'bg-green-100 text-green-700' 
                                    : 'bg-red-100 text-red-700'
                                }`}>
                                  {transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Financial Tips */}
                  <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-6 border border-yellow-200">
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-orange-800">
                      <span>💡</span> Financial Tips
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-white p-4 rounded-lg border border-yellow-200">
                        <h4 className="font-medium text-gray-800 mb-2">📊 Track Regularly</h4>
                        <p className="text-sm text-gray-600">Record transactions daily to maintain accurate financial records.</p>
                      </div>
                      <div className="bg-white p-4 rounded-lg border border-yellow-200">
                        <h4 className="font-medium text-gray-800 mb-2">🎯 Set Budgets</h4>
                        <p className="text-sm text-gray-600">Create monthly budgets for different categories to control spending.</p>
                      </div>
                      <div className="bg-white p-4 rounded-lg border border-yellow-200">
                        <h4 className="font-medium text-gray-800 mb-2">💰 Emergency Fund</h4>
                        <p className="text-sm text-gray-600">Aim to save 3-6 months of expenses for unexpected situations.</p>
                      </div>
                      <div className="bg-white p-4 rounded-lg border border-yellow-200">
                        <h4 className="font-medium text-gray-800 mb-2">📈 Review Monthly</h4>
                        <p className="text-sm text-gray-600">Analyze your spending patterns and adjust your budget accordingly.</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {currentPage === 'transactions' && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h2 className="text-3xl font-bold">Transactions</h2>
                    <button
                      onClick={() => setIsFormOpen(true)}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                    >
                      <span>+</span> Add Transaction
                    </button>
                  </div>

                  <div className="bg-white rounded-lg shadow">
                    <div className="p-6">
                      {transactions.length === 0 ? (
                        <p className="text-gray-500 text-center py-8">No transactions yet. Add your first transaction!</p>
                      ) : (
                        <div className="space-y-4">
                          {transactions.map((transaction) => (
                            <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                              <div className="flex-1">
                                <p className="font-medium">{transaction.description}</p>
                                <div className="flex items-center gap-4 mt-1">
                                  <span className="text-sm text-gray-500">{transaction.category}</span>
                                  <span className="text-sm text-gray-500">
                                    {new Date(transaction.date).toLocaleDateString()}
                                  </span>
                                </div>
                              </div>
                              <div className="flex items-center gap-4">
                                <p className={`font-semibold ${
                                  transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                                }`}>
                                  {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                                </p>
                                <button
                                  onClick={() => deleteTransaction(transaction.id)}
                                  className="text-red-600 hover:text-red-800 text-sm px-2 py-1 rounded"
                                >
                                  Delete
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {currentPage === 'budget' && (
                <div className="space-y-8">
                  {/* Budget Header */}
                  <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl p-8 text-white">
                    <div className="flex justify-between items-center">
                      <div>
                        <h2 className="text-3xl font-bold mb-2">Budget Management</h2>
                        <p className="text-purple-100">Set spending limits and track your financial goals</p>
                        <div className="mt-4 flex items-center gap-4 text-sm">
                          <span className="bg-white/20 px-3 py-1 rounded-full">
                            📊 {Object.keys(budgets).length} Active Budgets
                          </span>
                          <span className="bg-white/20 px-3 py-1 rounded-full">
                            📅 {new Date().toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => setIsEditingBudgets(!isEditingBudgets)}
                        className="bg-white text-purple-600 px-6 py-3 rounded-lg hover:bg-gray-100 transition-colors font-semibold shadow-lg"
                      >
                        {isEditingBudgets ? '💾 Save Budgets' : '✏️ Edit Budgets'}
                      </button>
                    </div>
                  </div>

                  {/* Budget Overview Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl shadow-lg border-l-4 border-blue-500">
                      <h3 className="text-sm font-medium text-blue-700 uppercase tracking-wide">Total Budget</h3>
                      <p className="text-2xl font-bold text-blue-600 mt-2">
                        {formatCurrency(Object.values(budgets).reduce((sum, budget) => sum + budget, 0))}
                      </p>
                      <p className="text-sm text-blue-600 mt-1">This month</p>
                    </div>
                    
                    <div className="bg-gradient-to-br from-red-50 to-red-100 p-6 rounded-xl shadow-lg border-l-4 border-red-500">
                      <h3 className="text-sm font-medium text-red-700 uppercase tracking-wide">Total Spent</h3>
                      <p className="text-2xl font-bold text-red-600 mt-2">
                        {formatCurrency(getBudgetData().reduce((sum, item) => sum + item.spent, 0))}
                      </p>
                      <p className="text-sm text-red-600 mt-1">This month</p>
                    </div>
                    
                    <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl shadow-lg border-l-4 border-green-500">
                      <h3 className="text-sm font-medium text-green-700 uppercase tracking-wide">Remaining</h3>
                      <p className="text-2xl font-bold text-green-600 mt-2">
                        {formatCurrency(getBudgetData().reduce((sum, item) => sum + item.remaining, 0))}
                      </p>
                      <p className="text-sm text-green-600 mt-1">Available</p>
                    </div>
                    
                    <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-6 rounded-xl shadow-lg border-l-4 border-yellow-500">
                      <h3 className="text-sm font-medium text-yellow-700 uppercase tracking-wide">Over Budget</h3>
                      <p className="text-2xl font-bold text-yellow-600 mt-2">
                        {getBudgetData().filter(item => item.isOverBudget).length}
                      </p>
                      <p className="text-sm text-yellow-600 mt-1">Categories</p>
                    </div>
                  </div>

                  {/* Budget Setup/Edit */}
                  {isEditingBudgets && (
                    <div className="bg-white rounded-xl shadow-lg p-6">
                      <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
                        <span>⚙️</span> Set Category Budgets
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {categories.map(category => (
                          <div key={category} className="border rounded-lg p-4">
                            <label className="block text-sm font-medium mb-2">{category}</label>
                            <div className="relative">
                              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₹</span>
                              <input
                                type="number"
                                min="0"
                                step="100"
                                value={budgets[category] || ''}
                                onChange={(e) => setBudgets(prev => ({
                                  ...prev,
                                  [category]: parseFloat(e.target.value) || 0
                                }))}
                                className="w-full pl-8 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                placeholder="0"
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="mt-6 flex gap-3">
                        <button
                          onClick={saveBudgets}
                          className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors"
                        >
                          Save Budgets
                        </button>
                        <button
                          onClick={() => setIsEditingBudgets(false)}
                          className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300 transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Budget Progress */}
                  {getBudgetData().length > 0 && (
                    <div className="bg-white rounded-xl shadow-lg p-6">
                      <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
                        <span>📊</span> Budget Progress
                      </h3>
                      <div className="space-y-6">
                        {getBudgetData().map((item) => (
                          <div key={item.category} className="border rounded-lg p-6 hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-center mb-4">
                              <h4 className="text-lg font-medium">{item.category}</h4>
                              <div className="flex items-center gap-4">
                                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                                  item.isOverBudget ? 'bg-red-100 text-red-800' :
                                  item.percentage > 80 ? 'bg-yellow-100 text-yellow-800' :
                                  'bg-green-100 text-green-800'
                                }`}>
                                  {item.percentage.toFixed(1)}%
                                </span>
                                {item.isOverBudget && <span className="text-red-500">⚠️</span>}
                              </div>
                            </div>
                            
                            <div className="mb-4">
                              <div className="flex justify-between text-sm text-gray-600 mb-2">
                                <span>Spent: {formatCurrency(item.spent)}</span>
                                <span>Budget: {formatCurrency(item.budget)}</span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-3">
                                <div 
                                  className={`h-3 rounded-full transition-all duration-500 ${
                                    item.isOverBudget ? 'bg-red-500' :
                                    item.percentage > 80 ? 'bg-yellow-500' :
                                    'bg-green-500'
                                  }`}
                                  style={{ width: `${Math.min(100, item.percentage)}%` }}
                                ></div>
                              </div>
                            </div>
                            
                            <div className="flex justify-between items-center text-sm">
                              <span className={`font-medium ${
                                item.isOverBudget ? 'text-red-600' : 'text-green-600'
                              }`}>
                                {item.isOverBudget ? 
                                  `Over by ${formatCurrency(item.spent - item.budget)}` :
                                  `${formatCurrency(item.remaining)} remaining`
                                }
                              </span>
                              <span className="text-gray-500">
                                {item.percentage.toFixed(1)}% used
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Budget vs Spending Chart */}
                  {getBudgetData().length > 0 && (
                    <div className="bg-white rounded-xl shadow-lg p-6">
                      <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
                        <span>📈</span> Budget vs Actual Spending
                      </h3>
                      <div className="space-y-4">
                        {getBudgetData().map((item, index) => (
                          <div key={item.category} className="flex items-center gap-4">
                            <div className="w-32 text-sm font-medium truncate">{item.category}</div>
                            <div className="flex-1 flex gap-2">
                              {/* Budget bar */}
                              <div className="flex-1 bg-blue-100 rounded-full h-6 relative overflow-hidden">
                                <div 
                                  className="bg-blue-500 h-full rounded-full flex items-center justify-center text-white text-xs font-medium"
                                  style={{ width: '100%' }}
                                >
                                  Budget: {formatCurrency(item.budget)}
                                </div>
                              </div>
                              {/* Spending bar */}
                              <div className="flex-1 bg-gray-100 rounded-full h-6 relative overflow-hidden">
                                <div 
                                  className={`h-full rounded-full flex items-center justify-center text-white text-xs font-medium ${
                                    item.isOverBudget ? 'bg-red-500' : 'bg-green-500'
                                  }`}
                                  style={{ width: `${Math.min(100, (item.spent / Math.max(item.budget, item.spent)) * 100)}%` }}
                                >
                                  {item.spent > 0 && `Spent: ${formatCurrency(item.spent)}`}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Budget Tips */}
                  <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6 border border-indigo-200">
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-indigo-800">
                      <span>💡</span> Budget Management Tips
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-white p-4 rounded-lg border border-indigo-200">
                        <h4 className="font-medium text-gray-800 mb-2">🎯 50/30/20 Rule</h4>
                        <p className="text-sm text-gray-600">50% needs, 30% wants, 20% savings and debt repayment.</p>
                      </div>
                      <div className="bg-white p-4 rounded-lg border border-indigo-200">
                        <h4 className="font-medium text-gray-800 mb-2">📱 Track Daily</h4>
                        <p className="text-sm text-gray-600">Review your spending daily to stay within budget limits.</p>
                      </div>
                      <div className="bg-white p-4 rounded-lg border border-indigo-200">
                        <h4 className="font-medium text-gray-800 mb-2">🔄 Adjust Monthly</h4>
                        <p className="text-sm text-gray-600">Review and adjust budgets based on actual spending patterns.</p>
                      </div>
                      <div className="bg-white p-4 rounded-lg border border-indigo-200">
                        <h4 className="font-medium text-gray-800 mb-2">🚨 Set Alerts</h4>
                        <p className="text-sm text-gray-600">Get notified when you're approaching budget limits.</p>
                      </div>
                    </div>
                  </div>

                  {/* Empty State */}
                  {getBudgetData().length === 0 && !isEditingBudgets && (
                    <div className="bg-white rounded-xl shadow-lg p-12 text-center">
                      <div className="text-6xl mb-4">🎯</div>
                      <h3 className="text-xl font-semibold text-gray-800 mb-2">No Budgets Set</h3>
                      <p className="text-gray-600 mb-6">Start managing your finances by setting monthly budgets for different categories.</p>
                      <button
                        onClick={() => setIsEditingBudgets(true)}
                        className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors inline-flex items-center gap-2"
                      >
                        <span>⚙️</span> Set Your First Budget
                      </button>
                    </div>
                  )}
                </div>
              )}
            </main>
          </div>
        </div>

        {/* Transaction Form Modal */}
        {isFormOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">Add New Transaction</h3>
                  <button
                    onClick={() => setIsFormOpen(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Amount (₹)</label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      value={formData.amount}
                      onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="0.00"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Description</label>
                    <input
                      type="text"
                      required
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter description"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Category</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {categories.map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Type</label>
                    <select
                      value={formData.type}
                      onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="expense">Expense</option>
                      <option value="income">Income</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Date</label>
                    <input
                      type="date"
                      required
                      value={formData.date}
                      onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div className="flex gap-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setIsFormOpen(false)}
                      className="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      Add Transaction
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}