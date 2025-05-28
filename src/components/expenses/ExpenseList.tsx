import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Expense, BudgetCategory } from '../../stores/eventStore';
import { Calendar, DollarSign, Download, PlusCircle } from 'lucide-react';
import { generateReceipt } from '../../utils/receiptGenerator';

interface ExpenseListProps {
  expenses: Expense[];
  categories: BudgetCategory[];
  eventId: string;
}

const ExpenseList: React.FC<ExpenseListProps> = ({ expenses, categories, eventId }) => {
  const navigate = useNavigate();
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(date);
  };
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(amount);
  };
  
  const getCategoryName = (categoryId: string) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.name : 'Uncategorized';
  };
  
  const handleDownloadReceipt = (expense: Expense) => {
    const categoryName = getCategoryName(expense.categoryId);
    generateReceipt(expense, categoryName);
  };
  
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="px-6 py-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">Expenses</h3>
        <button 
          onClick={() => navigate(`/events/${eventId}/expenses/new`)}
          className="btn-primary text-sm py-1.5 px-3 flex items-center"
        >
          <PlusCircle size={16} className="mr-1" />
          Add Expense
        </button>
      </div>
      
      {expenses.length === 0 ? (
        <div className="py-8 text-center">
          <p className="text-gray-500 mb-4">No expenses recorded yet</p>
          <button 
            onClick={() => navigate(`/events/${eventId}/expenses/new`)}
            className="btn-outline text-sm"
          >
            Record Your First Expense
          </button>
        </div>
      ) : (
        <div className="divide-y divide-gray-100">
          {expenses.map((expense) => (
            <div key={expense.id} className="px-6 py-4">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-medium text-gray-900">{expense.description}</h4>
                  <p className="text-sm text-gray-500">{getCategoryName(expense.categoryId)}</p>
                </div>
                <p className="font-semibold text-gray-900">{formatCurrency(expense.amount)}</p>
              </div>
              
              <div className="mt-2 flex justify-between items-center">
                <div className="flex items-center text-sm text-gray-600">
                  <Calendar size={14} className="mr-1 text-gray-400" />
                  <span>{formatDate(expense.date)}</span>
                </div>
                
                <button 
                  onClick={() => handleDownloadReceipt(expense)}
                  className="text-sm text-indigo-600 hover:text-indigo-800 transition-colors flex items-center"
                >
                  <Download size={14} className="mr-1" />
                  Receipt
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ExpenseList;