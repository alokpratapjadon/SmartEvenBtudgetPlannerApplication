import { create } from 'zustand';
import { supabase } from '../lib/supabase';

interface User {
  id: string;
  email: string;
  full_name?: string;
  profile_image_url?: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  initializeAuth: () => Promise<void>;
  updateProfile: (fullName: string, profileImageUrl?: string) => Promise<{ error: any }>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
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
        // Fetch user profile - use maybeSingle() to handle missing profiles gracefully
        const { data: profile } = await supabase
          .from('users')
          .select('*')
          .eq('id', data.user.id)
          .maybeSingle();
        
        set({ 
          user: { 
            id: data.user.id, 
            email: data.user.email as string,
            full_name: profile?.full_name,
            profile_image_url: profile?.profile_image_url
          }, 
          isAuthenticated: true 
        });
      }
      
      return { error };
    } catch (error) {
      return { error };
    }
  },
  
  signUp: async (email, password, fullName) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });
      
      if (!error && data?.user) {
        // Create user profile
        const { error: profileError } = await supabase
          .from('users')
          .insert({
            id: data.user.id,
            email: data.user.email as string,
            full_name: fullName,
          });

        if (profileError) {
          console.error('Error creating profile:', profileError);
        }

        // Immediately sign in the user after successful signup
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (!signInError) {
          set({ 
            user: { 
              id: data.user.id, 
              email: data.user.email as string,
              full_name: fullName
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

  updateProfile: async (fullName: string, profileImageUrl?: string) => {
    try {
      const user = get().user;
      if (!user) throw new Error('No user logged in');

      const updateData: any = { full_name: fullName };
      if (profileImageUrl) {
        updateData.profile_image_url = profileImageUrl;
      }

      const { error } = await supabase
        .from('users')
        .update(updateData)
        .eq('id', user.id);

      if (!error) {
        set(state => ({
          user: state.user ? { 
            ...state.user, 
            full_name: fullName,
            ...(profileImageUrl && { profile_image_url: profileImageUrl })
          } : null
        }));
      }

      return { error };
    } catch (error) {
      return { error };
    }
  },
  
  initializeAuth: async () => {
    set({ isLoading: true });
    
    try {
      // Check for existing session
      const { data } = await supabase.auth.getSession();
      
      if (data?.session?.user) {
        // Fetch user profile - use maybeSingle() to handle missing profiles gracefully
        const { data: profile } = await supabase
          .from('users')
          .select('*')
          .eq('id', data.session.user.id)
          .maybeSingle();

        set({ 
          user: { 
            id: data.session.user.id, 
            email: data.session.user.email as string,
            full_name: profile?.full_name,
            profile_image_url: profile?.profile_image_url
          }, 
          isAuthenticated: true 
        });
      }
      
      // Listen for auth changes
      supabase.auth.onAuthStateChange(async (_, session) => {
        if (session?.user) {
          // Fetch user profile - use maybeSingle() to handle missing profiles gracefully
          const { data: profile } = await supabase
            .from('users')
            .select('*')
            .eq('id', session.user.id)
            .maybeSingle();

          set({ 
            user: { 
              id: session.user.id, 
              email: session.user.email as string,
              full_name: profile?.full_name,
              profile_image_url: profile?.profile_image_url
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