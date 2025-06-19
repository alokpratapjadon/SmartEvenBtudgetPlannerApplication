import React, { useEffect, useState } from 'react';
import { useInvitationStore, EventInvitation } from '../../stores/invitationStore';
import { Mail, Users, Check, X, Clock, HelpCircle, Trash2 } from 'lucide-react';

interface InvitationListProps {
  eventId: string;
}

const InvitationList: React.FC<InvitationListProps> = ({ eventId }) => {
  const { invitations, fetchInvitations, deleteInvitation, isLoading } = useInvitationStore();
  const [selectedInvitation, setSelectedInvitation] = useState<EventInvitation | null>(null);

  useEffect(() => {
    fetchInvitations(eventId);
  }, [eventId, fetchInvitations]);

  const getStatusIcon = (status: EventInvitation['status']) => {
    switch (status) {
      case 'accepted':
        return <Check className="text-green-500" size={16} />;
      case 'declined':
        return <X className="text-red-500" size={16} />;
      case 'maybe':
        return <HelpCircle className="text-yellow-500" size={16} />;
      default:
        return <Clock className="text-gray-400" size={16} />;
    }
  };

  const getStatusColor = (status: EventInvitation['status']) => {
    switch (status) {
      case 'accepted':
        return 'bg-green-100 text-green-800';
      case 'declined':
        return 'bg-red-100 text-red-800';
      case 'maybe':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleDeleteInvitation = async (invitationId: string) => {
    if (window.confirm('Are you sure you want to delete this invitation?')) {
      await deleteInvitation(invitationId);
    }
  };

  const getResponseSummary = () => {
    const accepted = invitations.filter(inv => inv.status === 'accepted').length;
    const declined = invitations.filter(inv => inv.status === 'declined').length;
    const maybe = invitations.filter(inv => inv.status === 'maybe').length;
    const pending = invitations.filter(inv => inv.status === 'pending').length;
    
    return { accepted, declined, maybe, pending };
  };

  const summary = getResponseSummary();
  const totalGuests = invitations
    .filter(inv => inv.status === 'accepted')
    .reduce((sum, inv) => sum + inv.guest_count, 0);

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <Mail className="mr-2 text-indigo-500" />
            Invitations ({invitations.length})
          </h3>
          <div className="flex items-center space-x-4 text-sm">
            <span className="flex items-center text-green-600">
              <Check size={14} className="mr-1" />
              {summary.accepted} Accepted
            </span>
            <span className="flex items-center text-gray-600">
              <Clock size={14} className="mr-1" />
              {summary.pending} Pending
            </span>
          </div>
        </div>
      </div>

      {/* Response Summary */}
      <div className="px-6 py-4 bg-blue-50 border-b border-blue-100">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-green-600">{summary.accepted}</div>
            <div className="text-sm text-gray-600">Accepted</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-gray-600">{summary.pending}</div>
            <div className="text-sm text-gray-600">Pending</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-yellow-600">{summary.maybe}</div>
            <div className="text-sm text-gray-600">Maybe</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-indigo-600">{totalGuests}</div>
            <div className="text-sm text-gray-600">Total Guests</div>
          </div>
        </div>
      </div>

      {invitations.length === 0 ? (
        <div className="py-8 text-center">
          <Mail className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 mb-4">No invitations sent yet</p>
          <p className="text-sm text-gray-400">
            Send invitations to let people know about your event and track RSVPs.
          </p>
        </div>
      ) : (
        <div className="divide-y divide-gray-100">
          {invitations.map((invitation) => (
            <div key={invitation.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h4 className="font-medium text-gray-900">
                        {invitation.invitee_name || invitation.invitee_email}
                      </h4>
                      {invitation.invitee_name && (
                        <p className="text-sm text-gray-500">{invitation.invitee_email}</p>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(invitation.status)}`}>
                        {getStatusIcon(invitation.status)}
                        <span className="ml-1 capitalize">{invitation.status}</span>
                      </span>
                      <button
                        onClick={() => handleDeleteInvitation(invitation.id)}
                        className="text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <div className="flex items-center space-x-4">
                      <span className="flex items-center">
                        <Users size={14} className="mr-1" />
                        {invitation.guest_count} guest{invitation.guest_count !== 1 ? 's' : ''}
                      </span>
                      <span>Invited {formatDate(invitation.invited_at)}</span>
                    </div>
                    {invitation.responded_at && (
                      <span>Responded {formatDate(invitation.responded_at)}</span>
                    )}
                  </div>

                  {(invitation.dietary_restrictions || invitation.special_requests) && (
                    <div className="mt-2 text-sm text-gray-600">
                      {invitation.dietary_restrictions && (
                        <p><strong>Dietary:</strong> {invitation.dietary_restrictions}</p>
                      )}
                      {invitation.special_requests && (
                        <p><strong>Requests:</strong> {invitation.special_requests}</p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default InvitationList;