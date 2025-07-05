import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, MapPin, Users, DollarSign, ArrowRight } from 'lucide-react';
import { Event } from '../../stores/eventStore';

interface EventCardProps {
  event: Event;
  viewMode?: 'grid' | 'list';
}

const EventCard: React.FC<EventCardProps> = ({ event, viewMode = 'grid' }) => {
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
      case 'conference':
        return '🎤';
      case 'birthday':
        return '🎂';
      case 'corporate':
        return '🏢';
      default:
        return '📅';
    }
  };

  const isUpcoming = new Date(event.date) > new Date();
  
  if (viewMode === 'list') {
    return (
      <div 
        className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 hover:shadow-md hover:border-indigo-200 cursor-pointer group transition-all duration-200"
        onClick={() => navigate(`/events/${event.id}`)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 flex-1">
            <div className="text-3xl">{getEventTypeIcon(event.type)}</div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 mb-1">
                <h3 className="text-lg font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors truncate">
                  {event.title}
                </h3>
                {isUpcoming && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Upcoming
                  </span>
                )}
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                <div className="flex items-center">
                  <Calendar size={14} className="mr-1 text-indigo-500" />
                  <span className="truncate">{formatDate(event.date)}</span>
                </div>
                
                <div className="flex items-center">
                  <MapPin size={14} className="mr-1 text-indigo-500" />
                  <span className="truncate">{event.location}</span>
                </div>
                
                <div className="flex items-center">
                  <Users size={14} className="mr-1 text-indigo-500" />
                  <span>{event.guestCount} guests</span>
                </div>
                
                <div className="flex items-center">
                  <DollarSign size={14} className="mr-1 text-indigo-500" />
                  <span>{formatCurrency(event.budget)}</span>
                </div>
              </div>
            </div>
          </div>
          
          <ArrowRight size={20} className="text-gray-400 group-hover:text-indigo-500 transition-colors ml-4" />
        </div>
      </div>
    );
  }
  
  return (
    <div 
      className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-lg hover:border-indigo-200 cursor-pointer group transition-all duration-200 hover:scale-[1.02]"
      onClick={() => navigate(`/events/${event.id}`)}
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">
              {event.title}
            </h3>
            <span className="text-2xl" role="img" aria-label={event.type}>
              {getEventTypeIcon(event.type)}
            </span>
          </div>
          
          <div className="flex items-center space-x-2">
            <p className="text-sm text-gray-500 capitalize">
              {event.type}
            </p>
            {isUpcoming && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Upcoming
              </span>
            )}
          </div>
        </div>
      </div>
      
      <div className="space-y-3 mb-4">
        <div className="flex items-center text-sm text-gray-600">
          <Calendar size={16} className="mr-2 text-indigo-500 flex-shrink-0" />
          <span>{formatDate(event.date)}</span>
        </div>
        
        <div className="flex items-center text-sm text-gray-600">
          <MapPin size={16} className="mr-2 text-indigo-500 flex-shrink-0" />
          <span className="truncate">{event.location}</span>
        </div>
        
        <div className="flex items-center text-sm text-gray-600">
          <Users size={16} className="mr-2 text-indigo-500 flex-shrink-0" />
          <span>{event.guestCount} guests</span>
        </div>
        
        <div className="flex items-center text-sm text-gray-600">
          <DollarSign size={16} className="mr-2 text-indigo-500 flex-shrink-0" />
          <span>{formatCurrency(event.budget)} budget</span>
        </div>
      </div>
      
      {event.description && (
        <p className="text-sm text-gray-500 mb-4 line-clamp-2">
          {event.description}
        </p>
      )}
      
      <div className="pt-4 border-t border-gray-100 flex justify-between items-center">
        <span className="text-xs text-gray-400">
          Created {new Date(event.createdAt).toLocaleDateString()}
        </span>
        <div className="flex items-center text-sm text-indigo-600 font-medium group-hover:text-indigo-800 transition-colors">
          View Details
          <ArrowRight size={16} className="ml-1 group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </div>
  );
};

export default EventCard;