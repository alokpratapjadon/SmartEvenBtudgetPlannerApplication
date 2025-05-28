import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useEventStore } from '../stores/eventStore';
import Header from '../components/common/Header';
import LoadingScreen from '../components/common/LoadingScreen';
import BudgetCategoryList from '../components/budget/BudgetCategoryList';
import BudgetProgress from '../components/budget/BudgetProgress';
import ExpenseList from '../components/expenses/ExpenseList';
import { Calendar, MapPin, Users, DollarSign, CreditCard } from 'lucide-react';

const EventDetail: React.FC = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const navigate = useNavigate();
  const { 
    currentEvent,
    budgetCategories,
    expenses, 
    fetchEvent, 
    fetchBudgetCategories, 
    fetchExpenses,
    isLoading 
  } = useEventStore();
  
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  
  useEffect(() => {
    const loadEventData = async () => {
      if (!eventId) return;
      
      await fetchEvent(eventId);
      await fetchBudgetCategories(eventId);
      await fetchExpenses(eventId);
      
      setIsInitialLoad(false);
    };
    
    loadEventData();
  }, [eventId, fetchEvent, fetchBudgetCategories, fetchExpenses]);
  
  if (isInitialLoad && isLoading) {
    return <LoadingScreen />;
  }
  
  if (!currentEvent) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="page-container text-center py-10">
          <h2 className="text-xl font-semibold text-gray-700">Event not found</h2>
          <button 
            onClick={() => navigate('/dashboard')} 
            className="mt-4 btn-primary"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
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
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Header title={currentEvent.title} />
      
      <main className="page-container">
        <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 mb-8 animate-fadeIn">
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="flex-1">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">
                {currentEvent.title}
              </h1>
              <p className="text-gray-600 capitalize mb-4">
                {currentEvent.type}
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                <div className="flex items-center text-sm text-gray-700">
                  <Calendar size={16} className="mr-2 text-emerald-500 flex-shrink-0" />
                  <span className="truncate">{formatDate(currentEvent.date)}</span>
                </div>
                
                <div className="flex items-center text-sm text-gray-700">
                  <MapPin size={16} className="mr-2 text-emerald-500 flex-shrink-0" />
                  <span className="truncate">{currentEvent.location}</span>
                </div>
                
                <div className="flex items-center text-sm text-gray-700">
                  <Users size={16} className="mr-2 text-emerald-500 flex-shrink-0" />
                  <span>{currentEvent.guestCount} guests</span>
                </div>
                
                <div className="flex items-center text-sm text-gray-700">
                  <DollarSign size={16} className="mr-2 text-emerald-500 flex-shrink-0" />
                  <span>{formatCurrency(currentEvent.budget)} budget</span>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row lg:flex-col gap-3">
              <button
                onClick={() => navigate(`/events/${eventId}/expenses/new`)}
                className="btn-primary w-full sm:w-auto"
              >
                Add Expense
              </button>
              
              <button 
                onClick={() => navigate(`/events/${eventId}/payments`)}
                className="btn-secondary w-full sm:w-auto flex items-center justify-center"
              >
                <CreditCard size={16} className="mr-2" />
                Payments
              </button>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 mb-8">
          <BudgetProgress 
            categories={budgetCategories}
            expenses={expenses}
          />
          
          <BudgetCategoryList 
            categories={budgetCategories}
            eventId={eventId || ''}
          />
        </div>
        
        <ExpenseList
          expenses={expenses}
          categories={budgetCategories}
          eventId={eventId || ''}
        />
      </main>
    </div>
  );
};

export default EventDetail;