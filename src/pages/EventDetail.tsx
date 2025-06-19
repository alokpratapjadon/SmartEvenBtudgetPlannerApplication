import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useEventStore } from '../stores/eventStore';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import LoadingScreen from '../components/common/LoadingScreen';
import BudgetCategoryList from '../components/budget/BudgetCategoryList';
import BudgetProgress from '../components/budget/BudgetProgress';
import ExpenseList from '../components/expenses/ExpenseList';
import InvitationList from '../components/invitations/InvitationList';
import InvitationForm from '../components/invitations/InvitationForm';
import ReminderList from '../components/reminders/ReminderList';
import CalendarIntegration from '../components/calendar/CalendarIntegration';
import { Calendar, MapPin, Users, DollarSign, CreditCard, Mail, Bell, CalendarPlus } from 'lucide-react';

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
  const [showInvitationForm, setShowInvitationForm] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'invitations' | 'reminders' | 'calendar'>('overview');
  
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

  const tabs = [
    { id: 'overview', label: 'Overview', icon: DollarSign },
    { id: 'invitations', label: 'Invitations', icon: Mail },
    { id: 'reminders', label: 'Reminders', icon: Bell },
    { id: 'calendar', label: 'Calendar', icon: CalendarPlus },
  ] as const;
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header title={currentEvent.title} />
      
      <main className="page-container flex-1">
        {/* Event Header */}
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

              <button
                onClick={() => setShowInvitationForm(true)}
                className="btn-outline w-full sm:w-auto flex items-center justify-center"
              >
                <Mail size={16} className="mr-2" />
                Send Invites
              </button>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-xl shadow-sm mb-8 overflow-hidden">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6" aria-label="Tabs">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center transition-colors ${
                      activeTab === tab.id
                        ? 'border-indigo-500 text-indigo-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Icon size={16} className="mr-2" />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'overview' && (
              <div className="space-y-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
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
              </div>
            )}

            {activeTab === 'invitations' && (
              <InvitationList eventId={eventId || ''} />
            )}

            {activeTab === 'reminders' && (
              <ReminderList eventId={eventId || ''} />
            )}

            {activeTab === 'calendar' && (
              <CalendarIntegration eventId={eventId || ''} />
            )}
          </div>
        </div>
      </main>

      <Footer />

      {showInvitationForm && (
        <InvitationForm
          eventId={eventId || ''}
          onClose={() => setShowInvitationForm(false)}
        />
      )}
    </div>
  );
};

export default EventDetail;