import connectDB from '../../../lib/mongodb';
import Transaction from '../../../models/Transaction';
import { validateTransaction } from '../../../lib/utils';

export default async function handler(req, res) {
  const { method } = req;

  await connectDB();

  switch (method) {
    case 'GET':
      try {
        const { category, type, month, limit = 100 } = req.query;
        let query = {};
        
        if (category) query.category = category;
        if (type) query.type = type;
        if (month) {
          const startDate = new Date(`${month}-01`);
          const endDate = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0);
          query.date = { $gte: startDate, $lte: endDate };
        }

        const transactions = await Transaction.find(query)
          .sort({ date: -1 })
          .limit(parseInt(limit));

        res.status(200).json({
          success: true,
          data: transactions,
          count: transactions.length
        });
      } catch (error) {
        res.status(500).json({
          success: false,
          message: 'Failed to fetch transactions',
          error: error.message
        });
      }
      break;

    case 'POST':
      try {
        const { isValid, errors } = validateTransaction(req.body);
        
        if (!isValid) {
          return res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors
          });
        }

        const transaction = await Transaction.create({
          amount: parseFloat(req.body.amount),
          description: req.body.description.trim(),
          category: req.body.category,
          type: req.body.type,
          date: new Date(req.body.date)
        });

        res.status(201).json({
          success: true,
          data: transaction,
          message: 'Transaction created successfully'
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
          message: 'Failed to create transaction',
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