import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, startOfMonth, endOfMonth, subMonths } from 'date-fns';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const categories = [
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

export const categoryColors = {
  'Food & Dining': '#FF6B6B',
  'Transportation': '#4ECDC4',
  'Shopping': '#45B7D1',
  'Entertainment': '#96CEB4',
  'Bills & Utilities': '#FFEAA7',
  'Healthcare': '#DDA0DD',
  'Education': '#98D8C8',
  'Travel': '#F7DC6F',
  'Groceries': '#BB8FCE',
  'Other': '#85C1E9'
};

export function formatCurrency(amount) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatDate(date) {
  return format(new Date(date), 'MMM dd, yyyy');
}

export function getCurrentMonth() {
  return format(new Date(), 'yyyy-MM');
}

export function getMonthName(monthString) {
  return format(new Date(monthString + '-01'), 'MMMM yyyy');
}

export function getDateRange(months = 6) {
  const end = endOfMonth(new Date());
  const start = startOfMonth(subMonths(new Date(), months - 1));
  return { start, end };
}

export function groupTransactionsByMonth(transactions) {
  const grouped = {};
  
  transactions.forEach(transaction => {
    const month = format(new Date(transaction.date), 'yyyy-MM');
    if (!grouped[month]) {
      grouped[month] = [];
    }
    grouped[month].push(transaction);
  });
  
  return grouped;
}

export function calculateMonthlyExpenses(transactions) {
  const grouped = groupTransactionsByMonth(transactions.filter(t => t.type === 'expense'));
  const monthly = [];
  
  Object.keys(grouped).sort().forEach(month => {
    const total = grouped[month].reduce((sum, transaction) => sum + transaction.amount, 0);
    monthly.push({
      month: getMonthName(month),
      amount: total,
      monthKey: month
    });
  });
  
  return monthly;
}

export function calculateCategoryExpenses(transactions) {
  const expenses = transactions.filter(t => t.type === 'expense');
  const categoryTotals = {};
  
  expenses.forEach(transaction => {
    if (!categoryTotals[transaction.category]) {
      categoryTotals[transaction.category] = 0;
    }
    categoryTotals[transaction.category] += transaction.amount;
  });
  
  return Object.entries(categoryTotals).map(([category, amount]) => ({
    category,
    amount,
    color: categoryColors[category] || '#85C1E9'
  }));
}

export function validateTransaction(data) {
  const errors = {};
  
  if (!data.amount || data.amount <= 0) {
    errors.amount = 'Amount must be greater than 0';
  }
  
  if (!data.description || data.description.trim().length === 0) {
    errors.description = 'Description is required';
  }
  
  if (!data.category) {
    errors.category = 'Category is required';
  }
  
  if (!data.date) {
    errors.date = 'Date is required';
  }
  
  if (!data.type || !['income', 'expense'].includes(data.type)) {
    errors.type = 'Type must be either income or expense';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}

export function calculateBudgetUtilization(transactions, budgets, month) {
  const monthlyExpenses = transactions
    .filter(t => t.type === 'expense' && format(new Date(t.date), 'yyyy-MM') === month)
    .reduce((acc, transaction) => {
      if (!acc[transaction.category]) {
        acc[transaction.category] = 0;
      }
      acc[transaction.category] += transaction.amount;
      return acc;
    }, {});

  return budgets.map(budget => {
    const spent = monthlyExpenses[budget.category] || 0;
    const percentage = budget.monthlyLimit > 0 ? (spent / budget.monthlyLimit) * 100 : 0;
    
    return {
      ...budget,
      spent,
      remaining: Math.max(0, budget.monthlyLimit - spent),
      percentage: Math.min(100, percentage),
      isOverBudget: spent > budget.monthlyLimit
    };
  });
}