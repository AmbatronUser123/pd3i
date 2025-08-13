import { supabase } from './client';

/**
 * Test the Supabase connection
 * Run this function to verify that your Supabase connection is working properly
 */
export async function testSupabaseConnection() {
  try {
    // Simple query to test the connection
    const { data, error } = await supabase.from('profiles').select('count', { count: 'exact', head: true });
    
    if (error) {
      console.error('Supabase connection test failed:', error);
      return {
        success: false,
        message: `Connection failed: ${error.message}`,
        error
      };
    }
    
    console.log('Supabase connection successful!');
    return {
      success: true,
      message: 'Connection successful!'
    };
  } catch (error: any) {
    console.error('Unexpected error testing Supabase connection:', error);
    return {
      success: false,
      message: `Unexpected error: ${error.message}`,
      error
    };
  }
}

/**
 * Get Supabase project information
 * Returns information about the current Supabase project configuration
 */
export function getSupabaseInfo() {
  return {
    projectUrl: supabase.supabaseUrl,
    projectId: supabase.supabaseUrl.split('https://')[1].split('.')[0],
    authEnabled: true,
    storageEnabled: true
  };
}
