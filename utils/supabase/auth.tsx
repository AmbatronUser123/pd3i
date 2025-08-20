import { supabase } from './client';
import { toast } from 'sonner';

/**
 * Sign in a user with email and password
 */
export async function signIn(email: string, password: string) {
  try {
    // Sign in the user
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error('Error signing in:', error);
      toast.error(`Login failed: ${error.message}`);
      return null;
    }

    // Fetch the user's profile data
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('username, puskesmas, location')
      .eq('id', data.user.id)
      .single();

    if (profileError) {
      console.error('Error fetching profile:', profileError);
      // Don't fail login if profile fetch fails, just log it
    }

    return {
      ...data.user,
      username: profileData?.username || null,
      puskesmas: profileData?.puskesmas || null,
      location: profileData?.location || null
    };
  } catch (error: any) {
    console.error('Unexpected error during sign in:', error);
    toast.error(`Unexpected error: ${error.message}`);
    return null;
  }
}

/**
 * Sign up a new user with email and password
 */
export async function signUp(
  email: string,
  password: string,
  username: string,
  puskesmas: string,
  location: string
) {
  try {
    // Create the user in auth
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username,
          puskesmas,
          location,
        },
      },
    });

    if (error) {
      console.error('Error signing up:', error);
      toast.error(`Registrasi gagal: ${error.message}`);
      return null;
    }

    // Create the user profile in the profiles table
    if (data.user) {
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert([
          {
            id: data.user.id,
            username,
            puskesmas,
            location,
            updated_at: new Date().toISOString()
          }
        ]);

      if (profileError) {
        console.error('Error creating profile:', profileError);
        toast.warning('Akun berhasil dibuat, tetapi ada masalah dengan penyimpanan profil. Silakan hubungi admin.');
      }
    }

    return data.user;
  } catch (error: any) {
    console.error('Unexpected error during sign up:', error);
    toast.error(`Terjadi kesalahan: ${error.message}`);
    return null;
  }
}

/**
 * Sign out the current user
 */
export async function signOut() {
  try {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error('Error signing out:', error);
      toast.error(`Sign out failed: ${error.message}`);
      return false;
    }

    return true;
  } catch (error: any) {
    console.error('Unexpected error during sign out:', error);
    toast.error(`Unexpected error: ${error.message}`);
    return false;
  }
}

/**
 * Get the current user session
 */
export async function getCurrentSession() {
  try {
    const { data, error } = await supabase.auth.getSession();

    if (error) {
      console.error('Error getting session:', error);
      return null;
    }

    return data.session;
  } catch (error: any) {
    console.error('Unexpected error getting session:', error);
    return null;
  }
}

/**
 * Get the current user
 */
export async function getCurrentUser() {
  try {
    const { data, error } = await supabase.auth.getUser();

    if (error) {
      console.error('Error getting user:', error);
      return null;
    }

    return data.user;
  } catch (error: any) {
    console.error('Unexpected error getting user:', error);
    return null;
  }
}

/**
 * Reset password for a user
 */
export async function resetPassword(email: string) {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) {
      console.error('Error resetting password:', error);
      toast.error(`Password reset failed: ${error.message}`);
      return false;
    }

    toast.success('Password reset email sent');
    return true;
  } catch (error: any) {
    console.error('Unexpected error during password reset:', error);
    toast.error(`Unexpected error: ${error.message}`);
    return false;
  }
}

/**
 * Update user password
 */
export async function updatePassword(password: string) {
  try {
    const { error } = await supabase.auth.updateUser({
      password,
    });

    if (error) {
      console.error('Error updating password:', error);
      toast.error(`Password update failed: ${error.message}`);
      return false;
    }

    toast.success('Password updated successfully');
    return true;
  } catch (error: any) {
    console.error('Unexpected error updating password:', error);
    toast.error(`Unexpected error: ${error.message}`);
    return false;
  }
}