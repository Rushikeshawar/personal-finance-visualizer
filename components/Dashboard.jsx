import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { TrendingUp, TrendingDown, DollarSign, CreditCard, Calendar, Target } from 'lucide-react';
import { formatCurrency, formatDate, getCurrentMonth, getMonthName } from '../lib/utils';

const Dashboard = ({ transactions = [], budgetData = [] }) => {
  // Ensure transactions is always an array
  const safeTransactions = Array.isArray(transactions) ? transactions : [];
  const safeBudgetData = Array.isArray(budgetData) ? budgetData : [];
  const currentMonth = getCurrentMonth();
  
  // Calculate summary statistics
  const totalIncome = safeTransactions
    .filter(t => t && t.type === 'income')
    .reduce((sum, t) => sum + (t.amount || 0), 0);
    
  const totalExpenses = safeTransactions
    .filter(t => t && t.type === 'expense')
    .reduce((sum, t) => sum + (t.amount || 0), 0);
    
  const currentMonthExpenses = safeTransactions
    .filter(t => 
      t && t.type === 'expense' && 
      new Date(t.date).toISOString().slice(0, 7) === currentMonth
    )
    .reduce((sum, t) => sum + (t.amount || 0), 0);
    
  const netBalance = totalIncome - totalExpenses;
  
  // Recent transactions (last 5)
  const recentTransactions = safeTransactions
    .filter(t => t && t.date)
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);
    
  // Category breakdown for current month
  const currentMonthByCategory = safeTransactions
    .filter(t => 
      t && t.type === 'expense' && 
      new Date(t.date).toISOString().slice(0, 7) === currentMonth
    )
    .reduce((acc, t) => {
      if (t.category) {
        acc[t.category] = (acc[t.category] || 0) + (t.amount || 0);
      }
      return acc;
    }, {});
    
  const topCategories = Object.entries(currentMonthByCategory)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 3);
    
  // Budget summary
  const totalBudget = safeBudgetData.reduce((sum, b) => sum + (b.monthlyLimit || 0), 0);
  const totalBudgetSpent = safeBudgetData.reduce((sum, b) => sum + (b.spent || 0), 0);
  const budgetUtilization = totalBudget > 0 ? (totalBudgetSpent / totalBudget) * 100 : 0;
  const overBudgetCategories = safeBudgetData.filter(b => b && b.isOverBudget).length;

  const StatCard = ({ title, value, icon: Icon, trend, color = "blue" }) => (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className={`text-2xl font-bold text-${color}-600`}>{value}</p>
            {trend && (
              <p className={`text-xs ${trend.type === 'positive' ? 'text-green-600' : 'text-red-600'} flex items-center mt-1`}>
                {trend.type === 'positive' ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
                {trend.text}
              </p>
            )}
          </div>
          <Icon className={`h-8 w-8 text-${color}-600`} />
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Income"
          value={formatCurrency(totalIncome)}
          icon={TrendingUp}
          color="green"
        />
        <StatCard
          title="Total Expenses"
          value={formatCurrency(totalExpenses)}
          icon={TrendingDown}
          color="red"
        />
        <StatCard
          title="Net Balance"
          value={formatCurrency(netBalance)}
          icon={DollarSign}
          color={netBalance >= 0 ? "green" : "red"}
        />
        <StatCard
          title="This Month"
          value={formatCurrency(currentMonthExpenses)}
          icon={Calendar}
          color="purple"
        />
      </div>

      {/* Budget Overview (Stage 3) */}
      {safeBudgetData.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <StatCard
            title="Budget Used"
            value={`${budgetUtilization.toFixed(1)}%`}
            icon={Target}
            color={budgetUtilization > 90 ? "red" : budgetUtilization > 70 ? "yellow" : "green"}
          />
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Budget Status</p>
                  <p className="text-2xl font-bold">{formatCurrency(totalBudget - totalBudgetSpent)}</p>
                  <p className="text-xs text-muted-foreground mt-1">Remaining this month</p>
                </div>
                <CreditCard className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Over Budget</p>
                  <p className={`text-2xl font-bold ${overBudgetCategories > 0 ? 'text-red-600' : 'text-green-600'}`}>
                    {overBudgetCategories}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">Categories</p>
                </div>
                <Target className={`h-8 w-8 ${overBudgetCategories > 0 ? 'text-red-600' : 'text-green-600'}`} />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Transactions */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            {recentTransactions.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">No transactions yet</p>
            ) : (
              <div className="space-y-3">
                {recentTransactions.map((transaction) => (
                  <div key={transaction._id} className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{transaction.description}</p>
                      <p className="text-sm text-muted-foreground">
                        {formatDate(transaction.date)} • {transaction.category}
                      </p>
                    </div>
                    <div className="text-right ml-4">
                      <p className={`font-semibold ${
                        transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Top Categories This Month */}
        <Card>
          <CardHeader>
            <CardTitle>Top Spending Categories</CardTitle>
            <p className="text-sm text-muted-foreground">
              {getMonthName(currentMonth)}
            </p>
          </CardHeader>
          <CardContent>
            {topCategories.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">No expenses this month</p>
            ) : (
              <div className="space-y-4">
                {topCategories.map(([category, amount], index) => {
                  const percentage = currentMonthExpenses > 0 ? (amount / currentMonthExpenses * 100).toFixed(1) : 0;
                  return (
                    <div key={category} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">{index + 1}</Badge>
                          <span className="font-medium">{category}</span>
                        </div>
                        <span className="font-semibold">{formatCurrency(amount)}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                      <p className="text-xs text-muted-foreground">{percentage}% of monthly expenses</p>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

        {/* Budget Progress (Stage 3) */}
      {safeBudgetData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Budget Progress</CardTitle>
            <p className="text-sm text-muted-foreground">
              {getMonthName(currentMonth)}
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {safeBudgetData.map((budget) => (
                <div key={budget.category} className="budget-progress space-y-2 p-4 border rounded-lg">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">{budget.category}</h4>
                    <Badge variant={budget.isOverBudget ? "destructive" : "default"}>
                      {budget.percentage.toFixed(0)}%
                    </Badge>
                  </div>
                  
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>Spent: {formatCurrency(budget.spent)}</span>
                      <span>Budget: {formatCurrency(budget.monthlyLimit)}</span>
                    </div>
                    
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-300 ${
                          budget.isOverBudget ? 'bg-red-500' : 
                          budget.percentage > 80 ? 'bg-yellow-500' : 'bg-green-500'
                        }`}
                        style={{ width: `${Math.min(100, budget.percentage)}%` }}
                      ></div>
                    </div>
                    
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>
                        {budget.isOverBudget ? 
                          `Over by ${formatCurrency(budget.spent - budget.monthlyLimit)}` :
                          `${formatCurrency(budget.remaining)} remaining`
                        }
                      </span>
                      <span>{budget.percentage.toFixed(1)}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Dashboard;