import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEventStore } from '../stores/eventStore';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import ErrorMessage from '../components/common/ErrorMessage';

const NewEvent: React.FC = () => {
  const navigate = useNavigate();
  const { createEvent, getAIBudgetSuggestion, createBudgetCategories, error } = useEventStore();
  
  const [title, setTitle] = useState('');
  const [type, setType] = useState('wedding');
  const [date, setDate] = useState('');
  const [location, setLocation] = useState('');
  const [budget, setBudget] = useState('');
  const [guestCount, setGuestCount] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !type || !date || !location || !budget || !guestCount) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const eventData = {
        title,
        type,
        date,
        location,
        budget: parseFloat(budget),
        guestCount: parseInt(guestCount, 10),
      };
      
      // Create the event
      const newEvent = await createEvent(eventData);
      
      // Get AI-generated budget suggestions
      const suggestions = await getAIBudgetSuggestion(eventData);
      
      // Create budget categories
      await createBudgetCategories(
        suggestions.map(({ id, ...rest }) => ({
          ...rest,
          eventId: newEvent.id,
        }))
      );
      
      navigate(`/events/${newEvent.id}`);
    } catch (error) {
      console.error('Failed to create event:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header title="Create New Event" />
      
      <main className="page-container max-w-3xl mx-auto flex-1">
        {error && <ErrorMessage message={error} />}
        
        <form onSubmit={handleSubmit} className="card animate-fadeIn">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Event Details</h2>
          
          <div className="space-y-6">
            <div>
              <label htmlFor="title" className="form-label">
                Event Title
              </label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="form-input"
                placeholder="My Wedding"
                required
              />
            </div>
            
            <div>
              <label htmlFor="type" className="form-label">
                Event Type
              </label>
              <select
                id="type"
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="form-input"
                required
              >
                <option value="wedding">Wedding</option>
                <option value="party">Party</option>
                <option value="trip">Trip</option>
                <option value="other">Other</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="date" className="form-label">
                Event Date
              </label>
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
              <label htmlFor="location" className="form-label">
                Location
              </label>
              <input
                id="location"
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="form-input"
                placeholder="New York, NY"
                required
              />
            </div>
            
            <div>
              <label htmlFor="budget" className="form-label">
                Total Budget ($)
              </label>
              <input
                id="budget"
                type="number"
                min="0"
                step="0.01"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                className="form-input"
                placeholder="5000"
                required
              />
            </div>
            
            <div>
              <label htmlFor="guestCount" className="form-label">
                Expected Guest Count
              </label>
              <input
                id="guestCount"
                type="number"
                min="1"
                value={guestCount}
                onChange={(e) => setGuestCount(e.target.value)}
                className="form-input"
                placeholder="100"
                required
              />
            </div>
            
            <div className="pt-2 flex gap-3">
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="btn-outline"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-primary flex-1"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center">
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
                    Creating Event...
                  </div>
                ) : (
                  'Create Event'
                )}
              </button>
            </div>
          </div>
        </form>
      </main>

      <Footer />
    </div>
  );
};

export default NewEvent;