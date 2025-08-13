import { useState, useEffect } from 'react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Page } from '../App';
import { 
  ArrowLeft, 
  Plus, 
  Edit, 
  Trash2, 
  Search,
  Calendar,
  User,
  UserCheck,
  Clock,
  CheckCircle2,
  Send,
  AlertCircle,
  Activity,
  Wifi,
  WifiOff
} from 'lucide-react';
import { Input } from './ui/input';

interface ResumeKasusPageProps {
  disease: string;
  form: string;
  onNavigate: (page: Page, options?: { disease?: string; form?: string; caseId?: string }) => void;
  onBack: () => void;
  isOnline: boolean;
}

interface CaseItem {
  id: string;
  patientName: string;
  submissionDate: string;
  status: 'draft' | 'submitted' | 'completed';
  synced: boolean;
}

const diseaseNames: Record<string, string> = {
  'campak-rubela': 'Campak-Rubela',
  'difteri': 'Difteri',
  'pertusis': 'Pertusis',
  'tetanus': 'Tetanus',
  'polio': 'Polio',
  'hepatitis': 'Hepatitis',
};

const formNames: Record<string, string> = {
  'mr-01': 'MR-01 - Formulir Pencatatan Kasus',
  'mr-01-ld': 'MR-01 LD - Formulir Pencatatan Kasus Lanjutan',
  'mr-04': 'MR-04 - Formulir Investigasi',
  'formulir-05': 'Formulir 05 - Formulir Pelaporan Mingguan',
  'pemantauan-kontak': 'Pemantauan Kontak - Pencatatan Kontak Erat',
  'hasil-lab': 'Hasil Lab - Hasil Laboratorium',
};

export function ResumeKasusPage({ disease, form, onNavigate, onBack, isOnline }: ResumeKasusPageProps) {

  const [cases, setCases] = useState<CaseItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredCases, setFilteredCases] = useState<CaseItem[]>([]);

  // Ambil data kasus dari localStorage setiap kali mount atau ada perubahan
  useEffect(() => {
    const localCasesRaw = localStorage.getItem('spasi_cases');
    let localCases: any[] = [];
    if (localCasesRaw) {
      try {
        localCases = JSON.parse(localCasesRaw);
      } catch {
        localCases = [];
      }
    }
    // Filter berdasarkan disease dan form
    const filteredByType = localCases.filter(c => c.disease === disease && c.form === form);
    // Prioritaskan kasus dengan status submitted/completed dan nama pasien terisi
    const statusOrder = { 'draft': 0, 'submitted': 1, 'completed': 2 };
    const casesByPatient: Record<string, any> = {};
    filteredByType.forEach(c => {
      // Cari nama pasien dari semua kemungkinan field
      const patientName = c.formData?.pasien_nama || c.formData?.Nama_pasien || c.formData?.nama_pasien;
      if (!patientName) return; // skip jika nama pasien kosong
      if (!casesByPatient[patientName]) {
        casesByPatient[patientName] = c;
      } else {
        // Pilih status tertinggi
        const currentStatus = String(c.status) as keyof typeof statusOrder;
        const existingStatus = String(casesByPatient[patientName].status) as keyof typeof statusOrder;
        if (statusOrder[currentStatus] > statusOrder[existingStatus]) {
          casesByPatient[patientName] = c;
        }
      }
    });
    // Hanya tampilkan kasus yang statusnya submitted/completed
    const finalCases = Object.values(casesByPatient).filter(c => c.status === 'submitted' || c.status === 'completed');
    // Mapping ke CaseItem
    const mappedCases: CaseItem[] = finalCases.map(c => ({
      id: c.id,
      patientName: c.formData?.pasien_nama || c.formData?.Nama_pasien || c.formData?.nama_pasien || '-',
      submissionDate: c.submitted_at || c.last_modified || new Date().toISOString(),
      status: c.status || 'draft',
      synced: c.pending_sync === false
    }));
    setCases(mappedCases);
  }, [disease, form]);

  useEffect(() => {
    const filtered = cases.filter(case_ =>
      case_.patientName.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredCases(filtered);
  }, [cases, searchTerm]);

  const handleNewCase = () => {
    onNavigate('form-pencatatan', { disease, form });
  };

  const handleEditCase = (caseId: string) => {
    onNavigate('form-pencatatan', { disease, form, caseId });
  };

  const handleDeleteCase = (caseId: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus kasus ini?')) {
      setCases(cases.filter(c => c.id !== caseId));
    }
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'completed': 
        return { 
          color: 'bg-green-100 text-green-800 border-green-200', 
          icon: CheckCircle2, 
          text: 'Selesai'
        };
      case 'submitted': 
        return { 
          color: 'bg-blue-100 text-blue-800 border-blue-200', 
          icon: Send, 
          text: 'Terkirim'
        };
      case 'draft': 
        return { 
          color: 'bg-yellow-100 text-yellow-800 border-yellow-200', 
          icon: Clock, 
          text: 'Draft'
        };
      default: 
        return { 
          color: 'bg-gray-100 text-gray-800 border-gray-200', 
          icon: AlertCircle, 
          text: 'Unknown'
        };
    }
  };

  return (
    <div className="min-h-screen bg-background pt-6">
      {/* Online/Offline Status */}
      <div className={`fixed top-0 left-0 right-0 z-50 px-4 py-2 text-center text-sm ${
        isOnline ? 'bg-primary text-primary-foreground' : 'bg-destructive text-destructive-foreground'
      }`}>
        <div className="flex items-center justify-center gap-2">
          {isOnline ? <Wifi className="w-4 h-4" /> : <WifiOff className="w-4 h-4" />}
          {isOnline ? 'Online - Data akan tersinkronisasi' : 'Offline - Data tersimpan lokal'}
        </div>
      </div>

      <div className="pt-12">
        {/* Header */}
        <div className="bg-card shadow-sm border-b border-border">
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
              </div>
            </div>

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Cari nama pasien..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </div>

        <div className="p-4">
          {/* Cases List */}
          <div className="space-y-3">
            {filteredCases.length === 0 ? (
              <Card className="p-8 text-center">
                <div className="text-muted-foreground">
                  <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                    <User className="w-8 h-8 opacity-50" />
                  </div>
                  <p className="text-lg mb-2">Belum ada kasus yang tercatat</p>
                  <p className="text-sm">Tekan tombol + untuk menambah kasus baru</p>
                </div>
              </Card>
            ) : (
              filteredCases.map((case_) => {
                const statusConfig = getStatusConfig(case_.status);
                return (
                  <Card key={case_.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <UserCheck className="w-4 h-4 text-muted-foreground" />
                            <h3 className="font-medium">{case_.patientName}</h3>
                            <div className={`px-2 py-1 rounded-full text-xs font-medium border flex items-center gap-1 ${statusConfig.color}`}>
                              <statusConfig.icon className="w-3 h-3" />
                              {statusConfig.text}
                            </div>
                            {!case_.synced && (
                              <div className="flex items-center gap-1">
                                <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
                                <span className="text-orange-600 text-xs">Belum sync</span>
                              </div>
                            )}
                          </div>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              {new Date(case_.submissionDate).toLocaleDateString('id-ID')}
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditCase(case_.id)}
                            className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteCase(case_.id)}
                            className="p-2 hover:bg-red-50 text-red-600 rounded-lg"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            )}
          </div>

          {/* Summary Stats */}
          <Card className="mt-6 bg-muted/50">
            <CardContent className="p-4">
              <h3 className="font-medium mb-3 flex items-center gap-2">
                <Activity className="w-5 h-5" />
                Ringkasan
              </h3>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="bg-white rounded-lg p-3">
                  <div className="text-lg font-bold text-primary">{cases.length}</div>
                  <div className="text-xs text-muted-foreground">Total Kasus</div>
                </div>
                <div className="bg-white rounded-lg p-3">
                  <div className="text-lg font-bold text-green-600">
                    {cases.filter(c => c.status === 'completed').length}
                  </div>
                  <div className="text-xs text-muted-foreground">Selesai</div>
                </div>
                <div className="bg-white rounded-lg p-3">
                  <div className="text-lg font-bold text-orange-600">
                    {cases.filter(c => !c.synced).length}
                  </div>
                  <div className="text-xs text-muted-foreground">Belum Sync</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Floating Action Button */}
        <button
          onClick={handleNewCase}
          className="spasi-fab group"
          aria-label="Tambah kasus baru"
        >
          <Plus className="w-6 h-6 group-hover:scale-110 transition-transform" />
        </button>
      </div>
    </div>
  );
}
