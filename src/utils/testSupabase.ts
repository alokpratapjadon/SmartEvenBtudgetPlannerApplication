import { supabase } from '../lib/supabase';

export const testSupabaseConnection = async () => {
  try {
    console.log('Testing Supabase connection...');
    
    // Test 1: Check if we can connect to Supabase
    const { data: healthCheck, error: healthError } = await supabase
      .from('users')
      .select('count')
      .limit(1);
    
    if (healthError) {
      console.error('Supabase connection failed:', healthError);
      return { success: false, error: healthError.message };
    }
    
    console.log('✅ Supabase connection successful');
    
    // Test 2: Check current user session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) {
      console.error('Session check failed:', sessionError);
      return { success: false, error: sessionError.message };
    }
    
    if (!session) {
      console.log('❌ No active session');
      return { success: false, error: 'No active session' };
    }
    
    console.log('✅ Active session found:', session.user.email);
    
    // Test 3: Check events table structure
    const { data: eventsTest, error: eventsError } = await supabase
      .from('events')
      .select('*')
      .limit(1);
    
    if (eventsError) {
      console.error('Events table access failed:', eventsError);
      return { success: false, error: eventsError.message };
    }
    
    console.log('✅ Events table accessible');
    
    // Test 4: Check if user profile exists
    const { data: userProfile, error: profileError } = await supabase
      .from('users')
      .select('*')
      .eq('id', session.user.id)
      .maybeSingle();
    
    if (profileError) {
      console.error('User profile check failed:', profileError);
      return { success: false, error: profileError.message };
    }
    
    if (!userProfile) {
      console.log('⚠️ User profile not found, creating...');
      
      // Create user profile
      const { error: createError } = await supabase
        .from('users')
        .insert({
          id: session.user.id,
          email: session.user.email!,
          full_name: session.user.user_metadata?.full_name || session.user.email!.split('@')[0],
        });
      
      if (createError) {
        console.error('Failed to create user profile:', createError);
        return { success: false, error: createError.message };
      }
      
      console.log('✅ User profile created');
    } else {
      console.log('✅ User profile exists');
    }
    
    return { success: true, message: 'All tests passed' };
    
  } catch (error: any) {
    console.error('Unexpected error:', error);
    return { success: false, error: error.message };
  }
};

export const testEventCreation = async () => {
  try {
    console.log('Testing event creation...');
    
    const testEvent = {
      title: 'Test Event',
      type: 'party',
      date: '2024-12-31',
      location: 'Test Location',
      budget: 1000,
      guestCount: 50,
      description: 'This is a test event',
      is_public: false,
      max_guests: 100,
      rsvp_deadline: '2024-12-25',
    };
    
    const { data, error } = await supabase
      .from('events')
      .insert(testEvent)
      .select()
      .single();
    
    if (error) {
      console.error('Event creation failed:', error);
      return { success: false, error: error.message };
    }
    
    console.log('✅ Test event created successfully:', data);
    
    // Clean up - delete the test event
    await supabase
      .from('events')
      .delete()
      .eq('id', data.id);
    
    console.log('✅ Test event cleaned up');
    
    return { success: true, data };
    
  } catch (error: any) {
    console.error('Unexpected error during event creation test:', error);
    return { success: false, error: error.message };
  }
};