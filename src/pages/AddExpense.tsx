import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useEventStore } from '../stores/eventStore';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import ExpenseForm from '../components/expenses/ExpenseForm';
import LoadingScreen from '../components/common/LoadingScreen';

const AddExpense: React.FC = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const navigate = useNavigate();
  const { 
    currentEvent,
    budgetCategories,
    fetchEvent, 
    fetchBudgetCategories,
    isLoading 
  } = useEventStore();
  
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  
  useEffect(() => {
    const loadEventData = async () => {
      if (!eventId) return;
      
      await fetchEvent(eventId);
      await fetchBudgetCategories(eventId);
      
      setIsInitialLoad(false);
    };
    
    loadEventData();
  }, [eventId, fetchEvent, fetchBudgetCategories]);
  
  if (isInitialLoad && isLoading) {
    return <LoadingScreen />;
  }
  
  if (!currentEvent) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header />
        <div className="page-container text-center py-10 flex-1">
          <h2 className="text-xl font-semibold text-gray-700">Event not found</h2>
          <button 
            onClick={() => navigate('/dashboard')} 
            className="mt-4 btn-primary"
          >
            Back to Dashboard
          </button>
        </div>
        <Footer />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header title={`Add Expense - ${currentEvent.title}`} />
      
      <main className="page-container max-w-3xl mx-auto flex-1">
        <ExpenseForm 
          eventId={eventId || ''}
          categories={budgetCategories}
        />
      </main>

      <Footer />
    </div>
  );
};

export default AddExpense;