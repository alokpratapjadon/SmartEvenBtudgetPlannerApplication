import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { v4 as uuidv4 } from 'uuid';

export interface Event {
  id: string;
  title: string;
  type: string;
  date: string;
  location: string;
  budget: number;
  guestCount: number;
  userId: string;
  createdAt: string;
  description?: string;
  is_public?: boolean;
  max_guests?: number;
  rsvp_deadline?: string;
}

export interface BudgetCategory {
  id: string;
  name: string;
  percentage: number;
  amount: number;
  eventId: string;
}

export interface Expense {
  id: string;
  description: string;
  amount: number;
  date: string;
  categoryId: string;
  eventId: string;
  receiptUrl?: string;
}

interface EventState {
  events: Event[];
  currentEvent: Event | null;
  budgetCategories: BudgetCategory[];
  expenses: Expense[];
  isLoading: boolean;
  error: string | null;

  fetchEvents: () => Promise<void>;
  fetchEvent: (id: string) => Promise<void>;
  createEvent: (event: Omit<Event, 'id' | 'userId' | 'createdAt'>) => Promise<Event>;
  fetchBudgetCategories: (eventId: string) => Promise<void>;
  createBudgetCategories: (categories: Omit<BudgetCategory, 'id'>[]) => Promise<void>;
  fetchExpenses: (eventId: string) => Promise<void>;
  createExpense: (expense: Omit<Expense, 'id'>) => Promise<Expense>;
  getAIBudgetSuggestion: (event: Omit<Event, 'id' | 'userId' | 'createdAt'>) => Promise<BudgetCategory[]>;
}

export const useEventStore = create<EventState>((set, get) => ({
  events: [],
  currentEvent: null,
  budgetCategories: [],
  expenses: [],
  isLoading: false,
  error: null,

  fetchEvents: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('createdAt', { ascending: false });

      if (error) throw error;
      set({ events: data as Event[], isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  fetchEvent: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      set({ currentEvent: data as Event, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  createEvent: async (eventData) => {
    set({ isLoading: true, error: null });
    try {
      const user = await supabase.auth.getUser();
      const userId = user.data.user?.id;
      
      if (!userId) throw new Error('User not authenticated');
      
      const event: Event = {
        ...eventData,
        id: uuidv4(),
        userId,
        createdAt: new Date().toISOString(),
      };

      const { error } = await supabase.from('events').insert(event);
      if (error) throw error;

      set((state) => ({
        events: [event, ...state.events],
        currentEvent: event,
        isLoading: false,
      }));
      
      return event;
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  fetchBudgetCategories: async (eventId: string) => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('budget_categories')
        .select('*')
        .eq('eventId', eventId);

      if (error) throw error;
      set({ budgetCategories: data as BudgetCategory[], isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  createBudgetCategories: async (categories) => {
    set({ isLoading: true, error: null });
    try {
      const categoriesWithIds = categories.map(category => ({
        ...category,
        id: uuidv4(),
      }));

      const { error } = await supabase
        .from('budget_categories')
        .insert(categoriesWithIds);

      if (error) throw error;

      set((state) => ({
        budgetCategories: [...categoriesWithIds, ...state.budgetCategories],
        isLoading: false,
      }));
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  fetchExpenses: async (eventId: string) => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('expenses')
        .select('*')
        .eq('eventId', eventId)
        .order('date', { ascending: false });

      if (error) throw error;
      set({ expenses: data as Expense[], isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  createExpense: async (expenseData) => {
    set({ isLoading: true, error: null });
    try {
      const expense: Expense = {
        ...expenseData,
        id: uuidv4(),
      };

      const { error } = await supabase.from('expenses').insert(expense);
      if (error) throw error;

      set((state) => ({
        expenses: [expense, ...state.expenses],
        isLoading: false,
      }));
      
      return expense;
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  // Mock AI budget suggestion (in a real app, this would call a GPT-4 API)
  getAIBudgetSuggestion: async (event) => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Default categories based on event type
    let categories: Omit<BudgetCategory, 'id'>[] = [];
    const eventId = get().currentEvent?.id || '';
    
    switch (event.type) {
      case 'wedding':
        categories = [
          { name: 'Venue', percentage: 30, amount: event.budget * 0.3, eventId },
          { name: 'Catering', percentage: 25, amount: event.budget * 0.25, eventId },
          { name: 'Photography', percentage: 12, amount: event.budget * 0.12, eventId },
          { name: 'Attire', percentage: 10, amount: event.budget * 0.1, eventId },
          { name: 'Decoration', percentage: 8, amount: event.budget * 0.08, eventId },
          { name: 'Entertainment', percentage: 8, amount: event.budget * 0.08, eventId },
          { name: 'Transportation', percentage: 3, amount: event.budget * 0.03, eventId },
          { name: 'Miscellaneous', percentage: 4, amount: event.budget * 0.04, eventId },
        ];
        break;
      case 'party':
        categories = [
          { name: 'Venue', percentage: 25, amount: event.budget * 0.25, eventId },
          { name: 'Food & Drinks', percentage: 35, amount: event.budget * 0.35, eventId },
          { name: 'Entertainment', percentage: 15, amount: event.budget * 0.15, eventId },
          { name: 'Decoration', percentage: 10, amount: event.budget * 0.1, eventId },
          { name: 'Invitations', percentage: 5, amount: event.budget * 0.05, eventId },
          { name: 'Miscellaneous', percentage: 10, amount: event.budget * 0.1, eventId },
        ];
        break;
      case 'trip':
        categories = [
          { name: 'Accommodation', percentage: 35, amount: event.budget * 0.35, eventId },
          { name: 'Transportation', percentage: 25, amount: event.budget * 0.25, eventId },
          { name: 'Food', percentage: 20, amount: event.budget * 0.2, eventId },
          { name: 'Activities', percentage: 15, amount: event.budget * 0.15, eventId },
          { name: 'Miscellaneous', percentage: 5, amount: event.budget * 0.05, eventId },
        ];
        break;
      default:
        categories = [
          { name: 'Main Expenses', percentage: 70, amount: event.budget * 0.7, eventId },
          { name: 'Secondary Expenses', percentage: 20, amount: event.budget * 0.2, eventId },
          { name: 'Miscellaneous', percentage: 10, amount: event.budget * 0.1, eventId },
        ];
    }
    
    return categories.map(category => ({ ...category, id: uuidv4() }));
  },
}));