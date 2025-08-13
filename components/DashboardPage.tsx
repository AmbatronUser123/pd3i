import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { StatusIndicator } from './StatusIndicator';
import { User, Page } from '../App';
import { 
  Activity, 
  FileText, 
  Search, 
  TrendingUp, 
  Users, 
  AlertTriangle,
  Stethoscope,
  Building2,
  Heart,
  Thermometer,
  Waves,
  UserCircle,
  Zap,
  Shield,
  LogOut,
  MapPin
} from 'lucide-react';

interface DashboardPageProps {
  user: User;
  onNavigate: (page: Page, options?: { disease?: string; form?: string }) => void;
  onLogout: () => void;
  isOnline: boolean;
}

const diseases = [
  { 
    id: 'campak-rubela', 
    name: 'Campak-Rubela', 
    icon: Heart, 
    color: 'bg-red-50 border-red-100 hover:bg-red-100',
    iconColor: 'text-red-500'
  },
  { 
    id: 'difteri', 
    name: 'Difteri', 
    icon: Thermometer, 
    color: 'bg-orange-50 border-orange-100 hover:bg-orange-100',
    iconColor: 'text-orange-500'
  },
  { 
    id: 'pertusis', 
    name: 'Pertusis', 
    icon: Waves, 
    color: 'bg-blue-50 border-blue-100 hover:bg-blue-100',
    iconColor: 'text-blue-500'
  },
  { 
    id: 'tetanus', 
    name: 'Tetanus', 
    icon: Zap, 
    color: 'bg-yellow-50 border-yellow-100 hover:bg-yellow-100',
    iconColor: 'text-yellow-600'
  },
  { 
    id: 'polio', 
    name: 'Polio', 
    icon: UserCircle, 
    color: 'bg-purple-50 border-purple-100 hover:bg-purple-100',
    iconColor: 'text-purple-500'
  },
  { 
    id: 'hepatitis', 
    name: 'Hepatitis', 
    icon: Shield, 
    color: 'bg-green-50 border-green-100 hover:bg-green-100',
    iconColor: 'text-green-600'
  },
];

const shortcuts = [
  { 
    id: 'hasil-lab', 
    name: 'Hasil Lab', 
    icon: Search, 
    description: 'Kelola hasil laboratorium',
    color: 'bg-cyan-50 border-cyan-100 hover:bg-cyan-100',
    iconColor: 'text-cyan-600',
    page: 'lab-results' as Page
  },
  { 
    id: 'pedoman', 
    name: 'Pedoman Surveilans', 
    icon: FileText, 
    description: 'Panduan surveilans penyakit',
    color: 'bg-indigo-50 border-indigo-100 hover:bg-indigo-100',
    iconColor: 'text-indigo-600',
    page: 'surveillance-guidelines' as Page
  },
];

export function DashboardPage({ user, onNavigate, onLogout, isOnline }: DashboardPageProps) {
  const handleDiseaseClick = (diseaseId: string) => {
    onNavigate('disease-submenu', { disease: diseaseId });
  };

  const handleShortcutClick = (shortcutPage: Page) => {
    onNavigate(shortcutPage);
  };

  const handleWeeklyReport = () => {
    onNavigate('weekly-report');
  };

  return (
    <div className="min-h-screen bg-background pt-11">
      {/* Header */}
      <div className="bg-card shadow-sm border-b border-border">
        <div className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                <Building2 className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-lg font-semibold">{user.puskesmas}</h1>
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {user.location}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleWeeklyReport}
                className="p-3 hover:bg-muted rounded-lg transition-colors"
              >
                <TrendingUp className="w-6 h-6 text-accent" />
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

      <div className="space-y-6">
        {/* Welcome message */}
        <div className="p-4">
          <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <Stethoscope className="w-6 h-6 text-primary" />
              <div>
                <p className="font-medium">Selamat datang, {user.username}</p>
                <p className="text-sm text-muted-foreground">Pilih penyakit untuk mulai pencatatan kasus</p>
              </div>
            </div>
          </div>
        </div>

        {/* Status Indicator - positioned before content */}
        <StatusIndicator isOnline={isOnline} />

        <div className="px-4 space-y-6">
          {/* Disease Cards */}
          <div>
            <h2 className="text-lg font-semibold mb-4">Penyakit LP3I</h2>
            <div className="grid grid-cols-2 gap-4">
              {diseases.map((disease) => (
                <Card 
                  key={disease.id} 
                  className={`cursor-pointer transition-all hover:shadow-lg active:scale-95 ${disease.color}`}
                  onClick={() => handleDiseaseClick(disease.id)}
                >
                  <CardContent className="p-4 text-center">
                    <div className="mb-3">
                      <disease.icon className={`w-8 h-8 mx-auto ${disease.iconColor}`} />
                    </div>
                    <h3 className="font-medium text-sm">{disease.name}</h3>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Surveillance Features - Updated label and increased spacing */}
          <div className="pt-4">
            <h2 className="text-lg font-semibold mb-4">Fitur Surveilans</h2>
            <div className="space-y-3">
              {shortcuts.map((shortcut) => (
                <Card 
                  key={shortcut.id} 
                  className={`cursor-pointer transition-all hover:shadow-md active:scale-95 ${shortcut.color}`}
                  onClick={() => handleShortcutClick(shortcut.page)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-white/60 rounded-lg flex items-center justify-center">
                        <shortcut.icon className={`w-6 h-6 ${shortcut.iconColor}`} />
                      </div>
                      <div>
                        <h3 className="font-medium">{shortcut.name}</h3>
                        <p className="text-sm text-muted-foreground">{shortcut.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Stats Summary */}
          <div className="bg-card border border-border rounded-lg p-4">
            <h3 className="font-medium mb-3 flex items-center gap-2">
              <Activity className="w-5 h-5" />
              Ringkasan Minggu Ini
            </h3>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <Activity className="w-5 h-5 text-blue-600" />
                </div>
                <div className="text-2xl font-bold text-primary">12</div>
                <div className="text-xs text-muted-foreground">Kasus Baru</div>
              </div>
              <div>
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <Users className="w-5 h-5 text-orange-600" />
                </div>
                <div className="text-2xl font-bold text-accent">8</div>
                <div className="text-xs text-muted-foreground">Dalam Pengawasan</div>
              </div>
              <div>
                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                </div>
                <div className="text-2xl font-bold text-secondary">3</div>
                <div className="text-xs text-muted-foreground">Perlu Tindak Lanjut</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
