import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { formatCurrency } from '../../lib/utils';

const BudgetComparisonChart = ({ budgetData = [] }) => {
  const safeBudgetData = Array.isArray(budgetData) ? budgetData : [];
  const chartData = safeBudgetData.map(budget => ({
    category: budget.category.replace(' & ', '\n& '),
    budget: budget.monthlyLimit,
    spent: budget.spent,
    remaining: budget.remaining
  }));

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const budget = payload.find(p => p.dataKey === 'budget')?.value || 0;
      const spent = payload.find(p => p.dataKey === 'spent')?.value || 0;
      const percentage = budget > 0 ? ((spent / budget) * 100).toFixed(1) : 0;
      
      return (
        <div className="bg-background border rounded-lg shadow-lg p-3">
          <p className="font-medium">{label.replace('\n', ' ')}</p>
          <p className="text-blue-600">Budget: {formatCurrency(budget)}</p>
          <p className="text-red-600">Spent: {formatCurrency(spent)}</p>
          <p className="text-muted-foreground">Usage: {percentage}%</p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Budget vs Actual Spending</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="chart-container">
          {chartData.length === 0 ? (
            <div className="flex items-center justify-center h-64">
              <p className="text-muted-foreground">No budget data available</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="category" 
                  stroke="#888888"
                  fontSize={10}
                  tickLine={false}
                  axisLine={false}
                  interval={0}
                  angle={-45}
                  textAnchor="end"
                  height={60}
                />
                <YAxis 
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}k`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar 
                  dataKey="budget" 
                  fill="#3b82f6" 
                  radius={[4, 4, 0, 0]}
                  name="Budget"
                />
                <Bar 
                  dataKey="spent" 
                  fill="#ef4444" 
                  radius={[4, 4, 0, 0]}
                  name="Spent"
                />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
        
        {chartData.length > 0 && (
          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-sm text-muted-foreground">Total Budget</p>
              <p className="font-semibold text-blue-600">
                {formatCurrency(safeBudgetData.reduce((sum, b) => sum + (b.monthlyLimit || 0), 0))}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Spent</p>
              <p className="font-semibold text-red-600">
                {formatCurrency(safeBudgetData.reduce((sum, b) => sum + (b.spent || 0), 0))}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Remaining</p>
              <p className="font-semibold text-green-600">
                {formatCurrency(safeBudgetData.reduce((sum, b) => sum + (b.remaining || 0), 0))}
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default BudgetComparisonChart;