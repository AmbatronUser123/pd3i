import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { User } from '../App';
import { 
  ArrowLeft, 
  TrendingUp, 
  TrendingDown, 
  Calendar,
  AlertTriangle,
  Activity,
  BarChart3,
  FileDown,
  Send,
  Building2,
  Heart,
  PieChart,
  Wifi,
  WifiOff
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

interface WeeklyReportPageProps {
  user: User;
  onBack: () => void;
  isOnline: boolean;
}

const diseases = [
  { id: 'all', name: 'Semua Penyakit' },
  { id: 'campak-rubela', name: 'Campak-Rubela' },
  { id: 'difteri', name: 'Difteri' },
  { id: 'pertusis', name: 'Pertusis' },
  { id: 'tetanus', name: 'Tetanus' },
  { id: 'polio', name: 'Polio' },
  { id: 'hepatitis', name: 'Hepatitis' },
];

const weeks = [
  { id: 'week-1', name: 'Minggu 1 (1-7 Jan 2024)' },
  { id: 'week-2', name: 'Minggu 2 (8-14 Jan 2024)' },
  { id: 'week-3', name: 'Minggu 3 (15-21 Jan 2024)' },
  { id: 'week-4', name: 'Minggu 4 (22-28 Jan 2024)' },
];

const mockChartData = [
  { name: 'Minggu 1', cases: 12, deaths: 0, recovered: 10 },
  { name: 'Minggu 2', cases: 8, deaths: 1, recovered: 9 },
  { name: 'Minggu 3', cases: 15, deaths: 0, recovered: 12 },
  { name: 'Minggu 4', cases: 6, deaths: 0, recovered: 14 },
];

const mockDiseaseData = [
  { name: 'Campak-Rubela', cases: 15, color: '#FF6B6B' },
  { name: 'Difteri', cases: 8, color: '#4ECDC4' },
  { name: 'Pertusis', cases: 12, color: '#45B7D1' },
  { name: 'Tetanus', cases: 3, color: '#96CEB4' },
  { name: 'Polio', cases: 1, color: '#FFEAA7' },
  { name: 'Hepatitis', cases: 2, color: '#DDA0DD' },
];

export function WeeklyReportPage({ user, onBack, isOnline }: WeeklyReportPageProps) {
  const [selectedDisease, setSelectedDisease] = useState('all');
  const [selectedWeek, setSelectedWeek] = useState('week-4');

  const totalCases = mockChartData.reduce((sum, item) => sum + item.cases, 0);
  const totalDeaths = mockChartData.reduce((sum, item) => sum + item.deaths, 0);
  const totalRecovered = mockChartData.reduce((sum, item) => sum + item.recovered, 0);
  const klbStatus = totalCases > 20 ? 'KLB' : 'Normal';

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
                <h1 className="text-lg font-semibold flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Rekap Mingguan
                </h1>
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <Building2 className="w-4 h-4" />
                  {user.puskesmas}
                </p>
              </div>
            </div>

            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label htmlFor="weekly-disease" className="block text-sm font-medium mb-2">Penyakit</label>
                <Select value={selectedDisease} onValueChange={setSelectedDisease}>
                  <SelectTrigger id="weekly-disease" aria-labelledby="weekly-disease">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {diseases.map(disease => (
                      <SelectItem key={disease.id} value={disease.id}>
                        {disease.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label htmlFor="weekly-periode" className="block text-sm font-medium mb-2">Periode</label>
                <Select value={selectedWeek} onValueChange={setSelectedWeek}>
                  <SelectTrigger id="weekly-periode" aria-labelledby="weekly-periode">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {weeks.map(week => (
                      <SelectItem key={week.id} value={week.id}>
                        {week.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-4 text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <Activity className="w-6 h-6 text-blue-600" />
                </div>
                <div className="text-2xl font-bold text-blue-600">{totalCases}</div>
                <div className="text-xs text-muted-foreground">Total Kasus</div>
              </CardContent>
            </Card>

            <Card className="bg-red-50 border-red-200">
              <CardContent className="p-4 text-center">
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <TrendingDown className="w-6 h-6 text-red-600" />
                </div>
                <div className="text-2xl font-bold text-red-600">{totalDeaths}</div>
                <div className="text-xs text-muted-foreground">Meninggal</div>
              </CardContent>
            </Card>

            <Card className="bg-green-50 border-green-200">
              <CardContent className="p-4 text-center">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <Heart className="w-6 h-6 text-green-600" />
                </div>
                <div className="text-2xl font-bold text-green-600">{totalRecovered}</div>
                <div className="text-xs text-muted-foreground">Sembuh</div>
              </CardContent>
            </Card>

            <Card className={klbStatus === 'KLB' ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200'}>
              <CardContent className="p-4 text-center">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-2 ${
                  klbStatus === 'KLB' ? 'bg-red-100' : 'bg-green-100'
                }`}>
                  <AlertTriangle className={`w-6 h-6 ${
                    klbStatus === 'KLB' ? 'text-red-600' : 'text-green-600'
                  }`} />
                </div>
                <div className={`text-2xl font-bold ${
                  klbStatus === 'KLB' ? 'text-red-600' : 'text-green-600'
                }`}>
                  {klbStatus}
                </div>
                <div className="text-xs text-muted-foreground">Status KLB</div>
              </CardContent>
            </Card>
          </div>

          {/* Trend Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Tren Kasus Mingguan
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={mockChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="cases" 
                    stroke="#4CAF50" 
                    strokeWidth={3}
                    name="Kasus Baru"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="recovered" 
                    stroke="#2196F3" 
                    strokeWidth={3}
                    name="Sembuh"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="deaths" 
                    stroke="#F44336" 
                    strokeWidth={3}
                    name="Meninggal"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Disease Distribution */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart className="w-5 h-5" />
                Distribusi Penyakit
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={mockDiseaseData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="cases" fill="#4CAF50" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Weekly Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Detail Mingguan
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockChartData.map((week, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg border">
                    <div>
                      <h4 className="font-medium flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        {week.name}
                      </h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        {week.cases} kasus baru • {week.recovered} sembuh • {week.deaths} meninggal
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-primary">{week.cases}</div>
                      <div className="text-xs text-muted-foreground">Kasus</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button variant="outline" className="spasi-button-secondary">
              <FileDown className="w-4 h-4 mr-2" />
              Ekspor Laporan
            </Button>
            <Button className="spasi-button">
              <Send className="w-4 h-4 mr-2" />
              Kirim ke Dinkes
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
