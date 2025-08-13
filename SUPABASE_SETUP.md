# Supabase Setup Guide for SPASI Mobile Health System

This guide will help you set up Supabase as the backend for the SPASI Mobile Health System application.

## Prerequisites

- A Supabase account (sign up at [supabase.com](https://supabase.com))
- Node.js and npm installed
- Git (to clone the repository)

## Step 1: Create a Supabase Project

1. Log in to your Supabase account
2. Click on "New Project"
3. Enter a name for your project (e.g., "spasi-health")
4. Set a secure database password
5. Choose a region closest to your users
6. Click "Create new project"

## Step 2: Set Up Authentication

1. In your Supabase dashboard, go to "Authentication" → "Settings"
2. Under "Email Auth", ensure it's enabled
3. Configure any additional auth providers as needed
4. Set up email templates for verification, password reset, etc.

## Step 3: Create Database Tables

Execute the following SQL in the Supabase SQL Editor to create the necessary tables:

```sql
-- Create profiles table
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  username TEXT,
  puskesmas TEXT,
  location TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create kasus table for case reporting
CREATE TABLE public.kasus (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  disease TEXT NOT NULL,
  form TEXT NOT NULL,
  status TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id),
  
  -- Info Pelapor
  pelapor_nama TEXT,
  pelapor_jabatan TEXT,
  pelapor_telp TEXT,
  pelapor_email TEXT,
  tanggal_lapor TIMESTAMP WITH TIME ZONE,
  
  -- Info Kasus
  pasien_nama TEXT,
  pasien_nik TEXT,
  pasien_tgl_lahir DATE,
  pasien_umur TEXT,
  pasien_jk TEXT,
  pasien_alamat TEXT,
  pasien_rt_rw TEXT,
  pasien_kelurahan TEXT,
  pasien_kecamatan TEXT,
  
  -- Info Klinis
  tanggal_onset DATE,
  gejala_demam TEXT,
  gejala_ruam TEXT,
  gejala_batuk TEXT,
  gejala_pilek TEXT,
  gejala_mata_merah TEXT,
  gejala_lain TEXT,
  
  -- Riwayat Pengobatan
  sedang_dirawat TEXT,
  rumah_sakit TEXT,
  tanggal_dirawat DATE,
  obat_yang_diminum TEXT,
  riwayat_rawat_inap TEXT,
  
  -- Riwayat Vaksinasi
  status_imunisasi TEXT,
  vaksin_terakhir TEXT,
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  submitted_at TIMESTAMP WITH TIME ZONE
);

-- Create storage bucket for file uploads
INSERT INTO storage.buckets (id, name) VALUES ('spasi-files', 'spasi-files');

-- Set up Row Level Security (RLS) policies
-- Profiles: Users can read all profiles but only update their own
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view all profiles" 
  ON public.profiles FOR SELECT 
  USING (true);

CREATE POLICY "Users can update own profile" 
  ON public.profiles FOR UPDATE 
  USING (auth.uid() = id);

-- Kasus: Users can CRUD their own cases, read cases from their puskesmas
ALTER TABLE public.kasus ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own cases" 
  ON public.kasus FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own cases" 
  ON public.kasus FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own cases" 
  ON public.kasus FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own cases" 
  ON public.kasus FOR DELETE 
  USING (auth.uid() = user_id);
```

## Step 4: Set Up Storage

1. Go to "Storage" in your Supabase dashboard
2. You should see the "spasi-files" bucket created from the SQL above
3. Configure CORS settings if needed

## Step 5: Get API Keys

1. Go to "Settings" → "API" in your Supabase dashboard
2. Copy the "Project URL" and "anon public" key
3. Update these values in your application's `utils/supabase/info.tsx` file

## Step 6: Update Application Configuration

Update the Supabase configuration in your application:

1. Open `utils/supabase/info.tsx`
2. Replace the existing values with your Supabase project details:

```typescript
export const projectId = "your-project-id"; // From the URL: https://your-project-id.supabase.co
export const publicAnonKey = "your-anon-key"; // The "anon public" key from the API settings
```

## Step 7: Test the Connection

1. Start your application
2. Try to register a new user
3. Verify that the user is created in Supabase Auth
4. Test other functionality like form submission

## Troubleshooting

- **Authentication Issues**: Check the browser console for errors. Verify your API keys are correct.
- **Database Errors**: Check the RLS policies to ensure users have the correct permissions.
- **CORS Errors**: Configure CORS settings in Supabase if needed.

## Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript/introduction)
- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)