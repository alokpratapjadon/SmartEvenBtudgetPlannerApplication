import React, { useState } from 'react';
import { useInvitationStore } from '../../stores/invitationStore';
import ErrorMessage from '../common/ErrorMessage';
import { Mail, Users, Plus, X } from 'lucide-react';

interface InvitationFormProps {
  eventId: string;
  onClose: () => void;
}

const InvitationForm: React.FC<InvitationFormProps> = ({ eventId, onClose }) => {
  const { sendInvitation, error } = useInvitationStore();
  const [invitees, setInvitees] = useState([{ email: '', name: '' }]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const addInvitee = () => {
    setInvitees([...invitees, { email: '', name: '' }]);
  };

  const removeInvitee = (index: number) => {
    setInvitees(invitees.filter((_, i) => i !== index));
  };

  const updateInvitee = (index: number, field: 'email' | 'name', value: string) => {
    const updated = invitees.map((invitee, i) => 
      i === index ? { ...invitee, [field]: value } : invitee
    );
    setInvitees(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validInvitees = invitees.filter(invitee => invitee.email.trim());
    if (validInvitees.length === 0) return;

    setIsSubmitting(true);

    try {
      for (const invitee of validInvitees) {
        await sendInvitation({
          event_id: eventId,
          invitee_email: invitee.email.trim(),
          invitee_name: invitee.name.trim() || undefined,
          invited_by: '', // Will be set in the store
          status: 'pending',
          guest_count: 1,
        });
      }
      onClose();
    } catch (error) {
      console.error('Failed to send invitations:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center">
            <Mail className="mr-2 text-indigo-500" />
            Send Invitations
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {error && <ErrorMessage message={error} />}

          <div className="space-y-4 mb-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900">Invitees</h3>
              <button
                type="button"
                onClick={addInvitee}
                className="btn-outline text-sm py-1.5 px-3 flex items-center"
              >
                <Plus size={16} className="mr-1" />
                Add Invitee
              </button>
            </div>

            {invitees.map((invitee, index) => (
              <div key={index} className="flex gap-3 items-start">
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <input
                      type="email"
                      value={invitee.email}
                      onChange={(e) => updateInvitee(index, 'email', e.target.value)}
                      className="form-input"
                      placeholder="Email address"
                      required
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      value={invitee.name}
                      onChange={(e) => updateInvitee(index, 'name', e.target.value)}
                      className="form-input"
                      placeholder="Name (optional)"
                    />
                  </div>
                </div>
                {invitees.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeInvitee(index)}
                    className="text-red-500 hover:text-red-700 p-2 transition-colors"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
            ))}
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-start">
              <Users className="h-5 w-5 text-blue-500 mr-3 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-blue-900">Invitation Details</h4>
                <p className="text-sm text-blue-700 mt-1">
                  Invitees will receive an email with event details and RSVP options. 
                  They can respond with their attendance status and guest count.
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
              disabled={isSubmitting || invitees.every(inv => !inv.email.trim())}
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
                  Sending...
                </div>
              ) : (
                `Send ${invitees.filter(inv => inv.email.trim()).length} Invitation${invitees.filter(inv => inv.email.trim()).length !== 1 ? 's' : ''}`
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InvitationForm;