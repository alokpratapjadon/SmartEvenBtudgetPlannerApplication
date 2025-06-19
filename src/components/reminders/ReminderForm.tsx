import React, { useState } from 'react';
import { useInvitationStore } from '../../stores/invitationStore';
import { useAuthStore } from '../../stores/authStore';
import ErrorMessage from '../common/ErrorMessage';
import { Bell, X, Clock, Mail, MessageSquare, Smartphone } from 'lucide-react';

interface ReminderFormProps {
  eventId: string;
  onClose: () => void;
}

const ReminderForm: React.FC<ReminderFormProps> = ({ eventId, onClose }) => {
  const { createReminder, error } = useInvitationStore();
  const { user } = useAuthStore();
  const [reminderType, setReminderType] = useState<'email' | 'sms' | 'push'>('email');
  const [reminderTime, setReminderTime] = useState('1 day');
  const [customTime, setCustomTime] = useState('');
  const [customUnit, setCustomUnit] = useState('hours');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const predefinedTimes = [
    { value: '1 week', label: '1 Week Before' },
    { value: '3 days', label: '3 Days Before' },
    { value: '1 day', label: '1 Day Before' },
    { value: '6 hours', label: '6 Hours Before' },
    { value: '2 hours', label: '2 Hours Before' },
    { value: '30 minutes', label: '30 Minutes Before' },
    { value: 'custom', label: 'Custom' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;

    setIsSubmitting(true);

    try {
      const finalReminderTime = reminderTime === 'custom' 
        ? `${customTime} ${customUnit}`
        : reminderTime;

      await createReminder({
        event_id: eventId,
        user_id: user.id,
        reminder_type: reminderType,
        reminder_time: finalReminderTime,
        message: message.trim() || undefined,
      });

      onClose();
    } catch (error) {
      console.error('Failed to create reminder:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getReminderTypeIcon = (type: 'email' | 'sms' | 'push') => {
    switch (type) {
      case 'email':
        return <Mail size={16} />;
      case 'sms':
        return <MessageSquare size={16} />;
      case 'push':
        return <Smartphone size={16} />;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center">
            <Bell className="mr-2 text-indigo-500" />
            Set Reminder
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && <ErrorMessage message={error} />}

          {/* Reminder Type */}
          <div>
            <label className="form-label">Reminder Type</label>
            <div className="grid grid-cols-3 gap-2 mt-2">
              {(['email', 'sms', 'push'] as const).map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setReminderType(type)}
                  className={`p-3 rounded-lg border-2 transition-all flex flex-col items-center space-y-1 ${
                    reminderType === type
                      ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {getReminderTypeIcon(type)}
                  <span className="text-xs font-medium capitalize">{type}</span>
                </button>
              ))}
            </div>
            {reminderType === 'sms' && !user?.phone_number && (
              <p className="text-sm text-amber-600 mt-2">
                Add a phone number to your profile to receive SMS reminders.
              </p>
            )}
          </div>

          {/* Reminder Time */}
          <div>
            <label className="form-label">When to Remind</label>
            <select
              value={reminderTime}
              onChange={(e) => setReminderTime(e.target.value)}
              className="form-input"
              required
            >
              {predefinedTimes.map((time) => (
                <option key={time.value} value={time.value}>
                  {time.label}
                </option>
              ))}
            </select>

            {reminderTime === 'custom' && (
              <div className="mt-3 flex gap-2">
                <input
                  type="number"
                  min="1"
                  value={customTime}
                  onChange={(e) => setCustomTime(e.target.value)}
                  className="form-input flex-1"
                  placeholder="Amount"
                  required
                />
                <select
                  value={customUnit}
                  onChange={(e) => setCustomUnit(e.target.value)}
                  className="form-input"
                  required
                >
                  <option value="minutes">Minutes</option>
                  <option value="hours">Hours</option>
                  <option value="days">Days</option>
                  <option value="weeks">Weeks</option>
                </select>
              </div>
            )}
          </div>

          {/* Custom Message */}
          <div>
            <label htmlFor="message" className="form-label">
              Custom Message (Optional)
            </label>
            <textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="form-input"
              rows={3}
              placeholder="Add a personal reminder message..."
            />
          </div>

          {/* Info Box */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start">
              <Clock className="h-5 w-5 text-blue-500 mr-3 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-blue-900">Reminder Details</h4>
                <p className="text-sm text-blue-700 mt-1">
                  You'll receive a {reminderType} reminder{' '}
                  {reminderTime === 'custom' ? `${customTime} ${customUnit}` : reminderTime} before your event.
                </p>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="btn-outline flex-1"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary flex-1"
              disabled={isSubmitting || (reminderType === 'sms' && !user?.phone_number)}
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
                  Creating...
                </div>
              ) : (
                'Set Reminder'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReminderForm;