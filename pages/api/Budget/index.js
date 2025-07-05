import connectDB from '../../../lib/mongodb';
import Budget from '../../../models/Budget';
import { getCurrentMonth } from '../../../lib/utils';

export default async function handler(req, res) {
  const { method } = req;

  await connectDB();

  switch (method) {
    case 'GET':
      try {
        const { month = getCurrentMonth() } = req.query;
        
        const budgets = await Budget.find({ month }).sort({ category: 1 });

        res.status(200).json({
          success: true,
          data: budgets,
          count: budgets.length
        });
      } catch (error) {
        res.status(500).json({
          success: false,
          message: 'Failed to fetch budgets',
          error: error.message
        });
      }
      break;

    case 'POST':
      try {
        const { budgets, month = getCurrentMonth() } = req.body;
        
        if (!Array.isArray(budgets)) {
          return res.status(400).json({
            success: false,
            message: 'Budgets must be an array'
          });
        }

        // Validate each budget
        for (const budget of budgets) {
          if (!budget.category || typeof budget.monthlyLimit !== 'number') {
            return res.status(400).json({
              success: false,
              message: 'Each budget must have category and monthlyLimit'
            });
          }
        }

        // Delete existing budgets for the month
        await Budget.deleteMany({ month });

        // Create new budgets
        const createdBudgets = await Budget.insertMany(
          budgets.map(budget => ({
            category: budget.category,
            monthlyLimit: budget.monthlyLimit,
            month
          }))
        );

        res.status(201).json({
          success: true,
          data: createdBudgets,
          message: 'Budgets updated successfully'
        });
      } catch (error) {
        if (error.name === 'ValidationError') {
          return res.status(400).json({
            success: false,
            message: 'Validation failed',
            error: error.message
          });
        }

        res.status(500).json({
          success: false,
          message: 'Failed to update budgets',
          error: error.message
        });
      }
      break;

    default:
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).json({
        success: false,
        message: `Method ${method} not allowed`
      });
      break;
  }
}