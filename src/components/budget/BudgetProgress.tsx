import React, { useMemo } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { BudgetCategory, Expense } from '../../stores/eventStore';

ChartJS.register(ArcElement, Tooltip, Legend);

interface BudgetProgressProps {
  categories: BudgetCategory[];
  expenses: Expense[];
}

const BudgetProgress: React.FC<BudgetProgressProps> = ({ categories, expenses }) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(amount);
  };
  
  // Calculate total spent and total budget
  const totalBudget = useMemo(() => 
    categories.reduce((sum, category) => sum + category.amount, 0), 
    [categories]
  );
  
  const totalSpent = useMemo(() => 
    expenses.reduce((sum, expense) => sum + expense.amount, 0), 
    [expenses]
  );
  
  const remainingBudget = totalBudget - totalSpent;
  const spentPercentage = totalBudget > 0 ? Math.round((totalSpent / totalBudget) * 100) : 0;
  
  // Prepare data for doughnut chart
  const chartData = {
    labels: ['Spent', 'Remaining'],
    datasets: [
      {
        data: [totalSpent, Math.max(0, remainingBudget)],
        backgroundColor: [
          '#10b981', // emerald-500
          '#e2e8f0', // gray-200
        ],
        borderColor: [
          '#ffffff',
          '#ffffff',
        ],
        borderWidth: 2,
      },
    ],
  };
  
  const chartOptions = {
    cutout: '70%',
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          boxWidth: 15,
          padding: 15,
          font: {
            size: 12,
          },
        },
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            const label = context.label || '';
            const value = context.raw || 0;
            return `${label}: ${formatCurrency(value)}`;
          }
        }
      }
    },
  };
  
  return (
    <div className="card">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Budget Progress</h3>
      
      <div className="flex flex-col md:flex-row items-center gap-6">
        <div className="w-48 h-48 relative mx-auto">
          <Doughnut data={chartData} options={chartOptions} />
          <div className="absolute inset-0 flex items-center justify-center flex-col">
            <span className="text-3xl font-bold text-gray-900">{spentPercentage}%</span>
            <span className="text-sm text-gray-500">Used</span>
          </div>
        </div>
        
        <div className="flex-1 space-y-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex justify-between mb-1">
              <span className="text-sm text-gray-600">Total Budget:</span>
              <span className="font-semibold text-gray-900">{formatCurrency(totalBudget)}</span>
            </div>
            <div className="flex justify-between mb-1">
              <span className="text-sm text-gray-600">Amount Spent:</span>
              <span className="font-semibold text-emerald-600">{formatCurrency(totalSpent)}</span>
            </div>
            <div className="flex justify-between pt-2 border-t border-gray-200">
              <span className="text-sm text-gray-600">Remaining:</span>
              <span className={`font-semibold ${
                remainingBudget < 0 ? 'text-red-600' : 'text-indigo-600'
              }`}>
                {formatCurrency(Math.max(0, remainingBudget))}
              </span>
            </div>
            {remainingBudget < 0 && (
              <div className="mt-2 text-xs text-red-600">
                You are over budget by {formatCurrency(Math.abs(remainingBudget))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BudgetProgress;