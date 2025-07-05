import React from 'react';
import { Card, CardContent } from './ui/card';
import { Wallet, BarChart3, Target, Github, ExternalLink } from 'lucide-react';

const Layout = ({ children, currentPage, onPageChange }) => {
  const navigation = [
    { name: 'Dashboard', icon: BarChart3, page: 'dashboard' },
    { name: 'Transactions', icon: Wallet, page: 'transactions' },
    { name: 'Budget', icon: Target, page: 'budget' }
  ];

  if (!children) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Wallet className="h-8 w-8 text-blue-600" />
              <h1 className="ml-2 text-xl font-bold text-gray-900">
                Personal Finance Tracker
              </h1>
            </div>
            
            <div className="flex items-center gap-4">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                <Github className="h-5 w-5" />
              </a>
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                <ExternalLink className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Navigation */}
          <aside className="lg:w-64">
            <Card>
              <CardContent className="p-4">
                <nav className="space-y-2">
                  {navigation.map((item) => {
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.name}
                        onClick={() => onPageChange(item.page)}
                        className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                          currentPage === item.page
                            ? 'bg-blue-100 text-blue-700 border border-blue-200'
                            : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                        }`}
                      >
                        <Icon className="mr-3 h-5 w-5" />
                        {item.name}
                      </button>
                    );
                  })}
                </nav>
                
                {/* Stage Badge */}
                <div className="mt-6 pt-4 border-t">
                  <div className="text-xs text-muted-foreground mb-2">Features</div>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span>Stage 1: Basic Tracking</span>
                      <span className="text-green-600">✓</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span>Stage 2: Categories</span>
                      <span className="text-green-600">✓</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span>Stage 3: Budgeting</span>
                      <span className="text-green-600">✓</span>
                    </div>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="mt-6 pt-4 border-t">
                  <div className="text-xs text-muted-foreground mb-2">Quick Info</div>
                  <div className="text-xs text-gray-600">
                    Built with Next.js, React, MongoDB, and Recharts
                  </div>
                </div>
              </CardContent>
            </Card>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            {children}
          </main>
        </div>
      </div>

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
  );
};

export default Layout;