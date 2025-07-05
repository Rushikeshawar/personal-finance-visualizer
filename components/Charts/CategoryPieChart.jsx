import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { calculateCategoryExpenses, formatCurrency } from '../../lib/utils';

const CategoryPieChart = ({ transactions = [] }) => {
  const safeTransactions = Array.isArray(transactions) ? transactions : [];
  const categoryData = calculateCategoryExpenses(safeTransactions);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-background border rounded-lg shadow-lg p-3">
          <p className="font-medium">{data.category}</p>
          <p className="text-red-600">
            {formatCurrency(data.amount)} ({((data.amount / categoryData.reduce((sum, cat) => sum + cat.amount, 0)) * 100).toFixed(1)}%)
          </p>
        </div>
      );
    }
    return null;
  };

  const CustomLegend = ({ payload }) => {
    return (
      <div className="grid grid-cols-2 gap-2 mt-4">
        {payload.map((entry, index) => (
          <div key={index} className="flex items-center text-sm">
            <div 
              className="w-3 h-3 rounded-full mr-2" 
              style={{ backgroundColor: entry.color }}
            ></div>
            <span className="truncate">{entry.value}</span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Expenses by Category</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="chart-container">
          {categoryData.length === 0 ? (
            <div className="flex items-center justify-center h-64">
              <p className="text-muted-foreground">No expense data available</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  innerRadius={40}
                  paddingAngle={2}
                  dataKey="amount"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend content={<CustomLegend />} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
        
        {categoryData.length > 0 && (
          <div className="mt-4 space-y-2">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                Total: {formatCurrency(categoryData.reduce((sum, cat) => sum + cat.amount, 0))}
              </p>
            </div>
            
            <div className="space-y-1">
              {categoryData.slice(0, 3).map((category, index) => (
                <div key={index} className="flex justify-between text-sm">
                  <span className="flex items-center">
                    <div 
                      className="w-2 h-2 rounded-full mr-2" 
                      style={{ backgroundColor: category.color }}
                    ></div>
                    {category.category}
                  </span>
                  <span className="font-medium">{formatCurrency(category.amount)}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CategoryPieChart;