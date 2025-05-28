import { create } from 'zustand';
import { supabase } from '../lib/supabase';

interface User {
  id: string;
  email: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  initializeAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  
  signIn: async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (!error && data?.user) {
        set({ 
          user: { 
            id: data.user.id, 
            email: data.user.email as string 
          }, 
          isAuthenticated: true 
        });
      }
      
      return { error };
    } catch (error) {
      return { error };
    }
  },
  
  signUp: async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });
      
      if (!error && data?.user) {
        // Immediately sign in the user after successful signup
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (!signInError) {
          set({ 
            user: { 
              id: data.user.id, 
              email: data.user.email as string 
            }, 
            isAuthenticated: true 
          });
        }

        return { error: signInError };
      }
      
      return { error };
    } catch (error) {
      return { error };
    }
  },
  
  signOut: async () => {
    try {
      await supabase.auth.signOut();
      set({ user: null, isAuthenticated: false });
    } catch (error) {
      console.error('Error signing out:', error);
    }
  },
  
  initializeAuth: async () => {
    set({ isLoading: true });
    
    try {
      // Check for existing session
      const { data } = await supabase.auth.getSession();
      
      if (data?.session?.user) {
        set({ 
          user: { 
            id: data.session.user.id, 
            email: data.session.user.email as string 
          }, 
          isAuthenticated: true 
        });
      }
      
      // Listen for auth changes
      supabase.auth.onAuthStateChange((_, session) => {
        if (session?.user) {
          set({ 
            user: { 
              id: session.user.id, 
              email: session.user.email as string 
            }, 
            isAuthenticated: true 
          });
        } else {
          set({ user: null, isAuthenticated: false });
        }
      });
    } catch (error) {
      console.error('Error initializing auth:', error);
    } finally {
      set({ isLoading: false });
    }
  },
}));