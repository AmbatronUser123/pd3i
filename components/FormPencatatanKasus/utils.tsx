import { toast } from 'sonner';
import { FormSection } from './constants';
import { getCurrentUser } from '../../utils/supabase/auth';
import { projectId, publicAnonKey } from '../../utils/supabase/info';


export interface FormData {
  [key: string]: any;
}

export function calculateAge(birthDate: string): number | null {
  if (!birthDate) return null;
  
  const birth = new Date(birthDate);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  
  return age >= 0 ? age : null;
}

export function updateSectionCompletion(
  fieldId: string, 
  formData: FormData, 
  sections: FormSection[]
): FormSection[] {
  return sections.map(section => {
    // Check if any field in this section was updated
    const sectionFieldIds = section.fields.map(f => f.id);
    if (!sectionFieldIds.includes(fieldId)) {
      return section;
    }

    // Calculate completion based on required fields that should be shown
    const visibleRequiredFields = section.fields.filter(field => {
      if (!field.required) return false;
      
      // Check field dependencies
      if (field.dependsOn) {
        return shouldShowField(field, formData);
      }
      
      return true;
    });

    const filledRequiredFields = visibleRequiredFields.filter(field => {
      const value = formData[field.id];
      return value !== undefined && value !== null && value !== '';
    });

    const completed = visibleRequiredFields.length > 0 
      ? filledRequiredFields.length === visibleRequiredFields.length
      : section.fields.some(f => formData[f.id]);

    return {
      ...section,
      completed
    };
  });
}

// Helper function to determine if a field should be shown based on dependencies
function shouldShowField(field: any, formData: FormData): boolean {
  if (!field.dependsOn) return true;
  
  const dependentValue = formData[field.dependsOn];
  
  // Handle different dependency scenarios
  switch (field.dependsOn) {
    case 'Kasus_KLB':
      return dependentValue === 'Ya';
    
    case 'Demam':
      return dependentValue === 'Ya' && field.id === 'Tanggal_mulai_demam';
    
    case 'Ruam_makulopopular':
      return dependentValue === 'Ya' && field.id === 'Tanggal_mulai_rash';
    
    case 'Adenopathy':
      return dependentValue === 'Ya' && field.id === 'Lokasi_Adenopathy';
    
    case 'Arthralgia':
      return dependentValue === 'Ya' && field.id === 'Bagian_Sendi_Arthralgia';
    
    case 'Kehamilan':
      return dependentValue === 'Ya' && field.id === 'Umur_kehamilan';
    
    case 'Lainnya':
      return dependentValue === 'Ya' && field.id === 'Sebutkan_gejala_lainnya';
    
    case 'Apakah_kasus_dirawat_di_RS':
      return dependentValue === 'Ya';
    
    case 'Imunisasi_campak_MR_9_bulan':
    case 'Imunisasi_campak_MR_18_bulan':
    case 'Imunisasi_campak_MR_kelas_1_SD':
    case 'Pernah_MMR_sebelumnya':
    case 'Pernah_MR_kampanye':
      return dependentValue === 'Ya' || dependentValue === 'Tidak';
    
    case 'Ada_anggota_sakit_sama':
      return dependentValue === 'Ya' && field.id === 'Jumlah';
    
    case 'Berpergian_1_bulan_terakhir':
      return dependentValue === 'Ya';
    
    case 'Spesimen_darah_diambil':
      return dependentValue === 'Ya';
    
    case 'Spesimen_lain_diambil':
      return dependentValue === 'Ya';
    
    default:
      return dependentValue === 'Ya';
  }
}

export function validateFormData(formData: FormData, sections: FormSection[]): Record<string, string> {
  const errors: Record<string, string> = {};

  // Debug logging
  console.log('Validating form data:', formData);
  console.log('Sections:', sections);

  sections.forEach(section => {
    section.fields.forEach(field => {
      if (field.required) {
        // Check if field should be validated based on dependencies
        if (!shouldShowField(field, formData)) {
          return; // Skip validation if field shouldn't be shown
        }

        const value = formData[field.id];
        
        if (!value || (typeof value === 'string' && value.trim() === '')) {
          errors[field.id] = `${field.label} harus diisi`;
        }
      }

      // Specific validations for filled fields
      const value = formData[field.id];
      if (value && typeof value === 'string' && value.trim() !== '') {
        // Phone number validation
        if (field.type === 'tel' && !/^[\d\s\-\+\(\)]+$/.test(value)) {
          errors[field.id] = 'Nomor telepon tidak valid';
        }

        // Number validation
        if (field.type === 'number' && isNaN(Number(value))) {
          errors[field.id] = 'Harus berupa angka';
        }

        // Date validation
        if (field.type === 'date') {
          const date = new Date(value);
          if (isNaN(date.getTime())) {
            errors[field.id] = 'Format tanggal tidak valid';
          } else if (date > new Date()) {
            errors[field.id] = 'Tanggal tidak boleh di masa depan';
          }
        }

        // Age validation
        if (field.id === 'Umur_kehamilan' && (Number(value) < 0 || Number(value) > 42)) {
          errors[field.id] = 'Umur kehamilan harus antara 0-42 minggu';
        }
      }
    });
  });

  // Debug logging
  console.log('Validation errors:', errors);

  return errors;
}

export async function loadExistingData(caseId: string, isOnline: boolean): Promise<FormData> {
  if (!isOnline) {
    // Load from localStorage when offline
    const localData = localStorage.getItem(`spasi_case_${caseId}`);
    if (localData) {
      try {
        return JSON.parse(localData);
      } catch (error) {
        console.error('Error parsing local data:', error);
      }
    }
    return {};
  }

  try {
    const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-b2c9964a/kasus-mr01`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${publicAnonKey}`,
      },
      body: JSON.stringify({
        action: 'get',
        id: caseId
      })
    });

    const result = await response.json();
    
    if (result.success && result.data) {
      return result.data;
    }
    
    return {};
  } catch (error) {
    console.error('Error loading existing data:', error);
    
    // Fallback to localStorage
    const localData = localStorage.getItem(`spasi_case_${caseId}`);
    if (localData) {
      try {
        return JSON.parse(localData);
      } catch (parseError) {
        console.error('Error parsing local fallback data:', parseError);
      }
    }
    
    return {};
  }
}

export function saveDraftToLocalStorage(
  formData: FormData,
  disease: string,
  form: string,
  caseId?: string,
  isOnline?: boolean
): string {
  const id = caseId || `draft_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  const caseData = {
    id,
    disease,
    form,
    status: 'draft',
    user_id: 'local_user',
    ...formData,
    last_modified: new Date().toISOString(),
    pending_sync: isOnline || false
  };

  localStorage.setItem(`spasi_case_${id}`, JSON.stringify(caseData));
  
  // Update local case list
  const existingCases = JSON.parse(localStorage.getItem('spasi_cases') || '[]');
  const caseIndex = existingCases.findIndex((c: any) => c.id === id);
  
  if (caseIndex >= 0) {
    existingCases[caseIndex] = { ...existingCases[caseIndex], ...caseData };
  } else {
    existingCases.push(caseData);
  }
  
  localStorage.setItem('spasi_cases', JSON.stringify(existingCases));
  
  return id;
}

export async function saveDraft(
  formData: FormData,
  disease: string,
  form: string,
  caseId?: string,
  isOnline?: boolean
): Promise<string> {
  // Always save to localStorage first
  const localId = saveDraftToLocalStorage(formData, disease, form, caseId, isOnline);

  if (!isOnline) {
    toast.success('Draft disimpan secara lokal (offline)');
    return localId;
  }

  try {
    // Get current user ID
    const currentUser = await getCurrentUser();
    const userId = currentUser?.id || 'demo_user';
    
    const requestData = {
      disease,
      form,
      status: 'draft',
      user_id: userId,
      ...formData
    };

    const action = caseId ? 'update' : 'create';
    const payload: any = { action, data: requestData };
    
    if (caseId) {
      payload.id = caseId;
    }

    // Use kasusMR01Operations to create or update the record
    const { kasusMR01Operations } = await import('../../utils/supabase/client');
    let result;
    
    if (caseId) {
      // Update existing record
      result = await kasusMR01Operations.update(caseId, {
        disease,
        form,
        status: 'draft',
        user_id: userId,
        formData
      });
    } else {
      // Create new record
      result = await kasusMR01Operations.insert({
        disease,
        form,
        status: 'draft',
        user_id: userId,
        formData
      });
    }

    if (result) {
      const savedId = result.id;
      
      // Update localStorage with server ID
      if (savedId !== localId) {
        // Remove old local entry and create new one with server ID
        localStorage.removeItem(`spasi_case_${localId}`);
        saveDraftToLocalStorage(formData, disease, form, savedId, isOnline);
      }
      
      toast.success('Draft berhasil disimpan');
      return savedId;
    } else {
      throw new Error('Failed to save to server');
    }
  } catch (error) {
    console.error('Error saving draft to server:', error);
    toast.warning('Draft disimpan secara lokal, akan dikirim saat online');
    return localId;
  }
}

export function submitFormToLocalStorage(
  formData: FormData,
  disease: string,
  form: string,
  caseId?: string,
  isOnline?: boolean
): string {
  const id = caseId || `submit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  const caseData = {
    id,
    disease,
    form,
    status: 'submitted',
    user_id: 'local_user',
    ...formData,
    submitted_at: new Date().toISOString(),
    last_modified: new Date().toISOString(),
    pending_sync: isOnline || false
  };

  localStorage.setItem(`spasi_case_${id}`, JSON.stringify(caseData));
  
  // Update local case list
  const existingCases = JSON.parse(localStorage.getItem('spasi_cases') || '[]');
  const caseIndex = existingCases.findIndex((c: any) => c.id === id);
  
  if (caseIndex >= 0) {
    existingCases[caseIndex] = { ...existingCases[caseIndex], ...caseData };
  } else {
    existingCases.push(caseData);
  }
  
  localStorage.setItem('spasi_cases', JSON.stringify(existingCases));
  
  return id;
}

export async function submitForm(
  formData: FormData,
  disease: string,
  form: string,
  caseId?: string,
  isOnline?: boolean,
  sections?: FormSection[]
): Promise<string> {
  // Validate before submit with better error handling
  if (sections) {
    const errors = validateFormData(formData, sections);
    if (Object.keys(errors).length > 0) {
      console.error('Form validation errors:', errors);
      
      // Show specific error messages
      const errorMessages = Object.values(errors).slice(0, 3); // Show first 3 errors
      toast.error(`Mohon lengkapi: ${errorMessages.join(', ')}`);
      
      throw new Error(`Form validation failed: ${Object.keys(errors).length} errors found`);
    }
  }

  // Always save to localStorage first
  const localId = submitFormToLocalStorage(formData, disease, form, caseId, isOnline);

  // The data processing logic has been removed from here.
  // The `convertFormDataToTableData` function in `utils/supabase/client.tsx`
  // is now responsible for all data transformation.

  // DEBUG: log isi formData sebelum dikirim ke Supabase
  console.log('DEBUG submitForm - formData:', formData);

  try {
    // Konversi ke format Supabase
    const { kasusMR01Operations } = await import('../../utils/supabase/client');
    let result;
    const currentUser = await getCurrentUser();
    const userId = currentUser?.id || 'demo_user';
    if (caseId) {
      result = await kasusMR01Operations.update(caseId, {
        disease,
        form,
        status: 'submitted',
        user_id: userId,
        formData: formData
      });
    } else {
      result = await kasusMR01Operations.insert({
        disease,
        form,
        status: 'submitted',
        user_id: userId,
        formData: formData
      });
    }

    if (result) {
      const savedId = result.id;
      // Update localStorage with server ID and mark as synced
      if (savedId !== localId) {
        localStorage.removeItem(`spasi_case_${localId}`);
        // Pastikan format data localStorage sama dengan yang dikirim ke Supabase
        const syncedData = {
          id: savedId,
          disease,
          form,
          status: 'submitted',
          user_id: userId,
          formData: formData,
          submitted_at: new Date().toISOString(),
          last_modified: new Date().toISOString(),
          pending_sync: false
        };
        localStorage.setItem(`spasi_case_${savedId}`, JSON.stringify(syncedData));
        // Update spasi_cases list
        const existingCases = JSON.parse(localStorage.getItem('spasi_cases') || '[]');
        const caseIndex = existingCases.findIndex((c: any) => c.id === savedId);
        if (caseIndex >= 0) {
          existingCases[caseIndex] = { ...existingCases[caseIndex], ...syncedData };
        } else {
          existingCases.push(syncedData);
        }
        localStorage.setItem('spasi_cases', JSON.stringify(existingCases));
      }
      toast.success('Formulir berhasil dikirim dan tersimpan!');
      return savedId;
    } else {
      throw new Error(result.error || 'Failed to submit to server');
    }
  } catch (error) {
    console.error('Error submitting form to server:', error);
    toast.warning('Formulir disimpan secara lokal, akan dikirim saat online');
    return localId;
  }
}
