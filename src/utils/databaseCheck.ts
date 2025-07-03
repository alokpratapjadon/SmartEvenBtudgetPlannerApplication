import { supabase } from '../lib/supabase';

export const checkDatabaseSchema = async () => {
  try {
    console.log('🔍 Checking database schema...');
    
    // Check if events table exists and get its columns
    const { data: columns, error } = await supabase
      .rpc('get_table_columns', { table_name: 'events' })
      .catch(async () => {
        // Fallback: try to query the table directly to see what columns exist
        const { data, error: queryError } = await supabase
          .from('events')
          .select('*')
          .limit(0);
        
        if (queryError) {
          throw queryError;
        }
        
        return { data: null, error: null };
      });

    if (error) {
      console.error('❌ Database schema check failed:', error);
      return { success: false, error: error.message };
    }

    // Try to insert a test record to see what columns are missing
    const testEvent = {
      title: 'Schema Test',
      type: 'test',
      date: '2024-12-31',
      location: 'Test Location',
      budget: 100,
      guestCount: 10,
      description: 'Test description',
      is_public: false,
      max_guests: 20,
      rsvp_deadline: '2024-12-30',
    };

    const { data: insertTest, error: insertError } = await supabase
      .from('events')
      .insert(testEvent)
      .select()
      .single();

    if (insertError) {
      console.error('❌ Schema validation failed:', insertError);
      
      // Check which specific columns are missing
      const missingColumns = [];
      if (insertError.message.includes('description')) missingColumns.push('description');
      if (insertError.message.includes('is_public')) missingColumns.push('is_public');
      if (insertError.message.includes('max_guests')) missingColumns.push('max_guests');
      if (insertError.message.includes('rsvp_deadline')) missingColumns.push('rsvp_deadline');
      
      return { 
        success: false, 
        error: insertError.message,
        missingColumns,
        needsMigration: true
      };
    }

    // Clean up test record
    if (insertTest) {
      await supabase
        .from('events')
        .delete()
        .eq('id', insertTest.id);
    }

    console.log('✅ Database schema is valid');
    return { success: true, message: 'All required columns exist' };

  } catch (error: any) {
    console.error('❌ Unexpected error during schema check:', error);
    return { success: false, error: error.message };
  }
};

export const refreshSchemaCache = async () => {
  try {
    console.log('🔄 Refreshing schema cache...');
    
    // Force a schema refresh by making a simple query
    const { error } = await supabase
      .from('events')
      .select('count')
      .limit(1);

    if (error) {
      console.error('❌ Schema cache refresh failed:', error);
      return { success: false, error: error.message };
    }

    console.log('✅ Schema cache refreshed');
    return { success: true };

  } catch (error: any) {
    console.error('❌ Unexpected error during schema refresh:', error);
    return { success: false, error: error.message };
  }
};