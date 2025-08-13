-- Drop existing table if it exists (BE CAREFUL - this will delete all data!)
-- DROP TABLE IF EXISTS kasus_mr01 CASCADE;

-- Create table for kasus MR01 (Measles/Rubella case reporting)
CREATE TABLE IF NOT EXISTS kasus_mr01 (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  disease VARCHAR(50) NOT NULL,
  form VARCHAR(50) NOT NULL,
  status VARCHAR(20) NOT NULL CHECK (status IN ('draft', 'submitted')),
  user_id UUID NOT NULL,
  
  -- Info Pelapor
  pelapor_nama TEXT,
  pelapor_jabatan TEXT,
  pelapor_telp TEXT,
  pelapor_email TEXT,
  tanggal_lapor DATE,
  
  -- Info Kasus
  pasien_nama TEXT,
  pasien_nik TEXT,
  pasien_tgl_lahir DATE,
  pasien_umur INTEGER,
  pasien_jk VARCHAR(10),
  pasien_alamat TEXT,
  pasien_rt_rw TEXT,
  pasien_kelurahan TEXT,
  pasien_kecamatan TEXT,
  
  -- Info Klinis
  tanggal_onset DATE,
  gejala_demam VARCHAR(10),
  gejala_ruam VARCHAR(10),
  gejala_batuk VARCHAR(10),
  gejala_pilek VARCHAR(10),
  gejala_mata_merah VARCHAR(10),
  gejala_lain TEXT,
  
  -- Riwayat Pengobatan
  sedang_dirawat VARCHAR(10),
  rumah_sakit TEXT,
  tanggal_dirawat DATE,
  obat_yang_diminum TEXT,
  riwayat_rawat_inap VARCHAR(10),
  
  -- Riwayat Vaksinasi
  status_imunisasi VARCHAR(10),
  vaksin_terakhir TEXT,
  tanggal_vaksin_terakhir DATE,
  tempat_imunisasi TEXT,
  catatan_imunisasi TEXT,
  
  -- Info Epidemiologis
  kontak_kasus_lain VARCHAR(10),
  bepergian_2_minggu VARCHAR(10),
  tempat_bepergian TEXT,
  tanggal_bepergian DATE,
  sumber_infeksi TEXT,
  
  -- Info Spesimen
  spesimen_diambil VARCHAR(10),
  jenis_spesimen TEXT,
  tanggal_pengambilan DATE,
  tempat_pemeriksaan TEXT,
  hasil_lab TEXT,
  
  -- Info Akhir Kasus
  klasifikasi_akhir TEXT,
  kondisi_akhir TEXT,
  tanggal_meninggal DATE,
  penyebab_kematian TEXT,
  tindak_lanjut TEXT,
  
  -- Info Kontak Erat
  jumlah_kontak INTEGER,
  kontak_keluarga INTEGER,
  kontak_sekolah INTEGER,
  kontak_lain INTEGER,
  catatan_kontak TEXT,
  
  -- Info Pelaksana
  petugas_nama TEXT,
  petugas_nip TEXT,
  petugas_jabatan TEXT,
  tanggal_pengisian DATE,
  tanda_tangan TEXT,
  koordinat_lokasi TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_modified TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  pending_sync BOOLEAN DEFAULT FALSE
);

-- Add missing columns if table already exists
DO $$ 
BEGIN
    -- Add user_id column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'kasus_mr01' AND column_name = 'user_id') THEN
        ALTER TABLE kasus_mr01 ADD COLUMN user_id UUID;
    END IF;
    
    -- Add other missing columns
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'kasus_mr01' AND column_name = 'disease') THEN
        ALTER TABLE kasus_mr01 ADD COLUMN disease VARCHAR(50);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'kasus_mr01' AND column_name = 'form') THEN
        ALTER TABLE kasus_mr01 ADD COLUMN form VARCHAR(50);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'kasus_mr01' AND column_name = 'status') THEN
        ALTER TABLE kasus_mr01 ADD COLUMN status VARCHAR(20);
    END IF;
    
    -- Add all other columns if they don't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'kasus_mr01' AND column_name = 'pelapor_nama') THEN
        ALTER TABLE kasus_mr01 ADD COLUMN pelapor_nama TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'kasus_mr01' AND column_name = 'pasien_nama') THEN
        ALTER TABLE kasus_mr01 ADD COLUMN pasien_nama TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'kasus_mr01' AND column_name = 'created_at') THEN
        ALTER TABLE kasus_mr01 ADD COLUMN created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'kasus_mr01' AND column_name = 'updated_at') THEN
        ALTER TABLE kasus_mr01 ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'kasus_mr01' AND column_name = 'last_modified') THEN
        ALTER TABLE kasus_mr01 ADD COLUMN last_modified TIMESTAMP WITH TIME ZONE DEFAULT NOW();
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'kasus_mr01' AND column_name = 'pending_sync') THEN
        ALTER TABLE kasus_mr01 ADD COLUMN pending_sync BOOLEAN DEFAULT FALSE;
    END IF;
    
END $$;

-- Create indexes for better performance (ignore if already exist)
CREATE INDEX IF NOT EXISTS idx_kasus_mr01_user_id ON kasus_mr01(user_id);
CREATE INDEX IF NOT EXISTS idx_kasus_mr01_status ON kasus_mr01(status);
CREATE INDEX IF NOT EXISTS idx_kasus_mr01_created_at ON kasus_mr01(created_at);
CREATE INDEX IF NOT EXISTS idx_kasus_mr01_disease ON kasus_mr01(disease);

-- Enable Row Level Security (RLS)
ALTER TABLE kasus_mr01 ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their own cases" ON kasus_mr01;
DROP POLICY IF EXISTS "Users can insert their own cases" ON kasus_mr01;
DROP POLICY IF EXISTS "Users can update their own cases" ON kasus_mr01;
DROP POLICY IF EXISTS "Users can delete their own cases" ON kasus_mr01;

-- Create policy to allow users to see only their own cases
CREATE POLICY "Users can view their own cases" ON kasus_mr01
  FOR SELECT USING (auth.uid() = user_id);

-- Create policy to allow users to insert their own cases
CREATE POLICY "Users can insert their own cases" ON kasus_mr01
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create policy to allow users to update their own cases
CREATE POLICY "Users can update their own cases" ON kasus_mr01
  FOR UPDATE USING (auth.uid() = user_id);

-- Create policy to allow users to delete their own cases
CREATE POLICY "Users can delete their own cases" ON kasus_mr01
  FOR DELETE USING (auth.uid() = user_id);

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS update_kasus_mr01_updated_at ON kasus_mr01;

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_kasus_mr01_updated_at 
  BEFORE UPDATE ON kasus_mr01 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- Show table structure for verification
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'kasus_mr01' 
ORDER BY ordinal_position; 