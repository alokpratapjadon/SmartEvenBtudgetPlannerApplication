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
  const [description, setDescription] = useState('');
  const [isPublic, setIsPublic] = useState(false);
  const [maxGuests, setMaxGuests] = useState('');
  const [rsvpDeadline, setRsvpDeadline] = useState('');
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
        description: description.trim() || undefined,
        is_public: isPublic,
        max_guests: maxGuests ? parseInt(maxGuests, 10) : undefined,
        rsvp_deadline: rsvpDeadline || undefined,
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
                <option value="conference">Conference</option>
                <option value="birthday">Birthday</option>
                <option value="corporate">Corporate Event</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label htmlFor="description" className="form-label">
                Description (Optional)
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="form-input"
                rows={3}
                placeholder="Tell your guests about this event..."
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                <label htmlFor="rsvpDeadline" className="form-label">
                  RSVP Deadline (Optional)
                </label>
                <input
                  id="rsvpDeadline"
                  type="date"
                  value={rsvpDeadline}
                  onChange={(e) => setRsvpDeadline(e.target.value)}
                  className="form-input"
                />
              </div>
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
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
            </div>

            {/* RSVP Settings */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium text-gray-900 mb-4">RSVP Settings</h3>
              
              <div className="space-y-4">
                <div className="flex items-center">
                  <input
                    id="isPublic"
                    type="checkbox"
                    checked={isPublic}
                    onChange={(e) => setIsPublic(e.target.checked)}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label htmlFor="isPublic" className="ml-2 block text-sm text-gray-900">
                    Allow public RSVPs (anyone with the link can RSVP)
                  </label>
                </div>

                <div>
                  <label htmlFor="maxGuests" className="form-label">
                    Maximum Guests (Optional)
                  </label>
                  <input
                    id="maxGuests"
                    type="number"
                    min="1"
                    value={maxGuests}
                    onChange={(e) => setMaxGuests(e.target.value)}
                    className="form-input"
                    placeholder="Leave empty for no limit"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Set a limit on total attendees including plus-ones
                  </p>
                </div>
              </div>
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