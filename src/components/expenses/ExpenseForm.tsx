import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BudgetCategory, useEventStore } from '../../stores/eventStore';
import ErrorMessage from '../common/ErrorMessage';

interface ExpenseFormProps {
  eventId: string;
  categories: BudgetCategory[];
}

const ExpenseForm: React.FC<ExpenseFormProps> = ({ eventId, categories }) => {
  const navigate = useNavigate();
  const { createExpense, error } = useEventStore();
  
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [categoryId, setCategoryId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!description || !amount || !date || !categoryId) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await createExpense({
        description,
        amount: parseFloat(amount),
        date,
        categoryId,
        eventId,
      });
      
      navigate(`/events/${eventId}`);
    } catch (error) {
      console.error('Failed to create expense:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="card">
      <h2 className="text-xl font-bold text-gray-900 mb-6">Add New Expense</h2>
      
      {error && <ErrorMessage message={error} />}
      
      <div className="space-y-4">
        <div>
          <label htmlFor="description" className="form-label">Description</label>
          <input
            id="description"
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="form-input"
            placeholder="What was this expense for?"
            required
          />
        </div>
        
        <div>
          <label htmlFor="amount" className="form-label">Amount ($)</label>
          <input
            id="amount"
            type="number"
            min="0"
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="form-input"
            placeholder="0.00"
            required
          />
        </div>
        
        <div>
          <label htmlFor="date" className="form-label">Date</label>
          <input
            id="date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="form-input"
            required
          />
        </div>
        
        <div>
          <label htmlFor="category" className="form-label">Category</label>
          <select
            id="category"
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="form-input"
            required
          >
            <option value="">Select a category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
        
        <div className="pt-4 flex gap-3">
          <button
            type="button"
            onClick={() => navigate(`/events/${eventId}`)}
            className="btn-outline"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn-primary flex-1"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Saving...' : 'Save Expense'}
          </button>
        </div>
      </div>
    </form>
  );
};

export default ExpenseForm;