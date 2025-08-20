import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
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
  MapPin,
  Wifi,
  WifiOff
} from 'lucide-react';
import { useState, useEffect } from 'react';

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
    bgHex: '#FFEBEE',
    iconHex: '#E53935'
  },
  { 
    id: 'difteri', 
    name: 'Difteri', 
    icon: Thermometer, 
    bgHex: '#FFF3E0',
    iconHex: '#FB8C00'
  },
  { 
    id: 'pertusis', 
    name: 'Pertusis', 
    icon: Waves, 
    bgHex: '#E3F2FD',
    iconHex: '#1E88E5'
  },
  { 
    id: 'tetanus', 
    name: 'Tetanus', 
    icon: Zap, 
    bgHex: '#FFFDE7',
    iconHex: '#F9A825'
  },
  { 
    id: 'polio', 
    name: 'Polio', 
    icon: UserCircle, 
    bgHex: '#F3E5F5',
    iconHex: '#8E24AA'
  },
  { 
    id: 'hepatitis', 
    name: 'Hepatitis', 
    icon: Shield, 
    bgHex: '#E8F5E9',
    iconHex: '#43A047'
  },
];

const shortcuts = [
  { 
    id: 'hasil-lab', 
    name: 'Hasil Lab', 
    icon: Search, 
    description: 'Kelola hasil laboratorium',
    bgHex: '#E0F7FA',
    iconHex: '#039BE5',
    page: 'lab-results' as Page
  },
  { 
    id: 'pedoman', 
    name: 'Pedoman Surveilans', 
    icon: FileText, 
    description: 'Panduan surveilans penyakit',
    bgHex: '#EDE7F6',
    iconHex: '#5E35B1',
    page: 'surveillance-guidelines' as Page
  },
];

export function DashboardPage({ user, onNavigate, onLogout, isOnline }: DashboardPageProps) {
  const [weeklyStats, setWeeklyStats] = useState({
    newCases: 0,
    underMonitoring: 0,
    needsFollowUp: 0
  });

  useEffect(() => {
    const loadWeeklyStats = () => {
      try {
        const localCasesRaw = localStorage.getItem('spasi_cases');
        if (!localCasesRaw) return;
        
        const localCases = JSON.parse(localCasesRaw) || [];
        const now = new Date();
        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - now.getDay()); // Start of current week (Sunday)
        
        const weeklyCases = localCases.filter((c: any) => {
          const caseDate = new Date(c.submitted_at || c.last_modified || c.created_at);
          return caseDate >= startOfWeek;
        });

        const stats = weeklyCases.reduce((acc: any, c: any) => {
          if (c.status === 'submitted') acc.underMonitoring++;
          if (c.status === 'completed') acc.newCases++;
          if (c.needs_follow_up) acc.needsFollowUp++;
          return acc;
        }, { newCases: 0, underMonitoring: 0, needsFollowUp: 0 });

        setWeeklyStats(stats);
      } catch (error) {
        console.error('Error loading weekly stats:', error);
      }
    };

    loadWeeklyStats();
    
    const loadFromSupabase = async () => {
      if (!isOnline) return;
      
      try {
        const { kasusMR01Operations } = await import('../utils/supabase/client');
        const now = new Date();
        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - now.getDay());
        
        const rows = await kasusMR01Operations.getByUser(user.id);
        if (!rows) return;
        
        const weeklyCases = rows.filter((r: any) => {
          const caseDate = new Date(r.updated_at || r.created_at);
          return caseDate >= startOfWeek;
        });

        const stats = weeklyCases.reduce((acc: any, r: any) => {
          if (r.status === 'submitted') acc.underMonitoring++;
          if (r.status === 'completed') acc.newCases++;
          if (r.needs_follow_up) acc.needsFollowUp++;
          return acc;
        }, { newCases: 0, underMonitoring: 0, needsFollowUp: 0 });

        setWeeklyStats(prev => ({
          newCases: Math.max(prev.newCases, stats.newCases),
          underMonitoring: Math.max(prev.underMonitoring, stats.underMonitoring),
          needsFollowUp: Math.max(prev.needsFollowUp, stats.needsFollowUp)
        }));
      } catch (error) {
        console.error('Error loading weekly stats from Supabase:', error);
      }
    };

    loadFromSupabase();
  }, [user.id, isOnline]);

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
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card shadow-sm border-b border-border">
        <div className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
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
                onClick={handleWeeklyReport}
                className="p-3 hover:bg-muted rounded-lg transition-colors"
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
        {/* Welcome message */}
        <div className="px-4">
          <div className="rounded-xl shadow-md p-4 border border-transparent bg-[#E8F5E9]">
            <div className="flex items-center gap-3">
              <Stethoscope className="w-6 h-6 text-[#4CAF50]" />
              <div>
                <p className="font-medium text-black">Selamat datang, {user.username}</p>
                <p className="text-sm text-[#607D8B]">Pilih penyakit untuk mulai pencatatan kasus</p>
              </div>
            </div>
          </div>
        </div>

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

        <div className="px-4 space-y-6">
          {/* Disease Cards */}
          <div>
            <h2 className="text-lg font-bold mb-4 text-black">Penyakit LP3I</h2>
            <div className="grid grid-cols-2 gap-4">
              {diseases.map((disease) => (
                <Card
                  key={disease.id}
                  className={`cursor-pointer transition-all hover:shadow-lg active:scale-95 rounded-xl border-0`}
                  onClick={() => handleDiseaseClick(disease.id)}
                  style={{ backgroundColor: disease.bgHex }}
                >
                  <CardContent className="p-4 text-center">
                    <div className="mb-3">
                      <disease.icon className="w-8 h-8 mx-auto" style={{ color: disease.iconHex }} />
                    </div>
                    <h3 className="font-bold text-sm text-black">{disease.name}</h3>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Surveillance Features - Updated label and increased spacing */}
          <div className="pt-4">
            <h2 className="text-lg font-bold mb-4 text-black">Fitur Surveilans</h2>
            <div className="space-y-3">
              {shortcuts.map((shortcut) => (
                <Card
                  key={shortcut.id}
                  className={`cursor-pointer transition-all hover:shadow-md active:scale-95 rounded-xl border-0`}
                  onClick={() => handleShortcutClick(shortcut.page)}
                  style={{ backgroundColor: shortcut.bgHex }}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-white/60 rounded-lg flex items-center justify-center">
                        <shortcut.icon className="w-6 h-6" style={{ color: shortcut.iconHex }} />
                      </div>
                      <div>
                        <h3 className="font-bold text-black">{shortcut.name}</h3>
                        <p className="text-sm" style={{ color: '#607D8B' }}>{shortcut.description}</p>
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
                <div className="text-2xl font-bold text-primary">{weeklyStats.newCases}</div>
                <div className="text-xs text-muted-foreground">Kasus Baru</div>
              </div>
              <div>
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <Users className="w-5 h-5 text-orange-600" />
                </div>
                <div className="text-2xl font-bold text-accent">{weeklyStats.underMonitoring}</div>
                <div className="text-xs text-muted-foreground">Dalam Pengawasan</div>
              </div>
              <div>
                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                </div>
                <div className="text-2xl font-bold text-secondary">{weeklyStats.needsFollowUp}</div>
                <div className="text-xs text-muted-foreground">Perlu Tindak Lanjut</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
