import React from 'react';
import { BudgetCategory, useEventStore } from '../../stores/eventStore';
import { Pencil } from 'lucide-react';

interface BudgetCategoryListProps {
  categories: BudgetCategory[];
  eventId: string;
  onEdit?: () => void;
}

const BudgetCategoryList: React.FC<BudgetCategoryListProps> = ({ 
  categories, 
  eventId,
  onEdit 
}) => {
  const { currentEvent } = useEventStore();
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(amount);
  };
  
  if (!categories.length) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No budget categories available</p>
      </div>
    );
  }
  
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="px-6 py-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">Budget Breakdown</h3>
        {onEdit && (
          <button 
            onClick={onEdit}
            className="text-gray-600 hover:text-emerald-600 transition-colors"
          >
            <Pencil size={16} />
          </button>
        )}
      </div>
      
      <div className="divide-y divide-gray-100">
        {categories.map((category) => (
          <div key={category.id} className="px-6 py-4 flex justify-between items-center">
            <div>
              <h4 className="font-medium text-gray-900">{category.name}</h4>
              <p className="text-sm text-gray-500">{category.percentage}% of total budget</p>
            </div>
            <div className="text-right">
              <p className="font-semibold text-gray-900">{formatCurrency(category.amount)}</p>
            </div>
          </div>
        ))}
      </div>
      
      <div className="px-6 py-4 bg-emerald-50 border-t border-emerald-100">
        <div className="flex justify-between items-center">
          <h4 className="font-medium text-gray-900">Total Budget</h4>
          <p className="font-semibold text-emerald-700">
            {formatCurrency(currentEvent?.budget || 0)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default BudgetCategoryList;