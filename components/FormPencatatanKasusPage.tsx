import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Page } from '../App';
import { toast } from 'sonner';
import { 
  ArrowLeft, 
  Save, 
  Send, 
  Wifi,
  WifiOff,
  FileText,
  Clock,
  AlertCircle
} from 'lucide-react';

// Import refactored modules
import { 
  diseaseNames, 
  formNames, 
  getInitialFormSections,
  FormSection as FormSectionType
} from './FormPencatatanKasus/constants';
import { 
  FormData,
  validateFormData,
  updateSectionCompletion,
  loadExistingData,
  saveDraft,
  shouldShowField,
  saveDraftToLocalStorage,
  submitForm,
  submitFormToLocalStorage
} from './FormPencatatanKasus/utils';
import { FormFieldRenderer } from './FormPencatatanKasus/FormFieldRenderer';
import { MultiStepNavigation } from './FormPencatatanKasus/MultiStepNavigation';
import { testSupabaseConnection, testKasusMR01Schema } from '../utils/supabase/test-connection';

interface FormPencatatanKasusPageProps {
  disease: string;
  form: string;
  caseId?: string;
  onNavigate: (page: Page, options?: { disease?: string; form?: string; caseId?: string }) => void;
  onBack: () => void;
  isOnline: boolean;
}

export function FormPencatatanKasusPage({ 
  disease, 
  form, 
  caseId, 
  onNavigate: _onNavigate, 
  onBack, 
  isOnline 
}: FormPencatatanKasusPageProps) {
  const [formData, setFormData] = useState<FormData>({});
  const [sections, setSections] = useState<FormSectionType[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [currentCaseId, setCurrentCaseId] = useState<string | undefined>(caseId);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [connStatus, setConnStatus] = useState<string>('Form ini hanya akan menggunakan field yang valid sesuai dengan struktur tabel kasus_mr01 di database.');
  const [schemaStatus, setSchemaStatus] = useState<string>('');
  const [isTestingConn, setIsTestingConn] = useState(false);
  const [isTestingSchema, setIsTestingSchema] = useState(false);

  // Auto-save interval
  useEffect(() => {
    const interval = setInterval(() => {
      if (Object.keys(formData).length > 0 && !isSaving && !isSubmitting) {
        handleAutoSave();
      }
    }, 30000); // Auto-save every 30 seconds

    return () => clearInterval(interval);
  }, [formData, isSaving, isSubmitting]);

  useEffect(() => {
    // Initialize form sections
    setSections(getInitialFormSections());

    // Load existing data if editing
    if (currentCaseId) {
      loadExistingData(currentCaseId, isOnline).then(data => {
        setFormData(data);
      });
    }
  }, [currentCaseId, isOnline]);

  const handleAutoSave = async () => {
    try {
      const newCaseId = await saveDraft(formData, disease, form, currentCaseId, isOnline);
      if (newCaseId && !currentCaseId) {
        setCurrentCaseId(newCaseId);
      }
      setLastSaved(new Date());
    } catch (error) {
      // Silent failure for auto-save
      console.log('Auto-save failed, will retry later');
    }
  };

  const handleFieldChange = (fieldId: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [fieldId]: value
    }));

    // Clear field error when user starts typing
    if (errors[fieldId]) {
      setErrors(prev => ({
        ...prev,
        [fieldId]: ''
      }));
    }

    // Auto-calculate age if birth date is entered
    if (fieldId === 'Tanggal_lahir' && value) {
      const birthDate = new Date(value);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      
      // Store age as a number, not a string
      setFormData(prev => ({
        ...prev,
        Umur: age
      }));
    }

    // Update section completion status
    const updatedFormData = { ...formData, [fieldId]: value };
    setSections(prev => updateSectionCompletion(fieldId, updatedFormData, prev));
  };

  const validateCurrentSection = () => {
    const currentSection = sections[currentStep];
    const sectionErrors: Record<string, string> = {};
    
    // Validate only visible required fields in current section
    currentSection.fields.forEach(field => {
      if (field.required && shouldShowField(field, formData)) {
        if (!formData[field.id] || formData[field.id] === '') {
          sectionErrors[field.id] = `${field.label} harus diisi`;
        }
      }
    });

    setErrors(sectionErrors);
    return Object.keys(sectionErrors).length === 0;
  };

  const handleNext = () => {
    if (validateCurrentSection()) {
      setCurrentStep(prev => Math.min(prev + 1, sections.length - 1));
      // Mark current section as completed
      setSections(prev => prev.map((section, index) => 
        index === currentStep ? { ...section, completed: true } : section
      ));
    } else {
      toast.error('Mohon lengkapi field yang wajib diisi');
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 0));
  };

  const handleStepChange = (step: number) => {
    if (step <= currentStep || sections[step].completed) {
      setCurrentStep(step);
    }
  };

  const handleSaveDraft = async () => {
    if (isSaving) return;
    
    setIsSaving(true);
    
    try {
      const newCaseId = await saveDraft(formData, disease, form, currentCaseId, isOnline);
      if (newCaseId && !currentCaseId) {
        setCurrentCaseId(newCaseId);
      }
      setLastSaved(new Date());
      toast.success('Draft berhasil disimpan');
    } catch (error) {
      console.error('Error saving draft:', error);
      
      // Fallback to localStorage on error
      try {
        const id = saveDraftToLocalStorage(formData, disease, form, currentCaseId, isOnline);
        if (!currentCaseId) {
          setCurrentCaseId(id);
        }
        setLastSaved(new Date());
        toast.success('Draft disimpan secara lokal');
      } catch (localError) {
        console.error('Error saving to localStorage:', localError);
        toast.error('Gagal menyimpan draft. Silakan coba lagi.');
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleTestConnection = async () => {
    try {
      setIsTestingConn(true);
      const res = await testSupabaseConnection();
      if (res.success) {
        setConnStatus('Koneksi berhasil.');
        toast.success('Koneksi Supabase OK');
      } else {
        setConnStatus(res.message || 'Koneksi gagal.');
        toast.error('Koneksi Supabase gagal');
      }
    } finally {
      setIsTestingConn(false);
    }
  };

  const handleTestSchema = async () => {
    try {
      setIsTestingSchema(true);
      const res = await testKasusMR01Schema();
      if (res.success) {
        setSchemaStatus('Schema OK');
        toast.success('Schema kasus_mr01 sesuai');
      } else {
        setSchemaStatus(res.message || 'Schema bermasalah');
        toast.error('Schema kasus_mr01 bermasalah');
      }
    } finally {
      setIsTestingSchema(false);
    }
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;
    
    // Validate all sections before submit
    const validationErrors = validateFormData(formData, sections);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      
      // Find first section with errors and navigate to it
      let firstErrorSection = -1;
      for (let i = 0; i < sections.length; i++) {
        const sectionFields = sections[i].fields.map(f => f.id);
        const hasError = sectionFields.some(fieldId => validationErrors[fieldId]);
        if (hasError) {
          firstErrorSection = i;
          break;
        }
      }
      
      if (firstErrorSection !== -1) {
        setCurrentStep(firstErrorSection);
        toast.error(`Mohon periksa dan lengkapi data di seksi "${sections[firstErrorSection].title}"`);
      } else {
        toast.error('Mohon periksa dan lengkapi data yang masih kosong');
      }
      return;
    }

    setIsSubmitting(true);
    
    try {
      await submitForm(formData, disease, form, currentCaseId, isOnline, sections);

      // Navigate back after successful submission
      setTimeout(() => {
        onBack();
      }, 1500);

    } catch (error) {
      console.error('Error submitting form:', error);
      
      // Fallback to localStorage when offline or on database error
      try {
        submitFormToLocalStorage(formData, disease, form, currentCaseId, isOnline);

        setTimeout(() => {
          onBack();
        }, 1500);
      } catch (localError) {
        console.error('Error saving to localStorage:', localError);
        toast.error('Terjadi kesalahan saat menyimpan formulir. Silakan coba lagi.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentSection = sections[currentStep];
  const hasErrors = Object.keys(errors).length > 0;
  const filledFieldsCount = Object.keys(formData).filter(key => 
    formData[key] !== undefined && formData[key] !== null && formData[key] !== ''
  ).length;

  return (
    <div className="min-h-screen bg-background pb-20 pt-6">
      {/* Online/Offline Status */}
      <div className={`fixed top-0 left-0 right-0 z-50 px-4 py-2 text-center text-sm ${
        isOnline ? 'bg-primary text-primary-foreground' : 'bg-destructive text-destructive-foreground'
      }`}>
        <div className="flex items-center justify-center gap-2">
          {isOnline ? <Wifi className="w-4 h-4" /> : <WifiOff className="w-4 h-4" />}
          {isOnline ? 'Online - Data akan tersinkronisasi' : 'Offline - Data tersimpan lokal'}
          {lastSaved && (
            <span className="ml-4 flex items-center gap-1">
              <Clock className="w-3 h-3" />
              Terakhir disimpan: {lastSaved.toLocaleTimeString('id-ID', { 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </span>
          )}
        </div>
      </div>

      <div className="pt-12 max-w-5xl mx-auto">
        {/* Header */}
        <div className="bg-card shadow-sm border-b border-border sticky top-12 z-40">
          <div className="p-4">
            <div className="flex items-center gap-3 mb-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={onBack}
                className="p-2 hover:bg-muted rounded-lg"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div className="flex-1">
                <h1 className="text-lg font-semibold">{diseaseNames[disease]}</h1>
                <p className="text-sm text-muted-foreground">{formNames[form]}</p>
                {currentCaseId && (
                  <p className="text-xs text-muted-foreground">ID: {currentCaseId.substring(0, 20)}...</p>
                )}
              </div>
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">
                  {filledFieldsCount} field terisi
                </span>
                {hasErrors && (
                  <div className="flex items-center gap-1 text-destructive">
                    <AlertCircle className="w-4 h-4" />
                    <span className="text-xs">{Object.keys(errors).length} error</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Multi-Step Navigation */}
        <MultiStepNavigation
          sections={sections}
          currentStep={currentStep}
          onStepChange={handleStepChange}
          onNext={handleNext}
          onPrevious={handlePrevious}
          canProceed={!hasErrors}
        />

        {/* Status Koneksi Database */}
        <div className="p-4">
          <div className="spasi-card">
            <h3 className="font-medium mb-3">Status Koneksi Database</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="flex items-center justify-between gap-3 bg-muted/40 rounded-md p-3">
                <div className="text-sm">Koneksi Database</div>
                <Button variant="outline" size="sm" onClick={handleTestConnection} disabled={isTestingConn}>
                  {isTestingConn ? 'Menguji...' : 'Test Koneksi'}
                </Button>
              </div>
              <div className="flex items-center justify-between gap-3 bg-muted/40 rounded-md p-3">
                <div className="text-sm">Schema Database</div>
                <Button variant="outline" size="sm" onClick={handleTestSchema} disabled={isTestingSchema}>
                  {isTestingSchema ? 'Mengecek...' : 'Test Schema'}
                </Button>
              </div>
            </div>
            <div className="mt-3 text-sm text-muted-foreground bg-primary/5 border border-primary/20 rounded-md p-3">
              {connStatus}
              {schemaStatus && <div className="mt-1">{schemaStatus}</div>}
            </div>
          </div>
        </div>

        {/* Current Section Form */}
        <div className="p-4 space-y-6">
          {currentSection && (
            <div className="spasi-card">
              <div className="space-y-4">
                {currentSection.fields.map((field) => (
                  <FormFieldRenderer
                    key={field.id}
                    field={field}
                    value={formData[field.id]}
                    onChange={(value) => handleFieldChange(field.id, value)}
                    formData={formData}
                    error={errors[field.id]}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sticky Bottom Actions */}
        <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border p-4 z-50">
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={handleSaveDraft}
              className="flex-1"
              disabled={isSaving || isSubmitting}
            >
              <Save className="w-4 h-4 mr-2" />
              {isSaving ? 'Menyimpan...' : 'Simpan Draft'}
            </Button>
            <Button
              onClick={handleSubmit}
              className="flex-1"
              disabled={isSubmitting || isSaving}
            >
              <Send className="w-4 h-4 mr-2" />
              {isSubmitting ? 'Mengirim...' : 'Kirim'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
