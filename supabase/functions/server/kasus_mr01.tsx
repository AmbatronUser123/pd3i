import { createClient } from 'npm:@supabase/supabase-js';
import { corsHeaders } from './index.tsx';

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

export interface KasusMR01TableRow {
  id?: string;
  disease: string;
  form: string;
  status: 'draft' | 'submitted';
  user_id: string;
  
  // Info Pelapor
  Kabupaten?: string;
  Nomor_EPID?: string;
  Kasus_KLB?: string;
  KLB_ke?: string;
  Nomor_KLB?: string;
  Sumber_laporan?: string;
  Nama_unit_pelapor?: string;
  Tanggal_terima_laporan?: string;
  Tanggal_pelacakan?: string;
  
  // Info Kasus
  Nama_kasus?: string;
  Jenis_kelamin?: string;
  Tanggal_lahir?: string;
  Umur?: string;
  Alamat?: string;
  Kecamatan?: string;
  Kelurahan?: string;
  Nama_orangtua_wali?: string;
  No_kontak_orangtua_wali?: string;
  
  // Info Klinis
  Demam?: string;
  Tanggal_mulai_demam?: string;
  Ruam_makulopopular?: string;
  Tanggal_mulai_rash?: string;
  Gejala_lain?: string;
  Batuk?: string;
  Pilek?: string;
  Mata_Merah?: string;
  Adenopathy?: string;
  Lokasi_Adenopathy?: string;
  Arthralgia?: string;
  Bagian_Sendi_Arthralgia?: string;
  Kehamilan?: string;
  Umur_kehamilan?: string;
  Lainnya?: string;
  Sebutkan_gejala_lainnya?: string;
  
  // Riwayat Pengobatan
  Apakah_kasus_dirawat_di_RS?: string;
  Nama_Rumah_Sakit?: string;
  Tanggal_masuk_rawat_inap?: string;
  Nomor_rekam_medik?: string;
  Tanggal_keluar?: string;
  
  // Riwayat Vaksinasi
  Imunisasi_campak_MR_9_bulan?: string;
  Sumber_info_MR_9_bulan?: string;
  Imunisasi_campak_MR_18_bulan?: string;
  Sumber_info_MR_18_bulan?: string;
  Imunisasi_campak_MR_kelas_1_SD?: string;
  Sumber_info_MR_kelas_1_SD?: string;
  Pernah_MMR_sebelumnya?: string;
  Sumber_info_MMR_sebelumnya?: string;
  Pernah_MR_kampanye?: string;
  Sumber_info_MR_kampanye?: string;
  Tanggal_vaksinasi_rubella_terakhir?: string;
  
  // Info Epidemiologi
  Pemberian_vitamin_A?: string;
  Ada_anggota_sakit_sama?: string;
  Jumlah?: string;
  Berpergian_1_bulan_terakhir?: string;
  Lokasi_perjalanan?: string;
  Tanggal_pergi?: string;
  Tanggal_kembali?: string;
  Hubungan_epidemiologi?: string;
  Rujuk_ke_nomor_KLB?: string;
  
  // Info Spesimen
  Spesimen_darah_diambil?: string;
  Jenis_sampel_darah?: string;
  Tanggal_ambil_spesimen_darah?: string;
  Tanggal_pengiriman_spesimen_darah_ke_lab?: string;
  Spesimen_lain_diambil?: string;
  Jenis_spesimen_lain?: string;
  Tanggal_ambil_spesimen_lain?: string;
  Tanggal_pengiriman_spesimen_lain_ke_lab?: string;
  
  // Info Kondisi Akhir
  Keadaan_saat_ini?: string;
  
  created_at?: string;
  updated_at?: string;
  last_modified?: string;
  submitted_at?: string;
  pending_sync?: boolean;
}

export async function handleKasusMR01Request(request: Request): Promise<Response> {
  try {
    const { action, data, id } = await request.json();

    switch (action) {
      case 'create': {
        // Validate required fields for creation
        if (!data.disease || !data.form) {
          return new Response(
            JSON.stringify({ error: 'Disease and form are required' }),
            { status: 400, headers: corsHeaders }
          );
        }

        // Create new case
        const insertData = {
          ...data,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          last_modified: new Date().toISOString()
        };

        const { data: result, error } = await supabase
          .from('kasus_mr01')
          .insert([insertData])
          .select()
          .single();

        if (error) {
          console.error('Error creating case:', error);
          return new Response(
            JSON.stringify({ error: `Database error while creating case: ${error.message}` }),
            { status: 500, headers: corsHeaders }
          );
        }

        return new Response(
          JSON.stringify({ success: true, data: result }),
          { status: 200, headers: corsHeaders }
        );
      }

      case 'update': {
        if (!id) {
          return new Response(
            JSON.stringify({ error: 'ID is required for update' }),
            { status: 400, headers: corsHeaders }
          );
        }

        const updateData = {
          ...data,
          updated_at: new Date().toISOString(),
          last_modified: new Date().toISOString()
        };

        const { data: result, error } = await supabase
          .from('kasus_mr01')
          .update(updateData)
          .eq('id', id)
          .select()
          .single();

        if (error) {
          console.error('Error updating case:', error);
          return new Response(
            JSON.stringify({ error: `Database error while updating case: ${error.message}` }),
            { status: 500, headers: corsHeaders }
          );
        }

        return new Response(
          JSON.stringify({ success: true, data: result }),
          { status: 200, headers: corsHeaders }
        );
      }

      case 'get': {
        if (!id) {
          return new Response(
            JSON.stringify({ error: 'ID is required for get' }),
            { status: 400, headers: corsHeaders }
          );
        }

        const { data: result, error } = await supabase
          .from('kasus_mr01')
          .select('*')
          .eq('id', id)
          .single();

        if (error) {
          if (error.code === 'PGRST116') {
            // Not found
            return new Response(
              JSON.stringify({ success: true, data: null }),
              { status: 200, headers: corsHeaders }
            );
          }
          console.error('Error getting case:', error);
          return new Response(
            JSON.stringify({ error: `Database error while getting case: ${error.message}` }),
            { status: 500, headers: corsHeaders }
          );
        }

        return new Response(
          JSON.stringify({ success: true, data: result }),
          { status: 200, headers: corsHeaders }
        );
      }

      case 'getByUser': {
        const { userId } = data;
        if (!userId) {
          return new Response(
            JSON.stringify({ error: 'User ID is required' }),
            { status: 400, headers: corsHeaders }
          );
        }

        const { data: result, error } = await supabase
          .from('kasus_mr01')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error getting cases by user:', error);
          return new Response(
            JSON.stringify({ error: `Database error while getting user cases: ${error.message}` }),
            { status: 500, headers: corsHeaders }
          );
        }

        return new Response(
          JSON.stringify({ success: true, data: result || [] }),
          { status: 200, headers: corsHeaders }
        );
      }

      case 'getByDisease': {
        const { disease, form } = data;
        if (!disease) {
          return new Response(
            JSON.stringify({ error: 'Disease is required' }),
            { status: 400, headers: corsHeaders }
          );
        }

        let query = supabase
          .from('kasus_mr01')
          .select('*')
          .eq('disease', disease);

        if (form) {
          query = query.eq('form', form);
        }

        const { data: result, error } = await query.order('created_at', { ascending: false });

        if (error) {
          console.error('Error getting cases by disease:', error);
          return new Response(
            JSON.stringify({ error: `Database error while getting disease cases: ${error.message}` }),
            { status: 500, headers: corsHeaders }
          );
        }

        return new Response(
          JSON.stringify({ success: true, data: result || [] }),
          { status: 200, headers: corsHeaders }
        );
      }

      case 'getAll': {
        const { data: result, error } = await supabase
          .from('kasus_mr01')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error getting all cases:', error);
          return new Response(
            JSON.stringify({ error: `Database error while getting all cases: ${error.message}` }),
            { status: 500, headers: corsHeaders }
          );
        }

        return new Response(
          JSON.stringify({ success: true, data: result || [] }),
          { status: 200, headers: corsHeaders }
        );
      }

      case 'getStats': {
        const { disease } = data;
        
        let query = supabase.from('kasus_mr01').select('status, created_at');
        
        if (disease) {
          query = query.eq('disease', disease);
        }

        const { data: result, error } = await query;

        if (error) {
          console.error('Error getting stats:', error);
          return new Response(
            JSON.stringify({ error: `Database error while getting stats: ${error.message}` }),
            { status: 500, headers: corsHeaders }
          );
        }

        // Calculate stats
        const stats = {
          total: result?.length || 0,
          submitted: result?.filter(r => r.status === 'submitted').length || 0,
          draft: result?.filter(r => r.status === 'draft').length || 0,
          thisWeek: result?.filter(r => {
            const weekAgo = new Date();
            weekAgo.setDate(weekAgo.getDate() - 7);
            return new Date(r.created_at) > weekAgo;
          }).length || 0
        };

        return new Response(
          JSON.stringify({ success: true, data: stats }),
          { status: 200, headers: corsHeaders }
        );
      }

      case 'delete': {
        if (!id) {
          return new Response(
            JSON.stringify({ error: 'ID is required for delete' }),
            { status: 400, headers: corsHeaders }
          );
        }

        const { error } = await supabase
          .from('kasus_mr01')
          .delete()
          .eq('id', id);

        if (error) {
          console.error('Error deleting case:', error);
          return new Response(
            JSON.stringify({ error: `Database error while deleting case: ${error.message}` }),
            { status: 500, headers: corsHeaders }
          );
        }

        return new Response(
          JSON.stringify({ success: true }),
          { status: 200, headers: corsHeaders }
        );
      }

      default:
        return new Response(
          JSON.stringify({ error: 'Invalid action. Supported actions: create, update, get, getByUser, getByDisease, getAll, getStats, delete' }),
          { status: 400, headers: corsHeaders }
        );
    }
  } catch (error) {
    console.error('Error in handleKasusMR01Request:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error while processing MR01 case request',
        details: error.message 
      }),
      { status: 500, headers: corsHeaders }
    );
  }
}