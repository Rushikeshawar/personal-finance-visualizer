import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Save, Edit, DollarSign } from 'lucide-react';
import { categories, formatCurrency, getCurrentMonth, getMonthName } from '../lib/utils';

const BudgetManager = ({ budgets, onSave, isLoading = false }) => {
  const [budgetValues, setBudgetValues] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [errors, setErrors] = useState({});
  const currentMonth = getCurrentMonth();

  useEffect(() => {
    const initialValues = {};
    categories.forEach(category => {
      const existingBudget = budgets.find(b => b.category === category);
      initialValues[category] = existingBudget ? existingBudget.monthlyLimit.toString() : '';
    });
    setBudgetValues(initialValues);
  }, [budgets]);

  const validateBudgets = () => {
    const newErrors = {};
    Object.entries(budgetValues).forEach(([category, value]) => {
      if (value && (isNaN(value) || parseFloat(value) < 0)) {
        newErrors[category] = 'Amount must be a positive number';
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateBudgets()) {
      return;
    }

    const budgetsToSave = Object.entries(budgetValues)
      .filter(([, value]) => value && parseFloat(value) > 0)
      .map(([category, value]) => ({
        category,
        monthlyLimit: parseFloat(value)
      }));

    await onSave(budgetsToSave);
    setIsEditing(false);
  };

  const handleValueChange = (category, value) => {
    setBudgetValues(prev => ({ ...prev, [category]: value }));
    if (errors[category]) {
      setErrors(prev => ({ ...prev, [category]: '' }));
    }
  };

  const totalBudget = Object.values(budgetValues)
    .filter(value => value && !isNaN(value))
    .reduce((sum, value) => sum + parseFloat(value), 0);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Budget Manager</CardTitle>
            <p className="text-sm text-muted-foreground">
              Set monthly budgets for {getMonthName(currentMonth)}
            </p>
          </div>
          <Button
            onClick={() => isEditing ? handleSave() : setIsEditing(true)}
            disabled={isLoading}
            className="flex items-center gap-2"
          >
            {isEditing ? <Save className="h-4 w-4" /> : <Edit className="h-4 w-4" />}
            {isLoading ? 'Saving...' : isEditing ? 'Save Budget' : 'Edit Budget'}
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Total Budget Summary */}
        <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
          <div className="flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-blue-600" />
            <span className="font-medium">Total Monthly Budget</span>
          </div>
          <span className="text-lg font-bold text-blue-600">
            {formatCurrency(totalBudget)}
          </span>
        </div>

        {/* Category Budgets */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((category) => {
            const currentBudget = budgets.find(b => b.category === category);
            const hasSpending = currentBudget && currentBudget.spent > 0;
            
            return (
              <div key={category} className="space-y-2 p-4 border rounded-lg">
                <div className="flex items-center justify-between">
                  <Label htmlFor={`budget-${category}`} className="font-medium">
                    {category}
                  </Label>
                  {hasSpending && (
                    <Badge variant={currentBudget.isOverBudget ? "destructive" : "default"}>
                      {currentBudget.percentage.toFixed(0)}% used
                    </Badge>
                  )}
                </div>
                
                <div className="space-y-2">
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                      ₹
                    </span>
                    <Input
                      id={`budget-${category}`}
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="0.00"
                      value={budgetValues[category] || ''}
                      onChange={(e) => handleValueChange(category, e.target.value)}
                      disabled={!isEditing}
                      className={`pl-8 ${errors[category] ? 'border-red-500' : ''}`}
                    />
                  </div>
                  
                  {errors[category] && (
                    <p className="text-sm text-red-500">{errors[category]}</p>
                  )}
                  
                  {hasSpending && (
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Spent: {formatCurrency(currentBudget.spent)}</span>
                        {currentBudget.isOverBudget ? (
                          <span className="text-red-600">
                            Over by {formatCurrency(currentBudget.spent - currentBudget.monthlyLimit)}
                          </span>
                        ) : (
                          <span>Remaining: {formatCurrency(currentBudget.remaining)}</span>
                        )}
                      </div>
                      
                      <div className="w-full bg-gray-200 rounded-full h-1.5">
                        <div 
                          className={`h-1.5 rounded-full transition-all duration-300 ${
                            currentBudget.isOverBudget ? 'bg-red-500' : 
                            currentBudget.percentage > 80 ? 'bg-yellow-500' : 'bg-green-500'
                          }`}
                          style={{ width: `${Math.min(100, currentBudget.percentage)}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Budget Tips */}
        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="font-medium text-blue-900 mb-2">Budget Tips</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Follow the 50/30/20 rule: 50% needs, 30% wants, 20% savings</li>
            <li>• Review and adjust your budgets monthly based on spending patterns</li>
            <li>• Set realistic budgets that you can actually stick to</li>
            <li>• Track your progress regularly to stay on target</li>
          </ul>
        </div>

        {/* Action Buttons for Edit Mode */}
        {isEditing && (
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button 
              variant="outline" 
              onClick={() => {
                setIsEditing(false);
                setErrors({});
                // Reset to original values
                const initialValues = {};
                categories.forEach(category => {
                  const existingBudget = budgets.find(b => b.category === category);
                  initialValues[category] = existingBudget ? existingBudget.monthlyLimit.toString() : '';
                });
                setBudgetValues(initialValues);
              }}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={isLoading}>
              {isLoading ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default BudgetManager;