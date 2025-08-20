import { 
  Phone,
  UserCheck,
  Stethoscope,
  Pill,
  Syringe,
  Globe,
  FlaskConical,
  FileCheck
} from 'lucide-react';

export interface FormField {
  id: string;
  label: string;
  type: 'text' | 'select' | 'radio' | 'textarea' | 'date' | 'readonly' | 'number' | 'tel';
  required?: boolean;
  options?: string[];
  placeholder?: string;
  tooltip?: string;
  numeric?: boolean;
  autoCalculate?: boolean;
  dependsOn?: string;
}

export interface FormSection {
  id: string;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  fields: FormField[];
  completed: boolean;
  expanded: boolean;
  description?: string;
}

export const diseaseNames: Record<string, string> = {
  'campak-rubela': 'Campak-Rubela',
  'difteri': 'Difteri',
  'pertusis': 'Pertusis',
  'tetanus': 'Tetanus',
  'polio': 'Polio',
  'hepatitis': 'Hepatitis',
};

export const formNames: Record<string, string> = {
  'mr-01': 'MR-01 - Formulir Pencatatan Kasus',
  'mr-01-ld': 'MR-01 LD - Formulir Pencatatan Kasus Lanjutan',
  'mr-04': 'MR-04 - Formulir Investigasi',
  'formulir-05': 'Formulir 05 - Formulir Pelaporan Mingguan',
  'pemantauan-kontak': 'Pemantauan Kontak - Pencatatan Kontak Erat',
  'hasil-lab': 'Hasil Lab - Hasil Laboratorium',
};

// Dropdown options
export const kabupatenOptions = [
  'Jakarta Pusat', 'Jakarta Utara', 'Jakarta Selatan', 'Jakarta Timur', 'Jakarta Barat',
  'Bogor', 'Depok', 'Tangerang', 'Bekasi', 'Bandung', 'Surabaya', 'Medan', 'Makassar'
];

export const kecamatanOptions = [
  'Menteng', 'Tanah Abang', 'Gambir', 'Sawah Besar', 'Kemayoran',
  'Senen', 'Cempaka Putih', 'Johar Baru', 'Kelapa Gading', 'Tanjung Priok'
];

export const sumberInfoOptions = [
  'Kartu/buku imunisasi', 'Ingatan ibu/keluarga', 'Catatan medis', 'Tidak tahu'
];

export const getInitialFormSections = (): FormSection[] => [
  {
    id: 'info-pelapor',
    title: 'INFO PELAPOR',
    icon: Phone,
    completed: false,
    expanded: true,
    description: 'Informasi pelapor dan sumber laporan',
    fields: [
      { 
        id: 'Kabupaten', 
        label: 'Kabupaten/Kota', 
        type: 'select', 
        required: true,
        options: kabupatenOptions
      },
      { 
        id: 'Nomor_EPID', 
        label: 'Nomor EPID', 
        type: 'text', 
        required: true,
        placeholder: 'Contoh: EPID-2025-001'
      },
      { 
        id: 'Kasus_KLB', 
        label: 'Apakah kasus ini bagian dari KLB?', 
        type: 'radio', 
        options: ['Ya', 'Tidak'], 
        required: true 
      },
      { 
        id: 'KLB_ke', 
        label: 'KLB ke-', 
        type: 'number', 
        dependsOn: 'Kasus_KLB',
        placeholder: 'Nomor urut KLB'
      },
      { 
        id: 'Nomor_KLB', 
        label: 'Nomor KLB', 
        type: 'text', 
        dependsOn: 'Kasus_KLB',
        placeholder: 'Contoh: KLB-2025-001'
      },
      { 
        id: 'Sumber_laporan', 
        label: 'Sumber Laporan', 
        type: 'select', 
        required: true,
        options: ['Puskesmas', 'Rumah Sakit', 'Praktek Swasta', 'Masyarakat', 'Lainnya']
      },
      { 
        id: 'Nama_unit_pelapor', 
        label: 'Nama Unit Pelapor', 
        type: 'text', 
        required: true,
        placeholder: 'Nama fasilitas kesehatan'
      },
      { 
        id: 'Tanggal_terima_laporan', 
        label: 'Tanggal Terima Laporan', 
        type: 'date', 
        required: true 
      },
      { 
        id: 'Tanggal_pelacakan', 
        label: 'Tanggal Pelacakan', 
        type: 'date', 
        required: true 
      }
    ]
  },
  {
    id: 'info-kasus',
    title: 'INFO KASUS',
    icon: UserCheck,
    completed: false,
    expanded: false,
    description: 'Data identitas dan demografi pasien',
    fields: [
      { 
        id: 'Nama_kasus', 
        label: 'Nama Lengkap Pasien', 
        type: 'text', 
        required: true,
        placeholder: 'Nama lengkap sesuai KTP/KK'
      },
      { 
        id: 'Jenis_kelamin', 
        label: 'Jenis Kelamin', 
        type: 'radio', 
        options: ['Laki-laki', 'Perempuan'], 
        required: true 
      },
      { 
        id: 'Tanggal_lahir', 
        label: 'Tanggal Lahir', 
        type: 'date', 
        required: true 
      },
      { 
        id: 'Umur', 
        label: 'Umur (tahun)', 
        type: 'readonly',
        autoCalculate: true,
        tooltip: 'Umur akan dihitung otomatis berdasarkan tanggal lahir'
      },
      { 
        id: 'Alamat', 
        label: 'Alamat Lengkap', 
        type: 'textarea', 
        required: true,
        placeholder: 'Alamat tempat tinggal saat ini'
      },
      { 
        id: 'Kecamatan', 
        label: 'Kecamatan', 
        type: 'select', 
        required: true,
        options: kecamatanOptions
      },
      { 
        id: 'Kelurahan', 
        label: 'Kelurahan/Desa', 
        type: 'text', 
        required: true,
        placeholder: 'Nama kelurahan/desa'
      },
      { 
        id: 'Nama_orangtua_wali', 
        label: 'Nama Orangtua/Wali', 
        type: 'text', 
        required: true,
        placeholder: 'Untuk pasien di bawah 18 tahun'
      },
      { 
        id: 'No_kontak_orangtua_wali', 
        label: 'No. Kontak Orangtua/Wali', 
        type: 'tel', 
        required: true,
        placeholder: 'Nomor telepon yang bisa dihubungi'
      }
    ]
  },
  {
    id: 'info-klinis',
    title: 'INFO KLINIS',
    icon: Stethoscope,
    completed: false,
    expanded: false,
    description: 'Gejala klinis dan manifestasi penyakit',
    fields: [
      { 
        id: 'Demam', 
        label: 'Demam', 
        type: 'radio', 
        options: ['Ya', 'Tidak'], 
        required: true 
      },
      { 
        id: 'Tanggal_mulai_demam', 
        label: 'Tanggal Mulai Demam', 
        type: 'date',
        dependsOn: 'Demam'
      },
      { 
        id: 'Ruam_makulopopular', 
        label: 'Ruam Makulopopular', 
        type: 'radio', 
        options: ['Ya', 'Tidak'], 
        required: true,
        tooltip: 'Ruam berupa bintik-bintik merah yang datar atau sedikit menonjol'
      },
      { 
        id: 'Tanggal_mulai_rash', 
        label: 'Tanggal Mulai Ruam', 
        type: 'date',
        dependsOn: 'Ruam_makulopopular'
      },
      { 
        id: 'Gejala_lain', 
        label: 'Ada Gejala Lain?', 
        type: 'radio', 
        options: ['Ya', 'Tidak'], 
        required: true 
      },
      { 
        id: 'Batuk', 
        label: 'Batuk', 
        type: 'radio', 
        options: ['Ya', 'Tidak'], 
        required: true 
      },
      { 
        id: 'Pilek', 
        label: 'Pilek', 
        type: 'radio', 
        options: ['Ya', 'Tidak'], 
        required: true 
      },
      { 
        id: 'Mata_Merah', 
        label: 'Mata Merah (Konjungtivitis)', 
        type: 'radio', 
        options: ['Ya', 'Tidak'], 
        required: true 
      },
      { 
        id: 'Adenopathy', 
        label: 'Pembesaran Kelenjar Getah Bening', 
        type: 'radio', 
        options: ['Ya', 'Tidak'], 
        required: true,
        tooltip: 'Pembesaran kelenjar getah bening (lymphadenopathy)'
      },
      { 
        id: 'Lokasi_Adenopathy', 
        label: 'Lokasi Pembesaran Kelenjar', 
        type: 'select',
        options: ['Leher', 'Ketiak', 'Selangkangan', 'Multiple', 'Lainnya'],
        dependsOn: 'Adenopathy'
      },
      { 
        id: 'Arthralgia', 
        label: 'Nyeri Sendi', 
        type: 'radio', 
        options: ['Ya', 'Tidak'], 
        required: true,
        tooltip: 'Nyeri pada persendian (arthralgia)'
      },
      { 
        id: 'Bagian_Sendi_Arthralgia', 
        label: 'Bagian Sendi yang Nyeri', 
        type: 'select',
        options: ['Tangan', 'Kaki', 'Lutut', 'Siku', 'Multiple', 'Lainnya'],
        dependsOn: 'Arthralgia'
      },
      { 
        id: 'Kehamilan', 
        label: 'Sedang Hamil? (untuk perempuan)', 
        type: 'radio', 
        options: ['Ya', 'Tidak', 'Tidak Tahu'], 
        required: true 
      },
      { 
        id: 'Umur_kehamilan', 
        label: 'Umur Kehamilan (minggu)', 
        type: 'number',
        dependsOn: 'Kehamilan',
        placeholder: 'Dalam minggu'
      },
      { 
        id: 'Lainnya', 
        label: 'Gejala Lainnya', 
        type: 'radio', 
        options: ['Ya', 'Tidak'], 
        required: true 
      },
      { 
        id: 'Sebutkan_gejala_lainnya', 
        label: 'Sebutkan Gejala Lainnya', 
        type: 'textarea',
        dependsOn: 'Lainnya',
        placeholder: 'Jelaskan gejala lain yang dialami'
      }
    ]
  },
  {
    id: 'riwayat-pengobatan',
    title: 'RIWAYAT PENGOBATAN',
    icon: Pill,
    completed: false,
    expanded: false,
    description: 'Riwayat perawatan dan pengobatan',
    fields: [
      { 
        id: 'Apakah_kasus_dirawat_di_RS', 
        label: 'Apakah Kasus Dirawat di RS?', 
        type: 'radio', 
        options: ['Ya', 'Tidak'], 
        required: true 
      },
      { 
        id: 'Nama_Rumah_Sakit', 
        label: 'Nama Rumah Sakit', 
        type: 'text',
        dependsOn: 'Apakah_kasus_dirawat_di_RS',
        placeholder: 'Nama lengkap rumah sakit'
      },
      { 
        id: 'Tanggal_masuk_rawat_inap', 
        label: 'Tanggal Masuk Rawat Inap', 
        type: 'date',
        dependsOn: 'Apakah_kasus_dirawat_di_RS'
      },
      { 
        id: 'Nomor_rekam_medik', 
        label: 'Nomor Rekam Medik', 
        type: 'text',
        dependsOn: 'Apakah_kasus_dirawat_di_RS',
        placeholder: 'Nomor RM di rumah sakit'
      },
      { 
        id: 'Tanggal_keluar', 
        label: 'Tanggal Keluar RS', 
        type: 'date',
        dependsOn: 'Apakah_kasus_dirawat_di_RS'
      }
    ]
  },
  {
    id: 'riwayat-vaksinasi',
    title: 'RIWAYAT VAKSINASI',
    icon: Syringe,
    completed: false,
    expanded: false,
    description: 'Riwayat imunisasi campak dan rubela',
    fields: [
      { 
        id: 'Imunisasi_campak_MR_9_bulan', 
        label: 'Imunisasi Campak/MR 9 Bulan', 
        type: 'radio', 
        options: ['Ya', 'Tidak', 'Tidak Tahu'], 
        required: true 
      },
      { 
        id: 'Sumber_info_MR_9_bulan', 
        label: 'Sumber Informasi MR 9 Bulan', 
        type: 'select',
        options: sumberInfoOptions,
        dependsOn: 'Imunisasi_campak_MR_9_bulan'
      },
      { 
        id: 'Imunisasi_campak_MR_18_bulan', 
        label: 'Imunisasi Campak/MR 18 Bulan', 
        type: 'radio', 
        options: ['Ya', 'Tidak', 'Tidak Tahu'], 
        required: true 
      },
      { 
        id: 'Sumber_info_MR_18_bulan', 
        label: 'Sumber Informasi MR 18 Bulan', 
        type: 'select',
        options: sumberInfoOptions,
        dependsOn: 'Imunisasi_campak_MR_18_bulan'
      },
      { 
        id: 'Imunisasi_campak_MR_kelas_1_SD', 
        label: 'Imunisasi Campak/MR Kelas 1 SD', 
        type: 'radio', 
        options: ['Ya', 'Tidak', 'Tidak Tahu'], 
        required: true 
      },
      { 
        id: 'Sumber_info_MR_kelas_1_SD', 
        label: 'Sumber Informasi MR Kelas 1 SD', 
        type: 'select',
        options: sumberInfoOptions,
        dependsOn: 'Imunisasi_campak_MR_kelas_1_SD'
      },
      { 
        id: 'Pernah_MMR_sebelumnya', 
        label: 'Pernah MMR Sebelumnya', 
        type: 'radio', 
        options: ['Ya', 'Tidak', 'Tidak Tahu'], 
        required: true 
      },
      { 
        id: 'Sumber_info_MMR_sebelumnya', 
        label: 'Sumber Informasi MMR', 
        type: 'select',
        options: sumberInfoOptions,
        dependsOn: 'Pernah_MMR_sebelumnya'
      },
      { 
        id: 'Pernah_MR_kampanye', 
        label: 'Pernah MR Kampanye', 
        type: 'radio', 
        options: ['Ya', 'Tidak', 'Tidak Tahu'], 
        required: true 
      },
      { 
        id: 'Sumber_info_MR_kampanye', 
        label: 'Sumber Informasi MR Kampanye', 
        type: 'select',
        options: sumberInfoOptions,
        dependsOn: 'Pernah_MR_kampanye'
      },
      { 
        id: 'Tanggal_vaksinasi_rubella_terakhir', 
        label: 'Tanggal Vaksinasi Rubella Terakhir', 
        type: 'date'
      }
    ]
  },
  {
    id: 'info-epidemiologi',
    title: 'INFO EPIDEMIOLOGI',
    icon: Globe,
    completed: false,
    expanded: false,
    description: 'Faktor risiko dan riwayat paparan',
    fields: [
      { 
        id: 'Pemberian_vitamin_A', 
        label: 'Pemberian Vitamin A', 
        type: 'radio', 
        options: ['Ya', 'Tidak', 'Tidak Tahu'], 
        required: true 
      },
      { 
        id: 'Ada_anggota_sakit_sama', 
        label: 'Ada Anggota Keluarga/Kontak Sakit Sama?', 
        type: 'radio', 
        options: ['Ya', 'Tidak'], 
        required: true 
      },
      { 
        id: 'Jumlah', 
        label: 'Jumlah Orang yang Sakit Sama', 
        type: 'number',
        dependsOn: 'Ada_anggota_sakit_sama',
        placeholder: 'Jumlah orang'
      },
      { 
        id: 'Berpergian_1_bulan_terakhir', 
        label: 'Berpergian 1 Bulan Terakhir?', 
        type: 'radio', 
        options: ['Ya', 'Tidak'], 
        required: true 
      },
      { 
        id: 'Lokasi_perjalanan', 
        label: 'Lokasi Perjalanan', 
        type: 'text',
        dependsOn: 'Berpergian_1_bulan_terakhir',
        placeholder: 'Kota/provinsi/negara tujuan'
      },
      { 
        id: 'Tanggal_pergi', 
        label: 'Tanggal Berangkat', 
        type: 'date',
        dependsOn: 'Berpergian_1_bulan_terakhir'
      },
      { 
        id: 'Tanggal_kembali', 
        label: 'Tanggal Kembali', 
        type: 'date',
        dependsOn: 'Berpergian_1_bulan_terakhir'
      },
      { 
        id: 'Hubungan_epidemiologi', 
        label: 'Hubungan Epidemiologi', 
        type: 'select',
        options: ['Ya, ada hubungan', 'Tidak ada hubungan', 'Sedang diselidiki'],
        required: true
      },
      { 
        id: 'Rujuk_ke_nomor_KLB', 
        label: 'Rujuk ke Nomor KLB', 
        type: 'text',
        placeholder: 'Nomor KLB terkait jika ada'
      }
    ]
  },
  {
    id: 'info-spesimen',
    title: 'INFO SPESIMEN',
    icon: FlaskConical,
    completed: false,
    expanded: false,
    description: 'Pengambilan dan pengiriman spesimen laboratorium',
    fields: [
      { 
        id: 'Spesimen_darah_diambil', 
        label: 'Spesimen Darah Diambil?', 
        type: 'radio', 
        options: ['Ya', 'Tidak'], 
        required: true 
      },
      { 
        id: 'Jenis_sampel_darah', 
        label: 'Jenis Sampel Darah', 
        type: 'select',
        options: ['Serum', 'Whole Blood', 'DBS (Dried Blood Spot)'],
        dependsOn: 'Spesimen_darah_diambil'
      },
      { 
        id: 'Tanggal_ambil_spesimen_darah', 
        label: 'Tanggal Ambil Spesimen Darah', 
        type: 'date',
        dependsOn: 'Spesimen_darah_diambil'
      },
      { 
        id: 'Tanggal_pengiriman_spesimen_darah_ke_lab', 
        label: 'Tanggal Kirim Spesimen Darah ke Lab', 
        type: 'date',
        dependsOn: 'Spesimen_darah_diambil'
      },
      { 
        id: 'Spesimen_lain_diambil', 
        label: 'Spesimen Lain Diambil?', 
        type: 'radio', 
        options: ['Ya', 'Tidak'], 
        required: true 
      },
      { 
        id: 'Jenis_spesimen_lain', 
        label: 'Jenis Spesimen Lain', 
        type: 'select',
        options: ['Urin', 'Swab Tenggorok', 'Swab Hidung', 'Cairan Serebrospinal', 'Lainnya'],
        dependsOn: 'Spesimen_lain_diambil'
      },
      { 
        id: 'Tanggal_ambil_spesimen_lain', 
        label: 'Tanggal Ambil Spesimen Lain', 
        type: 'date',
        dependsOn: 'Spesimen_lain_diambil'
      },
      { 
        id: 'Tanggal_pengiriman_spesimen_lain_ke_lab', 
        label: 'Tanggal Kirim Spesimen Lain ke Lab', 
        type: 'date',
        dependsOn: 'Spesimen_lain_diambil'
      }
    ]
  },
  {
    id: 'info-kondisi-akhir',
    title: 'INFO KONDISI AKHIR',
    icon: FileCheck,
    completed: false,
    expanded: false,
    description: 'Kondisi dan klasifikasi akhir kasus',
    fields: [
      { 
        id: 'Keadaan_saat_ini', 
        label: 'Keadaan Pasien Saat Ini', 
        type: 'select',
        options: ['Sembuh', 'Dalam perawatan', 'Meninggal', 'Tidak diketahui'],
        required: true
      }
    ]
  }
];
