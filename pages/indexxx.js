import React, { useState, useEffect } from 'react';
import Head from 'next/head';

export default function Home() {
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate data loading
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, []);

  if (isLoading) {
    return (
      <>
        <Head>
          <title>Personal Finance Tracker</title>
          <meta name="description" content="Track your personal finances with ease" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
        </Head>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading Personal Finance Tracker...</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Personal Finance Tracker</title>
        <meta name="description" content="Track your personal finances with ease" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
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

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold mb-4">Welcome to Your Finance Dashboard</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {/* Summary Cards */}
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold text-blue-800">Total Income</h3>
                <p className="text-2xl font-bold text-blue-600">₹0.00</p>
              </div>
              <div className="bg-red-50 p-4 rounded-lg">
                <h3 className="font-semibold text-red-800">Total Expenses</h3>
                <p className="text-2xl font-bold text-red-600">₹0.00</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="font-semibold text-green-800">Net Balance</h3>
                <p className="text-2xl font-bold text-green-600">₹0.00</p>
              </div>
            </div>

            {/* Features */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-4">Application Features</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="border rounded-lg p-4">
                  <h4 className="font-medium text-green-600 mb-2">✅ Stage 1: Basic Tracking</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Add/Edit/Delete transactions</li>
                    <li>• Transaction list with filters</li>
                    <li>• Monthly expenses chart</li>
                    <li>• Form validation</li>
                  </ul>
                </div>
                <div className="border rounded-lg p-4">
                  <h4 className="font-medium text-green-600 mb-2">✅ Stage 2: Categories</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Predefined categories</li>
                    <li>• Category-wise pie chart</li>
                    <li>• Dashboard with summaries</li>
                    <li>• Category breakdown</li>
                  </ul>
                </div>
                <div className="border rounded-lg p-4">
                  <h4 className="font-medium text-green-600 mb-2">✅ Stage 3: Budgeting</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Monthly budget limits</li>
                    <li>• Budget vs actual charts</li>
                    <li>• Spending insights</li>
                    <li>• Budget progress tracking</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Tech Stack */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold mb-4">Technology Stack</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div className="bg-gray-50 p-3 rounded text-center">
                  <strong>Frontend</strong><br/>
                  Next.js, React, Tailwind CSS
                </div>
                <div className="bg-gray-50 p-3 rounded text-center">
                  <strong>Backend</strong><br/>
                  Next.js API, MongoDB
                </div>
                <div className="bg-gray-50 p-3 rounded text-center">
                  <strong>UI Components</strong><br/>
                  shadcn/ui, Lucide Icons
                </div>
                <div className="bg-gray-50 p-3 rounded text-center">
                  <strong>Charts</strong><br/>
                  Recharts Library
                </div>
              </div>
            </div>

            {/* Setup Instructions */}
            <div className="border-t pt-6 mt-6">
              <h3 className="text-lg font-semibold mb-4">Setup Instructions</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-3">
                  To get the full application working, please ensure:
                </p>
                <ol className="list-decimal list-inside text-sm text-gray-600 space-y-2">
                  <li>MongoDB connection is configured in .env.local</li>
                  <li>All dependencies are installed: <code className="bg-white px-2 py-1 rounded">npm install</code></li>
                  <li>Replace this simple version with the full index.js</li>
                  <li>Ensure all component files are in place</li>
                </ol>
              </div>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="bg-white border-t mt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center text-sm text-gray-500">
              <p>Personal Finance Tracker - Full Stack Internship Assignment</p>
              <p className="mt-1">
                Built with ❤️ using Next.js, React, MongoDB, shadcn/ui, and Recharts
              </p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}