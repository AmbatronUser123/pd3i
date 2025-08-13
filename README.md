# SPASI Mobile Health System

Aplikasi React TypeScript untuk sistem kesehatan mobile dengan integrasi Supabase.

## Prerequisites

Sebelum menjalankan aplikasi, pastikan Anda telah menginstall:

- **Node.js** (versi 16 atau lebih baru)
- **npm** (biasanya terinstall bersama Node.js)

## Cara Menjalankan Aplikasi

### 1. Install Dependencies

Buka terminal/command prompt di folder project dan jalankan:

```bash
npm install
```

### 2. Jalankan Aplikasi dalam Mode Development

```bash
npm run dev
```

Aplikasi akan berjalan di `http://localhost:3000` dan akan otomatis terbuka di browser.

### 3. Scripts yang Tersedia

- `npm run dev` - Menjalankan aplikasi dalam mode development
- `npm run build` - Build aplikasi untuk production
- `npm run preview` - Preview hasil build
- `npm run lint` - Menjalankan ESLint untuk cek kode

## Struktur Project

```
Pd3i/
├── src/
│   ├── main.tsx          # Entry point aplikasi
│   └── index.css         # Styles utama
├── components/           # Komponen React
│   ├── LoginPage.tsx
│   ├── RegisterPage.tsx
│   ├── DashboardPage.tsx
│   └── ui/              # Komponen UI (shadcn/ui)
├── utils/
│   └── supabase/        # Konfigurasi dan utilitas Supabase
├── App.tsx              # Komponen utama aplikasi
├── package.json         # Dependencies dan scripts
├── vite.config.ts       # Konfigurasi Vite
├── tailwind.config.js   # Konfigurasi Tailwind CSS
└── tsconfig.json        # Konfigurasi TypeScript
```

## Fitur Utama

- **Autentikasi**: Login dan register dengan Supabase Auth
- **Dashboard**: Halaman utama setelah login
- **Form Pencatatan Kasus**: Form untuk mencatat kasus kesehatan
- **Tes Koneksi Supabase**: Fitur untuk mengecek koneksi database
- **Responsive Design**: Menggunakan Tailwind CSS

## Troubleshooting

### Jika ada error PowerShell Execution Policy:

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Jika ada error koneksi Supabase:

1. Pastikan project Supabase aktif
2. Cek konfigurasi di `utils/supabase/info.tsx`
3. Gunakan fitur "Test Supabase Connection" di halaman login

### Jika ada error dependencies:

```bash
npm install --force
```

### Jika ada error import dengan versi spesifik:

Error seperti "Failed to resolve import @radix-ui/react-label@2.1.2" terjadi karena import statement menggunakan versi spesifik. Solusi:

1. Pastikan semua dependencies terinstall dengan benar
2. Import statement seharusnya tanpa versi, contoh:
   - ❌ `import { Slot } from "@radix-ui/react-slot@1.1.2"`
   - ✅ `import { Slot } from "@radix-ui/react-slot"`

3. Jika masih error, jalankan perintah PowerShell untuk memperbaiki semua file:
   ```powershell
   Get-ChildItem -Path "components/ui" -Filter "*.tsx" | ForEach-Object { (Get-Content $_.FullName) -replace '@[0-9]+\.[0-9]+\.[0-9]+', '' | Set-Content $_.FullName }
   ```

### Jika ada error "Multiple exports with the same name":

Error seperti "Multiple exports with the same name 'supabase'" terjadi karena ada duplikasi export statement. Solusi:

1. Cek file yang bermasalah (biasanya di `utils/supabase/client.tsx`)
2. Pastikan hanya ada satu export untuk setiap variabel/fungsi
3. Hapus export statement yang duplikat

### Jika aplikasi berjalan di port yang berbeda:

Jika port 3000 sudah digunakan, Vite akan otomatis menggunakan port berikutnya (3001, 3002, dst). Cek terminal untuk melihat URL yang benar.

## Teknologi yang Digunakan

- **React 18** - Framework UI
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Supabase** - Backend (Auth, Database, Storage)
- **Radix UI** - Komponen UI primitives
- **Lucide React** - Icons

## Support

Jika ada masalah, silakan cek:
1. Console browser untuk error JavaScript
2. Terminal untuk error build/development
3. Dokumentasi Supabase untuk masalah backend 