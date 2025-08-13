# Panduan Setup Supabase untuk SPASI Mobile Health System

## 🚨 **MASALAH YANG DIHADAPI**
Aplikasi sudah bisa berjalan, tetapi **tidak bisa mengirim data ke Supabase** karena:
1. Tabel `kasus_mr01` belum dibuat di database
2. Row Level Security (RLS) belum dikonfigurasi
3. Kode menggunakan Edge Functions yang tidak berfungsi

## ✅ **SOLUSI YANG SUDAH DITERAPKAN**
1. **Mengganti Edge Functions** → **Supabase Client langsung**
2. **Membuat file SQL** untuk membuat tabel
3. **Mengkonfigurasi RLS** untuk keamanan

---

## 📋 **LANGKAH-LANGKAH SETUP SUPABASE**

### **1. Login ke Supabase Dashboard**
1. Buka [https://supabase.com](https://supabase.com)
2. Login dengan akun Anda
3. Pilih project `zffbczxvpaadbzxqvxpz`

### **2. Buat Tabel di Database**
1. Buka **SQL Editor** di sidebar kiri
2. Copy dan paste isi file `supabase/create_table_kasus_mr01.sql`
3. Klik **Run** untuk menjalankan script
4. Copy dan paste isi file `supabase/create_table_profiles.sql`
5. Klik **Run** untuk menjalankan script

**⚠️ Jika muncul error "column user_id does not exist":**
- Script sudah diperbaiki untuk menangani tabel yang sudah ada
- Script akan menambahkan kolom yang hilang secara otomatis
- Jalankan script lagi, seharusnya tidak ada error

### **3. Verifikasi Tabel Terbuat**
1. Buka **Table Editor** di sidebar
2. Pastikan tabel `kasus_mr01` muncul
3. Cek struktur kolom sesuai dengan interface

### **4. Test Koneksi dari Aplikasi**
1. Buka aplikasi di `http://localhost:3001`
2. Login dengan akun yang sudah dibuat
3. Coba buat form pencatatan kasus baru
4. Klik **Kirim** untuk test pengiriman data

---

## 🔧 **TROUBLESHOOTING**

### **Jika masih error "Failed to create kasus":**

#### **A. Cek Console Browser**
1. Buka **Developer Tools** (F12)
2. Buka tab **Console**
3. Lihat error yang muncul saat submit form

#### **B. Cek Supabase Logs**
1. Buka **Logs** di Supabase Dashboard
2. Pilih **Database Logs**
3. Lihat apakah ada error saat insert data

#### **C. Cek RLS Policies**
1. Buka **Authentication** → **Policies**
2. Pastikan policy untuk tabel `kasus_mr01` sudah dibuat
3. Pastikan user sudah login dengan benar

#### **D. Test Manual di SQL Editor**
```sql
-- Test insert manual
INSERT INTO kasus_mr01 (disease, form, status, user_id, pasien_nama)
VALUES ('campak', 'mr01', 'draft', 'your-user-id', 'Test Pasien');

-- Cek data
SELECT * FROM kasus_mr01;

-- Cek struktur tabel
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'kasus_mr01' 
ORDER BY ordinal_position;
```

---

## 📊 **STRUKTUR TABEL KASUS_MR01**

Tabel ini menyimpan semua data form pencatatan kasus dengan struktur:

### **Kolom Utama:**
- `id` - UUID primary key
- `disease` - Jenis penyakit (campak, rubella, dll)
- `form` - Jenis form (mr01, dll)
- `status` - Status (draft/submitted)
- `user_id` - ID user yang membuat

### **Data Pasien:**
- `pasien_nama`, `pasien_nik`, `pasien_tgl_lahir`
- `pasien_umur`, `pasien_jk`, `pasien_alamat`

### **Data Klinis:**
- `tanggal_onset`, `gejala_demam`, `gejala_ruam`
- `gejala_batuk`, `gejala_pilek`, `gejala_mata_merah`

### **Data Epidemiologis:**
- `kontak_kasus_lain`, `bepergian_2_minggu`
- `tempat_bepergian`, `sumber_infeksi`

---

## 🔐 **KEAMANAN (RLS)**

### **Policies yang Diterapkan:**
1. **SELECT** - User hanya bisa lihat data miliknya
2. **INSERT** - User hanya bisa insert data miliknya
3. **UPDATE** - User hanya bisa update data miliknya
4. **DELETE** - User hanya bisa delete data miliknya

### **Cara Kerja:**
- Setiap record harus memiliki `user_id` yang sesuai dengan `auth.uid()`
- User tidak bisa mengakses data user lain
- Admin bisa melihat semua data (jika diperlukan)

---

## 🧪 **TESTING**

### **Test 1: Koneksi Dasar**
1. Buka halaman login
2. Klik "Test Supabase Connection"
3. Pastikan status "Connected"

### **Test 2: Autentikasi**
1. Register/Login dengan email dan password
2. Pastikan tidak ada error di console

### **Test 3: Insert Data**
1. Buat form pencatatan kasus baru
2. Isi minimal 1 field wajib
3. Klik "Kirim"
4. Cek apakah data masuk ke database

### **Test 4: Query Data**
1. Buka dashboard
2. Cek apakah data yang baru dibuat muncul
3. Test edit dan delete data

---

## 📞 **SUPPORT**

Jika masih ada masalah:

1. **Cek Console Browser** untuk error JavaScript
2. **Cek Supabase Logs** untuk error database
3. **Cek Network Tab** untuk error HTTP request
4. **Pastikan tabel sudah dibuat** dengan struktur yang benar
5. **Pastikan user sudah login** sebelum submit data

---

## 🎯 **EXPECTED RESULT**

Setelah setup selesai:
- ✅ Form bisa disubmit ke database
- ✅ Data tersimpan dengan benar
- ✅ Dashboard menampilkan data
- ✅ Edit/delete data berfungsi
- ✅ Offline mode tetap berfungsi sebagai fallback 