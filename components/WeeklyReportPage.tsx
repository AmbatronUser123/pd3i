import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { User } from '../App';
import { 
  ArrowLeft,
  BarChart3,
  Building2,
  Wifi,
  WifiOff,
  Activity,
  Heart,
  AlertTriangle
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';

interface WeeklyReportPageProps {
  user: User;
  onBack: () => void;
  isOnline: boolean;
}

interface CaseData {
  id: string;
  disease: string;
  form: string;
  status: string;
  submissionDate: string;
  formData: any;
  synced: boolean;
}

export function WeeklyReportPage({ user, onBack, isOnline }: WeeklyReportPageProps) {
  const [cases, setCases] = useState<CaseData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Get cases from localStorage
  useEffect(() => {
    const loadCases = () => {
      const localCasesRaw = localStorage.getItem('spasi_cases');
      let localCases: CaseData[] = [];
      
      if (localCasesRaw) {
        try {
          localCases = JSON.parse(localCasesRaw);
        } catch (e) {
          console.error('Error parsing cases from localStorage:', e);
        }
      }
      
      // Filter only submitted/completed cases
      const filteredCases = localCases.filter(c => 
        (c.status === 'submitted' || c.status === 'completed')
      );
      
      setCases(filteredCases);
      setIsLoading(false);
    };
    
    loadCases();
    
    // Listen for storage changes to update in real-time
    const handleStorageChange = () => loadCases();
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Process data for charts and statistics
  const processData = () => {
    // Group cases by week
    const weeklyData: Record<string, { cases: number; deaths: number; recovered: number }> = {};
    const diseaseData: Record<string, number> = {};
    
    cases.forEach(c => {
      if (!c.submissionDate) return;
      
      // Get week number from submission date
      const date = new Date(c.submissionDate);
      const weekNum = Math.ceil(date.getDate() / 7);
      const weekKey = `Minggu ${weekNum}`;
      
      // Initialize week data if not exists
      if (!weeklyData[weekKey]) {
        weeklyData[weekKey] = { cases: 0, deaths: 0, recovered: 0 };
      }
      
      // Count cases
      weeklyData[weekKey].cases++;
      
      // Count by disease
      if (c.disease) {
        const diseaseName = c.disease;
        diseaseData[diseaseName] = (diseaseData[diseaseName] || 0) + 1;
      }
    });
    
    // Convert to array for charts
    const chartData = Object.entries(weeklyData).map(([name, data]) => ({
      name,
      ...data
    }));
    
    const diseaseChartData = Object.entries(diseaseData).map(([name, cases]) => ({
      name,
      cases,
      color: getRandomColor()
    }));
    
    return { chartData, diseaseChartData };
  };
  
  const { chartData, diseaseChartData } = processData();
  
  const totalCases = cases.length;
  const totalRecovered = cases.filter(c => c.status === 'completed').length;
  const klbStatus = totalCases > 20 ? 'KLB' : 'Normal';

  // Helper function to generate random colors for the chart
  const getRandomColor = () => {
    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD'];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Memuat data...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="pt-6 max-w-5xl mx-auto">
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
                <h1 className="text-lg font-semibold flex items-center gap-2 text-black">
                  <BarChart3 className="w-5 h-5" />
                  Rekap Mingguan
                </h1>
                <p className="text-sm flex items-center gap-1 text-[#607D8B]">
                  <Building2 className="w-4 h-4" />
                  {user.puskesmas}
                </p>
              </div>
            </div>
            {/* Status Card */}
            <div className="rounded-xl shadow-md p-4 border border-transparent bg-[#C8E6C9] flex items-center gap-3 mb-4">
              {isOnline ? <Wifi className="w-5 h-5 text-[#4CAF50]" /> : <WifiOff className="w-5 h-5 text-red-500" />}
              <span className="text-sm font-medium">
                {isOnline ? 'Terhubung ke server' : 'Mode offline - Data disimpan secara lokal'}
              </span>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="p-4 space-y-6">
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="bg-white">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Kasus</p>
                    <p className="text-2xl font-bold">{totalCases}</p>
                  </div>
                  <div className="p-3 rounded-full bg-blue-100">
                    <Activity className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Sembuh</p>
                    <p className="text-2xl font-bold text-green-600">{totalRecovered}</p>
                  </div>
                  <div className="p-3 rounded-full bg-green-100">
                    <Heart className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Status KLB</p>
                    <p className="text-2xl font-bold">
                      <span className={klbStatus === 'KLB' ? 'text-red-600' : 'text-green-600'}>
                        {klbStatus}
                      </span>
                    </p>
                  </div>
                  <div className="p-3 rounded-full bg-yellow-100">
                    <AlertTriangle className="w-6 h-6 text-yellow-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Puskesmas</p>
                    <p className="text-lg font-medium">{user.puskesmas}</p>
                  </div>
                  <div className="p-3 rounded-full bg-purple-100">
                    <Building2 className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Cases Over Time */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base font-semibold">Kasus per Minggu</CardTitle>
              </CardHeader>
              <CardContent className="h-64">
                {chartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Line 
                        type="monotone" 
                        dataKey="cases" 
                        name="Kasus"
                        stroke="#4F46E5" 
                        strokeWidth={2} 
                        dot={{ r: 4 }}
                        activeDot={{ r: 6 }} 
                      />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center text-muted-foreground">
                    Tidak ada data kasus untuk ditampilkan
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Cases by Disease */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base font-semibold">Kasus per Penyakit</CardTitle>
              </CardHeader>
              <CardContent className="h-64">
                {diseaseChartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={diseaseChartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar 
                        dataKey="cases" 
                        name="Kasus"
                        radius={[4, 4, 0, 0]}
                      >
                        {diseaseChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center text-muted-foreground">
                    Tidak ada data penyakit untuk ditampilkan
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
