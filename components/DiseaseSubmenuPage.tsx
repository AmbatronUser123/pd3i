import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Page } from '../App';
import { 
  ArrowLeft, 
  FileText, 
  Users, 
  TestTube, 
  ClipboardList, 
  Eye,
  Calendar,
  Clipboard,
  UserSearch,
  FlaskConical,
  FileCheck,
  ContactRound,
  Activity,
  Wifi,
  WifiOff
} from 'lucide-react';

interface DiseaseSubmenuPageProps {
  disease: string;
  onNavigate: (page: Page, options?: { disease?: string; form?: string }) => void;
  onBack: () => void;
  isOnline: boolean;
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
    color: 'bg-blue-50 border-blue-100 hover:bg-blue-100',
    iconColor: 'text-blue-600'
  },
  { 
    id: 'mr-01-ld', 
    name: 'MR-01 LD', 
    description: 'Formulir Pencatatan Kasus Lanjutan', 
    icon: ClipboardList,
    color: 'bg-green-50 border-green-100 hover:bg-green-100',
    iconColor: 'text-green-600'
  },
  { 
    id: 'mr-04', 
    name: 'MR-04', 
    description: 'Formulir Investigasi', 
    icon: Eye,
    color: 'bg-purple-50 border-purple-100 hover:bg-purple-100',
    iconColor: 'text-purple-600'
  },
  { 
    id: 'formulir-05', 
    name: 'Formulir 05', 
    description: 'Formulir Pelaporan Mingguan', 
    icon: Calendar,
    color: 'bg-orange-50 border-orange-100 hover:bg-orange-100',
    iconColor: 'text-orange-600'
  },
  { 
    id: 'pemantauan-kontak', 
    name: 'Pemantauan Kontak', 
    description: 'Pencatatan Kontak Erat', 
    icon: ContactRound,
    color: 'bg-pink-50 border-pink-100 hover:bg-pink-100',
    iconColor: 'text-pink-600'
  },
  { 
    id: 'hasil-lab', 
    name: 'Hasil Lab', 
    description: 'Hasil Laboratorium', 
    icon: FlaskConical,
    color: 'bg-cyan-50 border-cyan-100 hover:bg-cyan-100',
    iconColor: 'text-cyan-600'
  },
];

export function DiseaseSubmenuPage({ disease, onNavigate, onBack, isOnline }: DiseaseSubmenuPageProps) {
  const handleFormClick = (formId: string) => {
    onNavigate('resume-kasus', { disease, form: formId });
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
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={onBack}
                className="p-2 hover:bg-muted rounded-lg"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="text-lg font-semibold">{diseaseNames[disease]}</h1>
                <p className="text-sm text-muted-foreground">Pilih formulir untuk pencatatan</p>
              </div>
            </div>
          </div>
        </div>

        <div className="p-4">
          {/* Forms Grid */}
          <div className="grid grid-cols-1 gap-4">
            {forms.map((form) => (
              <Card 
                key={form.id}
                className={`cursor-pointer transition-all hover:shadow-lg active:scale-95 ${form.color}`}
                onClick={() => handleFormClick(form.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-white/60 rounded-lg flex items-center justify-center">
                      <form.icon className={`w-6 h-6 ${form.iconColor}`} />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-base">{form.name}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{form.description}</p>
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
