import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { useEventStore } from '../stores/eventStore';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import EventCard from '../components/events/EventCard';
import LoadingScreen from '../components/common/LoadingScreen';
import SupabaseTest from '../components/common/SupabaseTest';
import DatabaseStatus from '../components/common/DatabaseStatus';
import { PlusCircle, Calendar, DollarSign, TrendingUp, Users, BarChart3, Sparkles } from 'lucide-react';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { events, fetchEvents, isLoading } = useEventStore();
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [showSupabaseTest, setShowSupabaseTest] = useState(false);
  const [showDatabaseStatus, setShowDatabaseStatus] = useState(false);
  
  useEffect(() => {
    const loadEvents = async () => {
      await fetchEvents();
      setIsInitialLoad(false);
    };
    
    loadEvents();
  }, [fetchEvents]);

  const getDisplayName = () => {
    if (user?.full_name) {
      return user.full_name;
    }
    return user?.email?.split('@')[0] || 'User';
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  // Calculate dashboard statistics
  const totalEvents = events.length;
  const totalBudget = events.reduce((sum, event) => sum + event.budget, 0);
  const upcomingEvents = events.filter(event => new Date(event.date) > new Date()).length;
  const totalGuests = events.reduce((sum, event) => sum + event.guestCount, 0);
  
  if (isInitialLoad && isLoading) {
    return <LoadingScreen />;
  }
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      
      <main className="page-container flex-1">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-600 rounded-2xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
            <div className="absolute inset-0 bg-black opacity-10"></div>
            <div className="relative z-10">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold mb-2 flex items-center">
                    Welcome back, {getDisplayName()}! 
                    <Sparkles className="ml-2 text-yellow-300" size={28} />
                  </h1>
                  <p className="text-indigo-100 text-lg">
                    Ready to create your next unforgettable event?
                  </p>
                </div>
                
                <div className="flex gap-2 mt-4 sm:mt-0">
                  <button
                    onClick={() => setShowDatabaseStatus(!showDatabaseStatus)}
                    className="bg-white/20 text-white hover:bg-white/30 font-medium py-2 px-4 rounded-lg transition-all duration-200 text-sm"
                  >
                    DB Status
                  </button>
                  <button
                    onClick={() => setShowSupabaseTest(!showSupabaseTest)}
                    className="bg-white/20 text-white hover:bg-white/30 font-medium py-2 px-4 rounded-lg transition-all duration-200 text-sm"
                  >
                    Test DB
                  </button>
                  <button
                    onClick={() => navigate('/events/new')}
                    className="bg-white text-indigo-600 hover:bg-indigo-50 font-medium py-3 px-6 rounded-lg transition-all duration-200 flex items-center shadow-lg hover:shadow-xl transform hover:scale-10"
                  >
                    <PlusCircle size={20} className="mr-2" />
                    Create New Event
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Database Status Component */}
        {showDatabaseStatus && (
          <div className="mb-8">
            <DatabaseStatus />
          </div>
        )}

        {/* Supabase Test Component */}
        {showSupabaseTest && <SupabaseTest />}

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 hover:scale-105">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Events</p>
                <p className="text-2xl font-bold text-gray-900">{totalEvents}</p>
              </div>
              <div className="bg-gradient-to-br from-emerald-400 to-emerald-600 p-3 rounded-lg">
                <Calendar className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 hover:scale-105">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Budget</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalBudget)}</p>
              </div>
              <div className="bg-gradient-to-br from-indigo-400 to-indigo-600 p-3 rounded-lg">
                <DollarSign className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 hover:scale-105">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Upcoming Events</p>
                <p className="text-2xl font-bold text-gray-900">{upcomingEvents}</p>
              </div>
              <div className="bg-gradient-to-br from-amber-400 to-amber-600 p-3 rounded-lg">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 hover:scale-105">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Guests</p>
                <p className="text-2xl font-bold text-gray-900">{totalGuests}</p>
              </div>
              <div className="bg-gradient-to-br from-purple-400 to-purple-600 p-3 rounded-lg">
                <Users className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <BarChart3 className="mr-2 text-indigo-500" />
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <button
              onClick={() => navigate('/events/new')}
              className="p-4 border border-gray-200 rounded-lg hover:border-indigo-300 hover:bg-indigo-50 transition-all group"
            >
              <div className="text-center">
                <PlusCircle className="h-8 w-8 text-gray-400 group-hover:text-indigo-500 mx-auto mb-2 transition-colors" />
                <h3 className="font-medium text-gray-900">Create Event</h3>
                <p className="text-sm text-gray-500">Start planning a new event</p>
              </div>
            </button>

            <button
              onClick={() => {
                if (events.length > 0) {
                  navigate(`/events/${events[0].id}`);
                }
              }}
              className="p-4 border border-gray-200 rounded-lg hover:border-emerald-300 hover:bg-emerald-50 transition-all group"
              disabled={events.length === 0}
            >
              <div className="text-center">
                <Calendar className="h-8 w-8 text-gray-400 group-hover:text-emerald-500 mx-auto mb-2 transition-colors" />
                <h3 className="font-medium text-gray-900">View Latest Event</h3>
                <p className="text-sm text-gray-500">Check your recent event</p>
              </div>
            </button>

            <button
              onClick={() => {
                if (events.length > 0) {
                  navigate(`/events/${events[0].id}/expenses/new`);
                }
              }}
              className="p-4 border border-gray-200 rounded-lg hover:border-amber-300 hover:bg-amber-50 transition-all group"
              disabled={events.length === 0}
            >
              <div className="text-center">
                <DollarSign className="h-8 w-8 text-gray-400 group-hover:text-amber-500 mx-auto mb-2 transition-colors" />
                <h3 className="font-medium text-gray-900">Add Expense</h3>
                <p className="text-sm text-gray-500">Record a new expense</p>
              </div>
            </button>
          </div>
        </div>

        {/* Recent Events Section */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Your Events</h2>
            {events.length > 0 && (
              <button
                onClick={() => navigate('/events/new')}
                className="text-indigo-600 hover:text-indigo-700 font-medium text-sm transition-colors"
              >
                View All →
              </button>
            )}
          </div>

          {isLoading ? (
            <div className="text-center py-10">
              <svg
                className="w-10 h-10 mx-auto mb-3 text-indigo-500 animate-spin"
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
            <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="mx-auto h-16 w-16 text-indigo-500 mb-4">
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
              <p className="text-gray-500 max-w-sm mx-auto mb-6 px-4">
                Start by creating your first event and let Eventra help you manage your budget and expenses.
              </p>
              <button
                onClick={() => navigate('/events/new')}
                className="btn-primary"
              >
                Create Your First Event
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {events.slice(0, 6).map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          )}
        </div>

        {/* Tips Section */}
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6 border border-indigo-100 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">💡 Pro Tips</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h3 className="font-medium text-gray-900 mb-2">Budget Wisely</h3>
              <p className="text-sm text-gray-600">
                Allocate 10-15% of your budget for unexpected expenses to avoid going over budget.
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h3 className="font-medium text-gray-900 mb-2">Track Everything</h3>
              <p className="text-sm text-gray-600">
                Record expenses as they happen to maintain accurate budget tracking throughout your event planning.
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Dashboard;