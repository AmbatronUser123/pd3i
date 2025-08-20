import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Page, User } from '../App';
import { 
  ArrowLeft, 
  ClipboardList, 
  Eye,
  Calendar,
  Clipboard,
  FlaskConical,
  ContactRound,
  Activity,
  Building2,
  MapPin,
  Stethoscope,
  TrendingUp,
  LogOut,
  Wifi,
  WifiOff
} from 'lucide-react';

interface DiseaseSubmenuPageProps {
  disease: string;
  onNavigate: (page: Page, options?: { disease?: string; form?: string }) => void;
  onBack: () => void;
  isOnline: boolean;
  user: User;
  onLogout: () => void;
}

const diseaseNames: Record<string, string> = {
  'campak-rubela': 'Campak-Rubela',
  'difteri': 'Difteri',
  'pertusis': 'Pertusis',
  'tetanus': 'Tetanus',
  'polio': 'Polio',
  'hepatitis': 'Hepatitis',
};

const forms = [
  { 
    id: 'mr-01', 
    name: 'MR-01', 
    description: 'Formulir Pencatatan Kasus', 
    icon: Clipboard,
    bgHex: '#E3F2FD',
    iconHex: '#1E88E5'
  },
  { 
    id: 'mr-01-ld', 
    name: 'MR-01 LD', 
    description: 'Formulir Pencatatan Kasus Lanjutan', 
    icon: ClipboardList,
    bgHex: '#E8F5E9',
    iconHex: '#43A047'
  },
  { 
    id: 'mr-04', 
    name: 'MR-04', 
    description: 'Formulir Investigasi', 
    icon: Eye,
    bgHex: '#F3E5F5',
    iconHex: '#8E24AA'
  },
  { 
    id: 'formulir-05', 
    name: 'Formulir 05', 
    description: 'Formulir Pelaporan Mingguan', 
    icon: Calendar,
    bgHex: '#FFF3E0',
    iconHex: '#FB8C00'
  },
  { 
    id: 'pemantauan-kontak', 
    name: 'Pemantauan Kontak', 
    description: 'Pencatatan Kontak Erat', 
    icon: ContactRound,
    bgHex: '#FFEBEE',
    iconHex: '#E53935'
  },
  { 
    id: 'hasil-lab', 
    name: 'Hasil Lab', 
    description: 'Hasil Laboratorium', 
    icon: FlaskConical,
    bgHex: '#E0F7FA',
    iconHex: '#039BE5'
  },
];

export function DiseaseSubmenuPage({ disease, onNavigate, onBack, isOnline, user, onLogout }: DiseaseSubmenuPageProps) {
  const handleFormClick = (formId: string) => {
    onNavigate('resume-kasus', { disease, form: formId });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card shadow-sm border-b border-border">
        <div className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={onBack}
                className="p-2 hover:bg-muted rounded-lg"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[#4CAF50] text-white">
                <Building2 className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-black">{user.puskesmas}</h1>
                <p className="text-sm flex items-center gap-1 text-[#607D8B]">
                  <MapPin className="w-3 h-3" />
                  {user.location}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                className="p-3 hover:bg-muted rounded-lg transition-colors"
                onClick={() => onNavigate('weekly-report')}
              >
                <TrendingUp className="w-6 h-6 text-blue-500" />
              </button>
              <Button
                variant="ghost"
                size="sm"
                onClick={onLogout}
                className="flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground hover:text-foreground"
              >
                <LogOut className="w-4 h-4" />
                Keluar
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-6 pt-6 max-w-5xl mx-auto">
        {/* Online Status Card */}
        <div className="px-4">
          <div className="rounded-xl shadow-md p-4 border border-transparent bg-[#C8E6C9] flex items-center gap-3">
            {isOnline ? (
              <Wifi className="w-5 h-5 text-[#4CAF50]" />
            ) : (
              <WifiOff className="w-5 h-5 text-red-500" />
            )}
            <span className="text-sm text-black">
              Status: {isOnline ? 'Online – Data akan tersinkron otomatis' : 'Offline – Data tersimpan lokal'}
            </span>
          </div>
        </div>

        {/* Welcome Section for selected disease */}
        <div className="px-4">
          <div className="rounded-xl shadow-md p-4 border border-transparent bg-[#E8F5E9]">
            <div className="flex items-center gap-3">
              <Stethoscope className="w-6 h-6 text-[#4CAF50]" />
              <div>
                <p className="font-medium text-black">{diseaseNames[disease]}</p>
                <p className="text-sm text-[#607D8B]">Pilih formulir untuk pencatatan</p>
              </div>
            </div>
          </div>
        </div>

        <div className="px-4">
          {/* Forms Grid */}
          <div className="grid grid-cols-1 gap-4">
            {forms.map((form) => (
              <Card 
                key={form.id}
                className={`cursor-pointer transition-all hover:shadow-lg active:scale-95 rounded-xl border-0`}
                style={{ backgroundColor: form.bgHex, boxShadow: '0 1px 3px rgba(0,0,0,0.08)'}}
                onClick={() => handleFormClick(form.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-white/60 rounded-lg flex items-center justify-center">
                      <form.icon className="w-6 h-6" style={{ color: form.iconHex }} />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-base text-black">{form.name}</h3>
                      <p className="text-sm mt-1" style={{ color: '#607D8B' }}>{form.description}</p>
                    </div>
                    <div className="text-gray-400">
                      <ArrowLeft className="w-5 h-5 rotate-180" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Quick Stats */}
          <div className="mt-6 bg-card border border-border rounded-lg p-4">
            <h3 className="font-medium mb-3 flex items-center gap-2">
              <Activity className="w-5 h-5" />
              Statistik {diseaseNames[disease]}
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center bg-primary/10 rounded-lg p-3">
                <div className="text-xl font-bold text-primary">5</div>
                <div className="text-xs text-muted-foreground">Kasus Aktif</div>
              </div>
              <div className="text-center bg-accent/10 rounded-lg p-3">
                <div className="text-xl font-bold text-accent">12</div>
                <div className="text-xs text-muted-foreground">Total Kasus</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
