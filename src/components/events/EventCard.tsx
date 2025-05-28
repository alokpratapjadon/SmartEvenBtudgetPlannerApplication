import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, MapPin, Users, DollarSign } from 'lucide-react';
import { Event } from '../../stores/eventStore';

interface EventCardProps {
  event: Event;
}

const EventCard: React.FC<EventCardProps> = ({ event }) => {
  const navigate = useNavigate();
  
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
  
  const getEventTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'wedding':
        return '💍';
      case 'party':
        return '🎉';
      case 'trip':
        return '✈️';
      default:
        return '📅';
    }
  };
  
  return (
    <div 
      className="card hover:scale-[1.02] cursor-pointer group"
      onClick={() => navigate(`/events/${event.id}`)}
    >
      <div className="flex justify-between items-start">
        <h3 className="text-lg font-semibold text-gray-900 group-hover:text-emerald-600 transition-colors">
          {event.title}
        </h3>
        <span className="text-2xl" role="img" aria-label={event.type}>
          {getEventTypeIcon(event.type)}
        </span>
      </div>
      
      <p className="text-sm text-gray-500 capitalize mt-1">
        {event.type}
      </p>
      
      <div className="mt-4 space-y-2">
        <div className="flex items-center text-sm text-gray-600">
          <Calendar size={16} className="mr-2 text-emerald-500" />
          <span>{formatDate(event.date)}</span>
        </div>
        
        <div className="flex items-center text-sm text-gray-600">
          <MapPin size={16} className="mr-2 text-emerald-500" />
          <span>{event.location}</span>
        </div>
        
        <div className="flex items-center text-sm text-gray-600">
          <Users size={16} className="mr-2 text-emerald-500" />
          <span>{event.guestCount} guests</span>
        </div>
        
        <div className="flex items-center text-sm text-gray-600">
          <DollarSign size={16} className="mr-2 text-emerald-500" />
          <span>{formatCurrency(event.budget)} budget</span>
        </div>
      </div>
      
      <div className="mt-4 pt-4 border-t border-gray-100 flex justify-end">
        <button className="text-sm text-emerald-600 font-medium hover:text-emerald-800 transition-colors">
          View Details →
        </button>
      </div>
    </div>
  );
};

export default EventCard;