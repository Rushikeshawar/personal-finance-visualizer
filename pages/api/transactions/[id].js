import connectDB from '../../../lib/mongodb';
import Transaction from '../../../models/Transaction';
import { validateTransaction } from '../../../lib/utils';
import mongoose from 'mongoose';

export default async function handler(req, res) {
  const {
    query: { id },
    method,
  } = req;

  await connectDB();

  // Validate ObjectId
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid transaction ID'
    });
  }

  switch (method) {
    case 'GET':
      try {
        const transaction = await Transaction.findById(id);
        
        if (!transaction) {
          return res.status(404).json({
            success: false,
            message: 'Transaction not found'
          });
        }

        res.status(200).json({
          success: true,
          data: transaction
        });
      } catch (error) {
        res.status(500).json({
          success: false,
          message: 'Failed to fetch transaction',
          error: error.message
        });
      }
      break;

    case 'PUT':
      try {
        const { isValid, errors } = validateTransaction(req.body);
        
        if (!isValid) {
          return res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors
          });
        }

        const transaction = await Transaction.findByIdAndUpdate(
          id,
          {
            amount: parseFloat(req.body.amount),
            description: req.body.description.trim(),
            category: req.body.category,
            type: req.body.type,
            date: new Date(req.body.date)
          },
          { new: true, runValidators: true }
        );

        if (!transaction) {
          return res.status(404).json({
            success: false,
            message: 'Transaction not found'
          });
        }

        res.status(200).json({
          success: true,
          data: transaction,
          message: 'Transaction updated successfully'
        });
      } catch (error) {
        if (error.name === 'ValidationError') {
          const errors = {};
          Object.keys(error.errors).forEach(key => {
            errors[key] = error.errors[key].message;
          });
          
          return res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors
          });
        }

        res.status(500).json({
          success: false,
          message: 'Failed to update transaction',
          error: error.message
        });
      }
      break;

    case 'DELETE':
      try {
        const transaction = await Transaction.findByIdAndDelete(id);
        
        if (!transaction) {
          return res.status(404).json({
            success: false,
            message: 'Transaction not found'
          });
        }

        res.status(200).json({
          success: true,
          data: transaction,
          message: 'Transaction deleted successfully'
        });
      } catch (error) {
        res.status(500).json({
          success: false,
          message: 'Failed to delete transaction',
          error: error.message
        });
      }
      break;

    default:
      res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
      res.status(405).json({
        success: false,
        message: `Method ${method} not allowed`
      });
      break;
  }
}