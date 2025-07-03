import { supabase } from '../lib/supabase';

export const checkDatabaseSchema = async () => {
  try {
    console.log('🔍 Checking database schema...');
    
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

export const checkRequiredColumns = async () => {
  try {
    console.log('🔍 Checking required columns...');
    
    // Test each column individually by trying to select it
    const requiredColumns = ['description', 'is_public', 'max_guests', 'rsvp_deadline'];
    const missingColumns = [];
    
    for (const column of requiredColumns) {
      try {
        const { error } = await supabase
          .from('events')
          .select(column)
          .limit(1);
        
        if (error && error.message.includes('column')) {
          missingColumns.push(column);
        }
      } catch (err) {
        missingColumns.push(column);
      }
    }
    
    if (missingColumns.length > 0) {
      return {
        success: false,
        missingColumns,
        error: `Missing columns: ${missingColumns.join(', ')}`,
        needsMigration: true
      };
    }
    
    return { success: true, message: 'All required columns exist' };
    
  } catch (error: any) {
    console.error('❌ Error checking columns:', error);
    return { success: false, error: error.message };
  }
};