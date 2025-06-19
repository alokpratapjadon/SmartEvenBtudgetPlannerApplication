import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { v4 as uuidv4 } from 'uuid';

export interface EventInvitation {
  id: string;
  event_id: string;
  invitee_email: string;
  invitee_name?: string;
  invited_by: string;
  status: 'pending' | 'accepted' | 'declined' | 'maybe';
  guest_count: number;
  dietary_restrictions?: string;
  special_requests?: string;
  invited_at: string;
  responded_at?: string;
  created_at: string;
}

export interface EventReminder {
  id: string;
  event_id: string;
  user_id: string;
  reminder_type: 'email' | 'sms' | 'push';
  reminder_time: string; // interval like '1 day', '2 hours'
  message?: string;
  is_sent: boolean;
  scheduled_for?: string;
  sent_at?: string;
  created_at: string;
}

export interface CalendarIntegration {
  id: string;
  event_id: string;
  user_id: string;
  calendar_provider: 'google' | 'outlook' | 'apple' | 'ical';
  external_event_id?: string;
  sync_status: 'pending' | 'synced' | 'failed' | 'removed';
  last_synced_at?: string;
  sync_error?: string;
  created_at: string;
}

interface InvitationState {
  invitations: EventInvitation[];
  reminders: EventReminder[];
  calendarIntegrations: CalendarIntegration[];
  isLoading: boolean;
  error: string | null;

  // Invitation methods
  fetchInvitations: (eventId: string) => Promise<void>;
  sendInvitation: (invitation: Omit<EventInvitation, 'id' | 'invited_at' | 'created_at'>) => Promise<EventInvitation>;
  updateInvitationStatus: (invitationId: string, status: EventInvitation['status'], guestCount?: number, dietaryRestrictions?: string, specialRequests?: string) => Promise<void>;
  deleteInvitation: (invitationId: string) => Promise<void>;

  // Reminder methods
  fetchReminders: (eventId: string) => Promise<void>;
  createReminder: (reminder: Omit<EventReminder, 'id' | 'is_sent' | 'created_at'>) => Promise<EventReminder>;
  updateReminder: (reminderId: string, updates: Partial<EventReminder>) => Promise<void>;
  deleteReminder: (reminderId: string) => Promise<void>;

  // Calendar integration methods
  fetchCalendarIntegrations: (eventId: string) => Promise<void>;
  createCalendarIntegration: (integration: Omit<CalendarIntegration, 'id' | 'sync_status' | 'created_at'>) => Promise<CalendarIntegration>;
  updateCalendarIntegration: (integrationId: string, updates: Partial<CalendarIntegration>) => Promise<void>;
  deleteCalendarIntegration: (integrationId: string) => Promise<void>;
  generateCalendarUrl: (eventId: string, format: 'google' | 'outlook' | 'ical') => Promise<string>;
}

export const useInvitationStore = create<InvitationState>((set, get) => ({
  invitations: [],
  reminders: [],
  calendarIntegrations: [],
  isLoading: false,
  error: null,

  // Invitation methods
  fetchInvitations: async (eventId: string) => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('event_invitations')
        .select('*')
        .eq('event_id', eventId)
        .order('invited_at', { ascending: false });

      if (error) throw error;
      set({ invitations: data as EventInvitation[], isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  sendInvitation: async (invitationData) => {
    set({ isLoading: true, error: null });
    try {
      const user = await supabase.auth.getUser();
      const userId = user.data.user?.id;
      
      if (!userId) throw new Error('User not authenticated');

      const invitation: EventInvitation = {
        ...invitationData,
        id: uuidv4(),
        invited_by: userId,
        invited_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
      };

      const { error } = await supabase
        .from('event_invitations')
        .insert(invitation);

      if (error) throw error;

      set(state => ({
        invitations: [invitation, ...state.invitations],
        isLoading: false,
      }));

      return invitation;
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  updateInvitationStatus: async (invitationId, status, guestCount, dietaryRestrictions, specialRequests) => {
    set({ isLoading: true, error: null });
    try {
      const updates: any = {
        status,
        responded_at: new Date().toISOString(),
      };

      if (guestCount !== undefined) updates.guest_count = guestCount;
      if (dietaryRestrictions !== undefined) updates.dietary_restrictions = dietaryRestrictions;
      if (specialRequests !== undefined) updates.special_requests = specialRequests;

      const { error } = await supabase
        .from('event_invitations')
        .update(updates)
        .eq('id', invitationId);

      if (error) throw error;

      set(state => ({
        invitations: state.invitations.map(inv =>
          inv.id === invitationId ? { ...inv, ...updates } : inv
        ),
        isLoading: false,
      }));
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  deleteInvitation: async (invitationId: string) => {
    set({ isLoading: true, error: null });
    try {
      const { error } = await supabase
        .from('event_invitations')
        .delete()
        .eq('id', invitationId);

      if (error) throw error;

      set(state => ({
        invitations: state.invitations.filter(inv => inv.id !== invitationId),
        isLoading: false,
      }));
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  // Reminder methods
  fetchReminders: async (eventId: string) => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('event_reminders')
        .select('*')
        .eq('event_id', eventId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      set({ reminders: data as EventReminder[], isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  createReminder: async (reminderData) => {
    set({ isLoading: true, error: null });
    try {
      const reminder: EventReminder = {
        ...reminderData,
        id: uuidv4(),
        is_sent: false,
        created_at: new Date().toISOString(),
      };

      const { error } = await supabase
        .from('event_reminders')
        .insert(reminder);

      if (error) throw error;

      set(state => ({
        reminders: [reminder, ...state.reminders],
        isLoading: false,
      }));

      return reminder;
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  updateReminder: async (reminderId, updates) => {
    set({ isLoading: true, error: null });
    try {
      const { error } = await supabase
        .from('event_reminders')
        .update(updates)
        .eq('id', reminderId);

      if (error) throw error;

      set(state => ({
        reminders: state.reminders.map(reminder =>
          reminder.id === reminderId ? { ...reminder, ...updates } : reminder
        ),
        isLoading: false,
      }));
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  deleteReminder: async (reminderId: string) => {
    set({ isLoading: true, error: null });
    try {
      const { error } = await supabase
        .from('event_reminders')
        .delete()
        .eq('id', reminderId);

      if (error) throw error;

      set(state => ({
        reminders: state.reminders.filter(reminder => reminder.id !== reminderId),
        isLoading: false,
      }));
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  // Calendar integration methods
  fetchCalendarIntegrations: async (eventId: string) => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('event_calendar_integrations')
        .select('*')
        .eq('event_id', eventId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      set({ calendarIntegrations: data as CalendarIntegration[], isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  createCalendarIntegration: async (integrationData) => {
    set({ isLoading: true, error: null });
    try {
      const integration: CalendarIntegration = {
        ...integrationData,
        id: uuidv4(),
        sync_status: 'pending',
        created_at: new Date().toISOString(),
      };

      const { error } = await supabase
        .from('event_calendar_integrations')
        .insert(integration);

      if (error) throw error;

      set(state => ({
        calendarIntegrations: [integration, ...state.calendarIntegrations],
        isLoading: false,
      }));

      return integration;
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  updateCalendarIntegration: async (integrationId, updates) => {
    set({ isLoading: true, error: null });
    try {
      const { error } = await supabase
        .from('event_calendar_integrations')
        .update(updates)
        .eq('id', integrationId);

      if (error) throw error;

      set(state => ({
        calendarIntegrations: state.calendarIntegrations.map(integration =>
          integration.id === integrationId ? { ...integration, ...updates } : integration
        ),
        isLoading: false,
      }));
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  deleteCalendarIntegration: async (integrationId: string) => {
    set({ isLoading: true, error: null });
    try {
      const { error } = await supabase
        .from('event_calendar_integrations')
        .delete()
        .eq('id', integrationId);

      if (error) throw error;

      set(state => ({
        calendarIntegrations: state.calendarIntegrations.filter(integration => integration.id !== integrationId),
        isLoading: false,
      }));
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  generateCalendarUrl: async (eventId: string, format: 'google' | 'outlook' | 'ical') => {
    try {
      // This would typically call an edge function to generate calendar URLs
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-calendar-url`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ eventId, format }),
        }
      );

      const data = await response.json();
      if (data.error) throw new Error(data.error);
      
      return data.url;
    } catch (error: any) {
      set({ error: error.message });
      throw error;
    }
  },
}));