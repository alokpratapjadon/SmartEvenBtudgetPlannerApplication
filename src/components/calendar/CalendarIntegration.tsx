import React, { useEffect, useState } from 'react';
import { useInvitationStore } from '../../stores/invitationStore';
import { useEventStore } from '../../stores/eventStore';
import { useAuthStore } from '../../stores/authStore';
import { Calendar, Download, ExternalLink, Plus, Trash2 } from 'lucide-react';

interface CalendarIntegrationProps {
  eventId: string;
}

const CalendarIntegration: React.FC<CalendarIntegrationProps> = ({ eventId }) => {
  const { 
    calendarIntegrations, 
    fetchCalendarIntegrations, 
    createCalendarIntegration,
    deleteCalendarIntegration,
    generateCalendarUrl,
    isLoading 
  } = useInvitationStore();
  const { currentEvent } = useEventStore();
  const { user } = useAuthStore();
  const [isGenerating, setIsGenerating] = useState<string | null>(null);

  useEffect(() => {
    fetchCalendarIntegrations(eventId);
  }, [eventId, fetchCalendarIntegrations]);

  const handleAddToCalendar = async (provider: 'google' | 'outlook' | 'apple' | 'ical') => {
    if (!user || !currentEvent) return;

    setIsGenerating(provider);

    try {
      if (provider === 'google') {
        const startDate = new Date(currentEvent.date);
        const endDate = new Date(startDate.getTime() + 2 * 60 * 60 * 1000); // 2 hours default
        
        const googleUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(currentEvent.title)}&dates=${startDate.toISOString().replace(/[-:]/g, '').split('.')[0]}Z/${endDate.toISOString().replace(/[-:]/g, '').split('.')[0]}Z&details=${encodeURIComponent(currentEvent.description || '')}&location=${encodeURIComponent(currentEvent.location)}`;
        
        window.open(googleUrl, '_blank');
        
        await createCalendarIntegration({
          event_id: eventId,
          user_id: user.id,
          calendar_provider: provider,
        });
      } else if (provider === 'outlook') {
        const startDate = new Date(currentEvent.date);
        const endDate = new Date(startDate.getTime() + 2 * 60 * 60 * 1000);
        
        const outlookUrl = `https://outlook.live.com/calendar/0/deeplink/compose?subject=${encodeURIComponent(currentEvent.title)}&startdt=${startDate.toISOString()}&enddt=${endDate.toISOString()}&body=${encodeURIComponent(currentEvent.description || '')}&location=${encodeURIComponent(currentEvent.location)}`;
        
        window.open(outlookUrl, '_blank');
        
        await createCalendarIntegration({
          event_id: eventId,
          user_id: user.id,
          calendar_provider: provider,
        });
      } else {
        // For iCal and Apple Calendar, generate downloadable file
        const icalContent = generateICalContent(currentEvent);
        const blob = new Blob([icalContent], { type: 'text/calendar' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${currentEvent.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.ics`;
        link.click();
        URL.revokeObjectURL(url);
        
        await createCalendarIntegration({
          event_id: eventId,
          user_id: user.id,
          calendar_provider: provider,
        });
      }
    } catch (error) {
      console.error('Failed to add to calendar:', error);
    } finally {
      setIsGenerating(null);
    }
  };

  const generateICalContent = (event: any) => {
    const startDate = new Date(event.date);
    const endDate = new Date(startDate.getTime() + 2 * 60 * 60 * 1000);
    
    const formatDate = (date: Date) => {
      return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    };

    return `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Eventra//Event Calendar//EN
BEGIN:VEVENT
UID:${event.id}@eventra.com
DTSTAMP:${formatDate(new Date())}
DTSTART:${formatDate(startDate)}
DTEND:${formatDate(endDate)}
SUMMARY:${event.title}
DESCRIPTION:${event.description || ''}
LOCATION:${event.location}
STATUS:CONFIRMED
END:VEVENT
END:VCALENDAR`;
  };

  const handleRemoveIntegration = async (integrationId: string) => {
    if (window.confirm('Remove this calendar integration?')) {
      await deleteCalendarIntegration(integrationId);
    }
  };

  const getProviderIcon = (provider: string) => {
    switch (provider) {
      case 'google':
        return '📅';
      case 'outlook':
        return '📆';
      case 'apple':
        return '🍎';
      case 'ical':
        return '📋';
      default:
        return '📅';
    }
  };

  const getProviderName = (provider: string) => {
    switch (provider) {
      case 'google':
        return 'Google Calendar';
      case 'outlook':
        return 'Outlook Calendar';
      case 'apple':
        return 'Apple Calendar';
      case 'ical':
        return 'iCal';
      default:
        return provider;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <Calendar className="mr-2 text-indigo-500" />
          Calendar Integration
        </h3>
      </div>

      <div className="p-6">
        {/* Add to Calendar Options */}
        <div className="mb-6">
          <h4 className="font-medium text-gray-900 mb-3">Add to Calendar</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {(['google', 'outlook', 'apple', 'ical'] as const).map((provider) => (
              <button
                key={provider}
                onClick={() => handleAddToCalendar(provider)}
                disabled={isGenerating === provider}
                className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:border-indigo-300 hover:bg-indigo-50 transition-all group disabled:opacity-50"
              >
                <span className="text-2xl mb-2">{getProviderIcon(provider)}</span>
                <span className="text-sm font-medium text-gray-700 group-hover:text-indigo-700">
                  {isGenerating === provider ? 'Adding...' : getProviderName(provider)}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Existing Integrations */}
        {calendarIntegrations.length > 0 && (
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Active Integrations</h4>
            <div className="space-y-3">
              {calendarIntegrations.map((integration) => (
                <div
                  key={integration.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center">
                    <span className="text-lg mr-3">{getProviderIcon(integration.calendar_provider)}</span>
                    <div>
                      <p className="font-medium text-gray-900">
                        {getProviderName(integration.calendar_provider)}
                      </p>
                      <p className="text-sm text-gray-500">
                        Status: <span className="capitalize">{integration.sync_status}</span>
                        {integration.last_synced_at && (
                          <> • Synced {new Date(integration.last_synced_at).toLocaleDateString()}</>
                        )}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleRemoveIntegration(integration.id)}
                    className="text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Info Box */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start">
            <Calendar className="h-5 w-5 text-blue-500 mr-3 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-medium text-blue-900">Calendar Integration</h4>
              <p className="text-sm text-blue-700 mt-1">
                Add this event to your calendar to get automatic reminders and keep track of your schedule. 
                For Google and Outlook, the event will open in a new tab. For Apple Calendar and iCal, 
                a calendar file will be downloaded.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarIntegration;