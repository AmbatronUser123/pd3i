import { createClient } from '@supabase/supabase-js';
import { projectId, publicAnonKey } from './info';

const supabaseUrl = `https://${projectId}.supabase.co`;
export const supabase = createClient(supabaseUrl, publicAnonKey);

export interface KasusMR01 {
  id?: string;
  disease: string;
  form: string;
  status: 'draft' | 'submitted';
  user_id: string;
  
  // Info Pelapor
  pelapor_nama?: string;
  pelapor_jabatan?: string;
  pelapor_telp?: string;
  pelapor_email?: string;
  tanggal_lapor?: string;
  
  // Info Kasus
  pasien_nama?: string;
  pasien_nik?: string;
  pasien_tgl_lahir?: string;
  pasien_umur?: number;
  pasien_jk?: string;
  pasien_alamat?: string;
  pasien_rt_rw?: string;
  pasien_kelurahan?: string;
  pasien_kecamatan?: string;
  
  // Info Klinis
  tanggal_onset?: string;
  gejala_demam?: string;
  gejala_ruam?: string;
  gejala_batuk?: string;
  gejala_pilek?: string;
  gejala_mata_merah?: string;
  gejala_lain?: string;
  
  // Riwayat Pengobatan
  sedang_dirawat?: string;
  rumah_sakit?: string;
  tanggal_dirawat?: string;
  obat_yang_diminum?: string;
  riwayat_rawat_inap?: string;
  
  // Riwayat Vaksinasi
  status_imunisasi?: string;
  vaksin_terakhir?: string;
  tanggal_vaksin_terakhir?: string;
  tempat_imunisasi?: string;
  catatan_imunisasi?: string;
  
  // Info Epidemiologis
  kontak_kasus_lain?: string;
  bepergian_2_minggu?: string;
  tempat_bepergian?: string;
  tanggal_bepergian?: string;
  sumber_infeksi?: string;
  
  // Info Spesimen
  spesimen_diambil?: string;
  jenis_spesimen?: string;
  tanggal_pengambilan?: string;
  tempat_pemeriksaan?: string;
  hasil_lab?: string;
  
  // Info Akhir Kasus
  klasifikasi_akhir?: string;
  kondisi_akhir?: string;
  tanggal_meninggal?: string;
  penyebab_kematian?: string;
  tindak_lanjut?: string;
  
  // Info Kontak Erat
  jumlah_kontak?: number;
  kontak_keluarga?: number;
  kontak_sekolah?: number;
  kontak_lain?: number;
  catatan_kontak?: string;
  
  // Info Pelaksana
  petugas_nama?: string;
  petugas_nip?: string;
  petugas_jabatan?: string;
  tanggal_pengisian?: string;
  tanda_tangan?: string;
  koordinat_lokasi?: string;
  
  created_at?: string;
  updated_at?: string;
  last_modified?: string;
  pending_sync?: boolean;
}

// Supabase table operations for case data
export const kasusMR01Operations = {
  // Generate a proper string-based ID that won't cause integer overflow
  generateId(): string {
    return `case_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  },

  // Helper function to format date strings to YYYY-MM-DD format
  formatDateForDB(dateStr: string | null | undefined): string | null {
    if (!dateStr) return null;
    try {
      // Try to parse the date string
      const date = new Date(dateStr);
      // Check if date is valid
      if (isNaN(date.getTime())) return null;
      // Format to YYYY-MM-DD
      return date.toISOString().split('T')[0];
    } catch {
      return null;
    }
  },

  // Convert form data object to flat table structure
  convertFormDataToTableData(formData: Record<string, any>, baseData: Partial<KasusMR01>): KasusMR01 {
    // Helper: cari field dengan berbagai penamaan
    function getField(obj: any, ...names: string[]) {
      for (const n of names) {
        if (obj[n] !== undefined) return obj[n];
      }
      return null;
    }
    return {
      ...baseData,
      pelapor_nama: getField(formData, 'pelapor_nama', 'Pelapor_nama', 'nama_pelapor', 'Nama_pelapor'),
      pelapor_jabatan: getField(formData, 'pelapor_jabatan', 'Pelapor_jabatan'),
      pelapor_telp: getField(formData, 'pelapor_telp', 'Pelapor_telp'),
      pelapor_email: getField(formData, 'pelapor_email', 'Pelapor_email'),
      tanggal_lapor: this.formatDateForDB(getField(formData, 'tanggal_lapor', 'Tanggal_lapor')),

      pasien_nama: getField(formData, 'pasien_nama', 'Pasien_nama', 'nama_pasien', 'Nama_pasien', 'Nama_kasus'),
      pasien_nik: getField(formData, 'pasien_nik', 'Pasien_nik', 'nik_pasien', 'NIK_pasien'),
      pasien_tgl_lahir: this.formatDateForDB(getField(formData, 'pasien_tgl_lahir', 'Pasien_tgl_lahir', 'tgl_lahir_pasien', 'Tanggal_lahir_pasien', 'Tanggal_lahir')),
      pasien_umur: getField(formData, 'pasien_umur', 'Pasien_umur', 'umur_pasien', 'Umur_pasien', 'Umur') ? Number(getField(formData, 'pasien_umur', 'Pasien_umur', 'umur_pasien', 'Umur_pasien', 'Umur')) : null,
      pasien_jk: getField(formData, 'pasien_jk', 'Pasien_jk', 'jenis_kelamin', 'Jenis_kelamin'),
      pasien_alamat: getField(formData, 'pasien_alamat', 'Pasien_alamat', 'alamat_pasien', 'Alamat_pasien', 'Alamat'),
      pasien_rt_rw: getField(formData, 'pasien_rt_rw', 'Pasien_rt_rw'),
      pasien_kelurahan: getField(formData, 'pasien_kelurahan', 'Pasien_kelurahan', 'Kelurahan'),
      pasien_kecamatan: getField(formData, 'pasien_kecamatan', 'Pasien_kecamatan', 'Kecamatan'),

      tanggal_onset: this.formatDateForDB(getField(formData, 'tanggal_onset', 'Tanggal_onset')),
      gejala_demam: getField(formData, 'gejala_demam', 'Gejala_demam', 'demam', 'Demam'),
      gejala_ruam: getField(formData, 'gejala_ruam', 'Gejala_ruam', 'ruam', 'Ruam', 'Ruam_makulopopular'),
      gejala_batuk: getField(formData, 'gejala_batuk', 'Gejala_batuk', 'batuk', 'Batuk'),
      gejala_pilek: getField(formData, 'gejala_pilek', 'Gejala_pilek', 'pilek', 'Pilek'),
      gejala_mata_merah: getField(formData, 'gejala_mata_merah', 'Gejala_mata_merah', 'Mata_Merah'),
      gejala_lain: getField(formData, 'gejala_lain', 'Gejala_lain', 'Sebutkan_gejala_lainnya'),

      sedang_dirawat: getField(formData, 'sedang_dirawat', 'Sedang_dirawat', 'Apakah_kasus_dirawat_di_RS'),
      rumah_sakit: getField(formData, 'rumah_sakit', 'Rumah_sakit', 'Nama_Rumah_Sakit'),
      tanggal_dirawat: this.formatDateForDB(getField(formData, 'tanggal_dirawat', 'Tanggal_dirawat', 'Tanggal_masuk_rawat_inap')),
      obat_yang_diminum: getField(formData, 'obat_yang_diminum', 'Obat_yang_diminum'),
      riwayat_rawat_inap: getField(formData, 'riwayat_rawat_inap', 'Riwayat_rawat_inap'),

      status_imunisasi: getField(formData, 'status_imunisasi', 'Status_imunisasi'),
      vaksin_terakhir: getField(formData, 'vaksin_terakhir', 'Vaksin_terakhir'),
      tanggal_vaksin_terakhir: this.formatDateForDB(getField(formData, 'tanggal_vaksin_terakhir', 'Tanggal_vaksin_terakhir')),
      tempat_imunisasi: getField(formData, 'tempat_imunisasi', 'Tempat_imunisasi'),
      catatan_imunisasi: getField(formData, 'catatan_imunisasi', 'Catatan_imunisasi'),

      kontak_kasus_lain: getField(formData, 'kontak_kasus_lain', 'Kontak_kasus_lain', 'Ada_anggota_sakit_sama'),
      bepergian_2_minggu: getField(formData, 'bepergian_2_minggu', 'Bepergian_2_minggu', 'Berpergian_1_bulan_terakhir'),
      tempat_bepergian: getField(formData, 'tempat_bepergian', 'Tempat_bepergian', 'Lokasi_perjalanan'),
      tanggal_bepergian: this.formatDateForDB(getField(formData, 'tanggal_bepergian', 'Tanggal_bepergian', 'Tanggal_pergi')),
      sumber_infeksi: getField(formData, 'sumber_infeksi', 'Sumber_infeksi'),

      spesimen_diambil: getField(formData, 'spesimen_diambil', 'Spesimen_diambil', 'Spesimen_darah_diambil', 'Spesimen_lain_diambil'),
      jenis_spesimen: getField(formData, 'jenis_spesimen', 'Jenis_spesimen', 'Jenis_sampel_darah', 'Jenis_spesimen_lain'),
      tanggal_pengambilan: this.formatDateForDB(getField(formData, 'tanggal_pengambilan', 'Tanggal_pengambilan', 'Tanggal_ambil_spesimen_darah', 'Tanggal_ambil_spesimen_lain')),
      tempat_pemeriksaan: getField(formData, 'tempat_pemeriksaan', 'Tempat_pemeriksaan'),
      hasil_lab: getField(formData, 'hasil_lab', 'Hasil_lab'),

      klasifikasi_akhir: getField(formData, 'klasifikasi_akhir', 'Klasifikasi_akhir'),
      kondisi_akhir: getField(formData, 'kondisi_akhir', 'Kondisi_akhir', 'Keadaan_saat_ini'),
      tanggal_meninggal: this.formatDateForDB(getField(formData, 'tanggal_meninggal', 'Tanggal_meninggal')),
      penyebab_kematian: getField(formData, 'penyebab_kematian', 'Penyebab_kematian'),
      tindak_lanjut: getField(formData, 'tindak_lanjut', 'Tindak_lanjut'),

      jumlah_kontak: getField(formData, 'jumlah_kontak', 'Jumlah_kontak', 'Jumlah') ? Number(getField(formData, 'jumlah_kontak', 'Jumlah_kontak', 'Jumlah')) : null,
      kontak_keluarga: getField(formData, 'kontak_keluarga', 'Kontak_keluarga') ? Number(getField(formData, 'kontak_keluarga', 'Kontak_keluarga')) : null,
      kontak_sekolah: getField(formData, 'kontak_sekolah', 'Kontak_sekolah') ? Number(getField(formData, 'kontak_sekolah', 'Kontak_sekolah')) : null,
      kontak_lain: getField(formData, 'kontak_lain', 'Kontak_lain') ? Number(getField(formData, 'kontak_lain', 'Kontak_lain')) : null,
      catatan_kontak: getField(formData, 'catatan_kontak', 'Catatan_kontak'),

      petugas_nama: getField(formData, 'petugas_nama', 'Petugas_nama'),
      petugas_nip: getField(formData, 'petugas_nip', 'Petugas_nip'),
      petugas_jabatan: getField(formData, 'petugas_jabatan', 'Petugas_jabatan'),
      tanggal_pengisian: this.formatDateForDB(getField(formData, 'tanggal_pengisian', 'Tanggal_pengisian')),
      tanda_tangan: getField(formData, 'tanda_tangan', 'Tanda_tangan'),
      koordinat_lokasi: getField(formData, 'koordinat_lokasi', 'Koordinat_lokasi')
    } as KasusMR01;
  },

  // Convert table data back to form data object for backward compatibility
  convertTableDataToFormData(tableData: KasusMR01): Record<string, any> {
    const formData: Record<string, any> = {};
    
    // Map all table columns back to form fields
    Object.keys(tableData).forEach(key => {
      if (!['id', 'disease', 'form', 'status', 'user_id', 'created_at', 'updated_at', 'last_modified', 'pending_sync'].includes(key)) {
        formData[key] = tableData[key as keyof KasusMR01];
      }
    });
    
    return formData;
  },

  async insert(data: { disease: string; form: string; status: 'draft' | 'submitted'; user_id: string; formData: Record<string, any> }) {
    try {
      const tableData = this.convertFormDataToTableData(data.formData, {
        disease: data.disease,
        form: data.form,
        status: data.status,
        user_id: data.user_id,
        last_modified: new Date().toISOString()
      });

      // Use Supabase client directly instead of Edge Functions
      const { data: result, error } = await supabase
        .from('kasus_mr01')
        .insert([tableData])
        .select()
        .single();

      if (error) {
        console.error('Supabase insert error:', error);
        throw new Error(error.message);
      }

      return result;
    } catch (error) {
      console.error('Error inserting case:', error);
      throw error;
    }
  },

  async update(id: string, data: { disease?: string; form?: string; status?: 'draft' | 'submitted'; user_id?: string; formData?: Record<string, any> }) {
    try {
      let updateData: Partial<KasusMR01> = {
        last_modified: new Date().toISOString()
      };

      // If formData is provided, convert it to table structure
      if (data.formData) {
        const tableData = this.convertFormDataToTableData(data.formData, {
          disease: data.disease,
          form: data.form,
          status: data.status,
          user_id: data.user_id
        });
        updateData = { ...updateData, ...tableData };
      } else {
        // Otherwise, update only the provided fields
        if (data.disease) updateData.disease = data.disease;
        if (data.form) updateData.form = data.form;
        if (data.status) updateData.status = data.status;
        if (data.user_id) updateData.user_id = data.user_id;
      }

      // Use Supabase client directly
      const { data: result, error } = await supabase
        .from('kasus_mr01')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Supabase update error:', error);
        throw new Error(error.message);
      }

      return result;
    } catch (error) {
      console.error('Error updating case:', error);
      throw error;
    }
  },

  async delete(id: string) {
    try {
      // Use Supabase client directly
      const { error } = await supabase
        .from('kasus_mr01')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Supabase delete error:', error);
        throw new Error(error.message);
      }

      return true;
    } catch (error) {
      console.error('Error deleting case:', error);
      throw error;
    }
  },

  async getById(id: string): Promise<KasusMR01 | null> {
    try {
      // Use Supabase client directly
      const { data, error } = await supabase
        .from('kasus_mr01')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // No rows returned
          return null;
        }
        console.error('Supabase getById error:', error);
        throw new Error(error.message);
      }

      return data;
    } catch (error) {
      console.error('Error getting case by ID:', error);
      // Return null for not found, don't throw
      return null;
    }
  },

  async getByUser(userId: string): Promise<KasusMR01[]> {
    try {
      // Use Supabase client directly
      const { data, error } = await supabase
        .from('kasus_mr01')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Supabase getByUser error:', error);
        throw new Error(error.message);
      }

      return data || [];
    } catch (error) {
      console.error('Error getting cases by user:', error);
      return [];
    }
  },

  async getAllCases(): Promise<KasusMR01[]> {
    try {
      // Use Supabase client directly
      const { data, error } = await supabase
        .from('kasus_mr01')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Supabase getAllCases error:', error);
        throw new Error(error.message);
      }

      return data || [];
    } catch (error) {
      console.error('Error getting all cases:', error);
      return [];
    }
  }
};


