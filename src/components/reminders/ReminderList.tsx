import React, { useEffect, useState } from 'react';
import { useInvitationStore, EventReminder } from '../../stores/invitationStore';
import { Bell, Mail, MessageSquare, Smartphone, Trash2, Edit, Plus } from 'lucide-react';
import ReminderForm from './ReminderForm';

interface ReminderListProps {
  eventId: string;
}

const ReminderList: React.FC<ReminderListProps> = ({ eventId }) => {
  const { reminders, fetchReminders, deleteReminder, isLoading } = useInvitationStore();
  const [showReminderForm, setShowReminderForm] = useState(false);

  useEffect(() => {
    fetchReminders(eventId);
  }, [eventId, fetchReminders]);

  const getReminderTypeIcon = (type: EventReminder['reminder_type']) => {
    switch (type) {
      case 'email':
        return <Mail className="text-blue-500" size={16} />;
      case 'sms':
        return <MessageSquare className="text-green-500" size={16} />;
      case 'push':
        return <Smartphone className="text-purple-500" size={16} />;
    }
  };

  const formatReminderTime = (time: string) => {
    return time.replace(/(\d+)\s+(\w+)/, '$1 $2');
  };

  const handleDeleteReminder = async (reminderId: string) => {
    if (window.confirm('Are you sure you want to delete this reminder?')) {
      await deleteReminder(reminderId);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            {[1, 2].map(i => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <Bell className="mr-2 text-indigo-500" />
            Reminders ({reminders.length})
          </h3>
          <button
            onClick={() => setShowReminderForm(true)}
            className="btn-primary text-sm py-1.5 px-3 flex items-center"
          >
            <Plus size={16} className="mr-1" />
            Add Reminder
          </button>
        </div>

        {reminders.length === 0 ? (
          <div className="py-8 text-center">
            <Bell className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 mb-4">No reminders set</p>
            <p className="text-sm text-gray-400 mb-4">
              Set reminders to get notified before your event starts.
            </p>
            <button
              onClick={() => setShowReminderForm(true)}
              className="btn-outline text-sm"
            >
              Set Your First Reminder
            </button>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {reminders.map((reminder) => (
              <div key={reminder.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        {getReminderTypeIcon(reminder.reminder_type)}
                        <span className="font-medium text-gray-900 capitalize">
                          {reminder.reminder_type} Reminder
                        </span>
                        <span className="text-sm text-gray-500">
                          • {formatReminderTime(reminder.reminder_time)} before
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          reminder.is_sent 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {reminder.is_sent ? 'Sent' : 'Scheduled'}
                        </span>
                        <button
                          onClick={() => handleDeleteReminder(reminder.id)}
                          className="text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>

                    {reminder.message && (
                      <p className="text-sm text-gray-600 mb-2">
                        <strong>Message:</strong> {reminder.message}
                      </p>
                    )}

                    <div className="text-xs text-gray-500">
                      {reminder.scheduled_for && (
                        <span>
                          Scheduled for: {new Date(reminder.scheduled_for).toLocaleString()}
                        </span>
                      )}
                      {reminder.sent_at && (
                        <span className="ml-4">
                          Sent: {new Date(reminder.sent_at).toLocaleString()}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Info Box */}
        <div className="px-6 py-4 bg-blue-50 border-t border-blue-100">
          <div className="flex items-start">
            <Bell className="h-5 w-5 text-blue-500 mr-3 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-medium text-blue-900">Reminder Tips</h4>
              <p className="text-sm text-blue-700 mt-1">
                Set multiple reminders at different intervals to ensure you don't miss your event. 
                Email reminders work for all users, while SMS requires a phone number in your profile.
              </p>
            </div>
          </div>
        </div>
      </div>

      {showReminderForm && (
        <ReminderForm
          eventId={eventId}
          onClose={() => setShowReminderForm(false)}
        />
      )}
    </>
  );
};

export default ReminderList;