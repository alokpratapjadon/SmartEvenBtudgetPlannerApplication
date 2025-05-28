import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { useEventStore } from '../stores/eventStore';
import Header from '../components/common/Header';
import EventCard from '../components/events/EventCard';
import LoadingScreen from '../components/common/LoadingScreen';
import { PlusCircle } from 'lucide-react';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { events, fetchEvents, isLoading } = useEventStore();
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  
  useEffect(() => {
    const loadEvents = async () => {
      await fetchEvents();
      setIsInitialLoad(false);
    };
    
    loadEvents();
  }, [fetchEvents]);
  
  if (isInitialLoad && isLoading) {
    return <LoadingScreen />;
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="page-container">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Welcome, {user?.email?.split('@')[0] || 'User'}
            </h1>
            <p className="text-gray-600 mt-1">
              Manage your events and budgets efficiently
            </p>
          </div>
          
          <button
            onClick={() => navigate('/events/new')}
            className="btn-primary mt-4 md:mt-0 flex items-center"
          >
            <PlusCircle size={18} className="mr-2" />
            Create New Event
          </button>
        </div>
        
        {isLoading ? (
          <div className="text-center py-10">
            <svg
              className="w-10 h-10 mx-auto mb-3 text-emerald-500 animate-spin"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            <p className="text-gray-500">Loading your events...</p>
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl shadow-sm">
            <div className="mx-auto h-16 w-16 text-emerald-500 mb-4">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M19 4H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2Z" />
                <path d="M12 8v8" />
                <path d="M8 12h8" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No events yet
            </h3>
            <p className="text-gray-500 max-w-sm mx-auto mb-6">
              Start by creating your first event and let our smart budget planner help you manage your expenses.
            </p>
            <button
              onClick={() => navigate('/events/new')}
              className="btn-primary"
            >
              Create Your First Event
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;