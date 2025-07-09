import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { useEventStore } from '../stores/eventStore';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import EventCard from '../components/events/EventCard';
import LoadingScreen from '../components/common/LoadingScreen';
import { 
  PlusCircle, 
  Calendar, 
  DollarSign, 
  TrendingUp, 
  Users, 
  BarChart3, 
  Sparkles,
  Clock,
  MapPin,
  Star,
  ArrowRight,
  Filter,
  Search,
  Grid,
  List
} from 'lucide-react';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { events, fetchEvents, isLoading } = useEventStore();
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'date' | 'budget' | 'guests'>('date');
  
  useEffect(() => {
    const loadEvents = async () => {
      await fetchEvents();
      setIsInitialLoad(false);
    };
    
    loadEvents();
  }, [fetchEvents]);

  const getDisplayName = () => {
    if (user?.full_name) {
      return user.full_name.split(' ')[0]; // First name only
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

  // Filter and sort events
  const filteredEvents = events
    .filter(event => {
      const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           event.location.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = filterType === 'all' || event.type === filterType;
      return matchesSearch && matchesType;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        case 'budget':
          return b.budget - a.budget;
        case 'guests':
          return b.guestCount - a.guestCount;
        default:
          return 0;
      }
    });

  // Calculate dashboard statistics
  const totalEvents = events.length;
  const totalBudget = events.reduce((sum, event) => sum + event.budget, 0);
  const upcomingEvents = events.filter(event => new Date(event.date) > new Date()).length;
  const totalGuests = events.reduce((sum, event) => sum + event.guestCount, 0);
  
  // Get recent events (last 3)
  const recentEvents = events
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 3);

  // Get upcoming events
  const upcomingEventsList = events
    .filter(event => new Date(event.date) > new Date())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 3);

  const eventTypes = ['all', 'wedding', 'party', 'trip', 'conference', 'birthday', 'corporate', 'other'];
  
  if (isInitialLoad && isLoading) {
    return <LoadingScreen />;
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-purple-50 flex flex-col relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-4000"></div>
        
        {/* Floating particles */}
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-indigo-300 rounded-full opacity-20 animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 4}s`
            }}
          />
        ))}
      </div>

      <Header />
      
      <main className="page-container flex-1 relative z-10">
        {/* Hero Section */}
        <div className="mb-8">
          <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-600 rounded-3xl p-6 sm:p-8 text-white shadow-2xl relative overflow-hidden animate-fadeIn">
            <div className="absolute inset-0 bg-black opacity-10"></div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -mr-32 -mt-32 animate-pulse"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white opacity-5 rounded-full -ml-24 -mb-24 animate-pulse animation-delay-2000"></div>
            
            {/* Hero Image */}
            <div className="absolute top-4 right-4 w-32 h-32 rounded-2xl overflow-hidden opacity-20 hidden lg:block">
              <img
                src="https://images.pexels.com/photos/1190298/pexels-photo-1190298.jpeg?auto=compress&cs=tinysrgb&w=400"
                alt="Event planning"
                className="w-full h-full object-cover"
              />
            </div>
            
            <div className="relative z-10">
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                <div className="flex-1">
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 flex items-center animate-slideInFromLeft">
                    Welcome back, {getDisplayName()}! 
                    <Sparkles className="ml-3 text-yellow-300 animate-bounce" size={32} />
                  </h1>
                  <p className="text-indigo-100 text-lg mb-4 animate-slideInFromLeft animation-delay-200">
                    Ready to create your next unforgettable event?
                  </p>
                  
                  {/* Quick Stats in Hero */}
                  <div className="flex flex-wrap gap-4 text-sm animate-slideInFromLeft animation-delay-400">
                    <div className="bg-white/20 rounded-lg px-3 py-2 backdrop-blur-sm hover:bg-white/30 transition-all duration-200 transform hover:scale-105">
                      <span className="font-semibold">{totalEvents}</span> Events
                    </div>
                    <div className="bg-white/20 rounded-lg px-3 py-2 backdrop-blur-sm hover:bg-white/30 transition-all duration-200 transform hover:scale-105">
                      <span className="font-semibold">{upcomingEvents}</span> Upcoming
                    </div>
                    <div className="bg-white/20 rounded-lg px-3 py-2 backdrop-blur-sm hover:bg-white/30 transition-all duration-200 transform hover:scale-105">
                      <span className="font-semibold">{formatCurrency(totalBudget)}</span> Total Budget
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-3 animate-slideInFromRight">
                  <button
                    onClick={() => navigate('/events/new')}
                    className="bg-white text-indigo-600 hover:bg-indigo-50 font-semibold py-3 px-6 rounded-xl transition-all duration-300 flex items-center shadow-lg hover:shadow-2xl transform hover:scale-110 group relative overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-indigo-100 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                    <PlusCircle size={20} className="mr-2 group-hover:rotate-90 transition-transform duration-200" />
                    Create New Event
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20 hover:shadow-2xl transition-all duration-300 hover:scale-105 group animate-fadeIn">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 group-hover:text-gray-700">Total Events</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{totalEvents}</p>
                <p className="text-xs text-emerald-600 mt-1">All time</p>
              </div>
              <div className="bg-gradient-to-br from-emerald-400 to-emerald-600 p-3 rounded-xl group-hover:scale-110 transition-transform duration-200 shadow-lg">
                <Calendar className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20 hover:shadow-2xl transition-all duration-300 hover:scale-105 group animate-fadeIn animation-delay-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 group-hover:text-gray-700">Total Budget</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{formatCurrency(totalBudget)}</p>
                <p className="text-xs text-indigo-600 mt-1">Across all events</p>
              </div>
              <div className="bg-gradient-to-br from-indigo-400 to-indigo-600 p-3 rounded-xl group-hover:scale-110 transition-transform duration-200 shadow-lg">
                <DollarSign className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20 hover:shadow-2xl transition-all duration-300 hover:scale-105 group animate-fadeIn animation-delay-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 group-hover:text-gray-700">Upcoming Events</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{upcomingEvents}</p>
                <p className="text-xs text-amber-600 mt-1">This month</p>
              </div>
              <div className="bg-gradient-to-br from-amber-400 to-amber-600 p-3 rounded-xl group-hover:scale-110 transition-transform duration-200 shadow-lg">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20 hover:shadow-2xl transition-all duration-300 hover:scale-105 group animate-fadeIn animation-delay-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 group-hover:text-gray-700">Total Guests</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{totalGuests}</p>
                <p className="text-xs text-purple-600 mt-1">Expected attendees</p>
              </div>
              <div className="bg-gradient-to-br from-purple-400 to-purple-600 p-3 rounded-xl group-hover:scale-110 transition-transform duration-200 shadow-lg">
                <Users className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 p-6 mb-8 animate-fadeIn animation-delay-400">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <BarChart3 className="mr-2 text-indigo-500" />
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <button
              onClick={() => navigate('/events/new')}
              className="p-4 border-2 border-dashed border-gray-200 rounded-xl hover:border-indigo-300 hover:bg-indigo-50 transition-all group transform hover:scale-105"
            >
              <div className="text-center">
                <PlusCircle className="h-8 w-8 text-gray-400 group-hover:text-indigo-500 mx-auto mb-2 transition-colors group-hover:scale-110" />
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
              className="p-4 border-2 border-gray-200 rounded-xl hover:border-emerald-300 hover:bg-emerald-50 transition-all group transform hover:scale-105"
              disabled={events.length === 0}
            >
              <div className="text-center">
                <Calendar className="h-8 w-8 text-gray-400 group-hover:text-emerald-500 mx-auto mb-2 transition-colors group-hover:scale-110" />
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
              className="p-4 border-2 border-gray-200 rounded-xl hover:border-amber-300 hover:bg-amber-50 transition-all group transform hover:scale-105"
              disabled={events.length === 0}
            >
              <div className="text-center">
                <DollarSign className="h-8 w-8 text-gray-400 group-hover:text-amber-500 mx-auto mb-2 transition-colors group-hover:scale-110" />
                <h3 className="font-medium text-gray-900">Add Expense</h3>
                <p className="text-sm text-gray-500">Record a new expense</p>
              </div>
            </button>
          </div>
        </div>

        {/* Events Section */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Your Events</h2>
            
            {events.length > 0 && (
              <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                  <input
                    type="text"
                    placeholder="Search events..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent w-full sm:w-64"
                  />
                </div>

                {/* Filter */}
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  {eventTypes.map(type => (
                    <option key={type} value={type}>
                      {type === 'all' ? 'All Types' : type.charAt(0).toUpperCase() + type.slice(1)}
                    </option>
                  ))}
                </select>

                {/* Sort */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as 'date' | 'budget' | 'guests')}
                  className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="date">Sort by Date</option>
                  <option value="budget">Sort by Budget</option>
                  <option value="guests">Sort by Guests</option>
                </select>

                {/* View Mode */}
                <div className="flex border border-gray-200 rounded-lg overflow-hidden">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 ${viewMode === 'grid' ? 'bg-indigo-500 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'} transition-colors`}
                  >
                    <Grid size={16} />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 ${viewMode === 'list' ? 'bg-indigo-500 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'} transition-colors`}
                  >
                    <List size={16} />
                  </button>
                </div>
              </div>
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
            <div className="text-center py-12 bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 animate-bounceIn">
              {/* Hero Image for Empty State */}
              <div className="w-32 h-32 mx-auto mb-6 rounded-2xl overflow-hidden shadow-lg">
                <img
                  src="https://images.pexels.com/photos/1190298/pexels-photo-1190298.jpeg?auto=compress&cs=tinysrgb&w=400"
                  alt="Create your first event"
                  className="w-full h-full object-cover"
                />
              </div>
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
          ) : filteredEvents.length === 0 ? (
            <div className="text-center py-12 bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 animate-fadeIn">
              <Filter className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No events match your filters
              </h3>
              <p className="text-gray-500 mb-4">
                Try adjusting your search or filter criteria.
              </p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setFilterType('all');
                }}
                className="btn-outline"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div className={viewMode === 'grid' 
              ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6" 
              : "space-y-4"
            }>
              {filteredEvents.map((event) => (
                <EventCard key={event.id} event={event} viewMode={viewMode} />
              ))}
            </div>
          )}
        </div>

        {/* Upcoming Events & Recent Activity */}
        {events.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Upcoming Events */}
            <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 p-6 animate-fadeIn animation-delay-500">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <Clock className="mr-2 text-amber-500" />
                  Upcoming Events
                </h3>
                <span className="text-sm text-gray-500">{upcomingEventsList.length} events</span>
              </div>
              
              {upcomingEventsList.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No upcoming events</p>
              ) : (
                <div className="space-y-3">
                  {upcomingEventsList.map((event) => (
                    <div 
                      key={event.id}
                      onClick={() => navigate(`/events/${event.id}`)}
                      className="p-3 border border-gray-100 rounded-lg hover:border-amber-200 hover:bg-amber-50 transition-all cursor-pointer group transform hover:scale-105"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900 group-hover:text-amber-700">{event.title}</h4>
                          <div className="flex items-center text-sm text-gray-500 mt-1">
                            <Calendar size={12} className="mr-1" />
                            {new Date(event.date).toLocaleDateString()}
                            <MapPin size={12} className="ml-3 mr-1" />
                            {event.location}
                          </div>
                        </div>
                        <ArrowRight size={16} className="text-gray-400 group-hover:text-amber-500 transition-colors" />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Recent Activity */}
            <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 p-6 animate-fadeIn animation-delay-600">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <Star className="mr-2 text-emerald-500" />
                  Recent Events
                </h3>
                <span className="text-sm text-gray-500">{recentEvents.length} events</span>
              </div>
              
              <div className="space-y-3">
                {recentEvents.map((event) => (
                  <div 
                    key={event.id}
                    onClick={() => navigate(`/events/${event.id}`)}
                    className="p-3 border border-gray-100 rounded-lg hover:border-emerald-200 hover:bg-emerald-50 transition-all cursor-pointer group transform hover:scale-105"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 group-hover:text-emerald-700">{event.title}</h4>
                        <div className="flex items-center text-sm text-gray-500 mt-1">
                          <span className="capitalize">{event.type}</span>
                          <span className="mx-2">•</span>
                          <span>{formatCurrency(event.budget)}</span>
                        </div>
                      </div>
                      <ArrowRight size={16} className="text-gray-400 group-hover:text-emerald-500 transition-colors" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tips Section */}
        <div className="bg-gradient-to-r from-indigo-50/80 to-purple-50/80 backdrop-blur-sm rounded-xl p-6 border border-indigo-100 mb-8 animate-fadeIn animation-delay-700">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">💡 Pro Tips</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white/80 backdrop-blur-sm p-4 rounded-lg shadow-sm hover:shadow-lg transition-all transform hover:scale-105">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-lg flex items-center justify-center mb-3">
                <DollarSign className="text-white" size={20} />
              </div>
              <h3 className="font-medium text-gray-900 mb-2">Budget Wisely</h3>
              <p className="text-sm text-gray-600">
                Allocate 10-15% of your budget for unexpected expenses to avoid going over budget.
              </p>
            </div>
            <div className="bg-white/80 backdrop-blur-sm p-4 rounded-lg shadow-sm hover:shadow-lg transition-all transform hover:scale-105">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-400 to-indigo-600 rounded-lg flex items-center justify-center mb-3">
                <BarChart3 className="text-white" size={20} />
              </div>
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