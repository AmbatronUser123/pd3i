import { createClient } from '@supabase/supabase-js';
import { projectId, publicAnonKey } from './info';
import { toast } from 'sonner';

const supabaseUrl = `https://${projectId}.supabase.co`;
const supabase = createClient(supabaseUrl, publicAnonKey);

// Generic type for database operations
export type DatabaseRecord = Record<string, any>;

/**
 * Create a new record in the specified table
 */
export async function createRecord<T extends DatabaseRecord>(
  table: string,
  data: T
): Promise<T | null> {
  try {
    const { data: record, error } = await supabase
      .from(table)
      .insert([data])
      .select()
      .single();

    if (error) {
      console.error(`Error creating ${table} record:`, error);
      toast.error(`Failed to create ${table}: ${error.message}`);
      return null;
    }

    return record as T;
  } catch (error: any) {
    console.error(`Error in createRecord for ${table}:`, error);
    toast.error(`Unexpected error: ${error.message}`);
    return null;
  }
}

/**
 * Get a record by ID from the specified table
 */
export async function getRecordById<T extends DatabaseRecord>(
  table: string,
  id: string
): Promise<T | null> {
  try {
    const { data, error } = await supabase
      .from(table)
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error(`Error fetching ${table} record:`, error);
      return null;
    }

    return data as T;
  } catch (error: any) {
    console.error(`Error in getRecordById for ${table}:`, error);
    return null;
  }
}

/**
 * Query records from the specified table with filters
 */
export async function queryRecords<T extends DatabaseRecord>(
  table: string,
  filters?: Record<string, any>,
  options?: {
    limit?: number;
    offset?: number;
    orderBy?: { column: string; ascending?: boolean };
  }
): Promise<T[]> {
  try {
    let query = supabase.from(table).select('*');

    // Apply filters if provided
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        query = query.eq(key, value);
      });
    }

    // Apply ordering if provided
    if (options?.orderBy) {
      const { column, ascending = true } = options.orderBy;
      query = query.order(column, { ascending });
    }

    // Apply pagination if provided
    if (options?.limit) {
      query = query.limit(options.limit);
    }

    if (options?.offset) {
      query = query.range(options.offset, options.offset + (options.limit || 10) - 1);
    }

    const { data, error } = await query;

    if (error) {
      console.error(`Error querying ${table} records:`, error);
      return [];
    }

    return data as T[];
  } catch (error: any) {
    console.error(`Error in queryRecords for ${table}:`, error);
    return [];
  }
}

/**
 * Update a record in the specified table
 */
export async function updateRecord<T extends DatabaseRecord>(
  table: string,
  id: string,
  data: Partial<T>
): Promise<boolean> {
  try {
    const { error } = await supabase
      .from(table)
      .update(data)
      .eq('id', id);

    if (error) {
      console.error(`Error updating ${table} record:`, error);
      toast.error(`Failed to update ${table}: ${error.message}`);
      return false;
    }

    return true;
  } catch (error: any) {
    console.error(`Error in updateRecord for ${table}:`, error);
    toast.error(`Unexpected error: ${error.message}`);
    return false;
  }
}

/**
 * Delete a record from the specified table
 */
export async function deleteRecord(
  table: string,
  id: string
): Promise<boolean> {
  try {
    const { error } = await supabase
      .from(table)
      .delete()
      .eq('id', id);

    if (error) {
      console.error(`Error deleting ${table} record:`, error);
      toast.error(`Failed to delete ${table}: ${error.message}`);
      return false;
    }

    return true;
  } catch (error: any) {
    console.error(`Error in deleteRecord for ${table}:`, error);
    toast.error(`Unexpected error: ${error.message}`);
    return false;
  }
}

/**
 * Upload a file to Supabase storage
 */
export async function uploadFile(
  bucket: string,
  path: string,
  file: File
): Promise<string | null> {
  try {
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, file, {
        cacheControl: '3600',
        upsert: true,
      });

    if (error) {
      console.error('Error uploading file:', error);
      toast.error(`Failed to upload file: ${error.message}`);
      return null;
    }

    // Return the public URL
    const { data: publicUrlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(data.path);

    return publicUrlData.publicUrl;
  } catch (error: any) {
    console.error('Error in uploadFile:', error);
    toast.error(`Unexpected error: ${error.message}`);
    return null;
  }
}

/**
 * Delete a file from Supabase storage
 */
export async function deleteFile(
  bucket: string,
  path: string
): Promise<boolean> {
  try {
    const { error } = await supabase.storage
      .from(bucket)
      .remove([path]);

    if (error) {
      console.error('Error deleting file:', error);
      toast.error(`Failed to delete file: ${error.message}`);
      return false;
    }

    return true;
  } catch (error: any) {
    console.error('Error in deleteFile:', error);
    toast.error(`Unexpected error: ${error.message}`);
    return false;
  }
}

/**
 * Get a public URL for a file in Supabase storage
 */
export function getPublicUrl(bucket: string, path: string): string {
  const { data } = supabase.storage
    .from(bucket)
    .getPublicUrl(path);

  return data.publicUrl;
}

/**
 * Create a real-time subscription to a table
 */
export function subscribeToTable(
  table: string,
  callback: (payload: any) => void,
  event: 'INSERT' | 'UPDATE' | 'DELETE' | '*' = '*'
) {
  const subscription = supabase
    .channel(`${table}-changes`)
    .on(
      'postgres_changes',
      { event, schema: 'public', table },
      (payload) => {
        callback(payload);
      }
    )
    .subscribe();

  // Return a function to unsubscribe
  return () => {
    supabase.removeChannel(subscription);
  };
}
