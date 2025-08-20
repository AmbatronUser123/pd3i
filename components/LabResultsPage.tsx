import { useState, useEffect, type ChangeEvent } from 'react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Textarea } from './ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Badge } from './ui/badge';
import { User } from '../App';
import { 
  ArrowLeft, 
  Plus, 
  Upload, 
  Search,
  Edit,
  Trash2,
  FlaskConical,
  Calendar,
  FileText,
  Building2,
  Save,
  AlertCircle,
  CheckCircle2,
  Clock,
  XCircle,
  Wifi,
  WifiOff
} from 'lucide-react';

interface LabResultsPageProps {
  user: User;
  onBack: () => void;
  isOnline: boolean;
}

interface LabResult {
  id: string;
  caseId: string;
  patientName: string;
  specimenType: string;
  collectionDate: string;
  examinationDate: string;
  testType: string;
  result: 'Positif' | 'Negatif' | 'Invalid' | 'Menunggu';
  laboratory: string;
  notes?: string;
  createdAt: string;
  synced: boolean;
}

interface NewLabResult {
  caseId: string;
  patientName: string;
  specimenType: string;
  collectionDate: string;
  examinationDate: string;
  testType: string;
  result: string;
  laboratory: string;
  notes: string;
}

const specimenTypes = ['Darah', 'Serum', 'Swab', 'Lainnya'];
const testTypes = ['PCR', 'IgM', 'Kultur', 'Rapid Test'];
const resultTypes = ['Positif', 'Negatif', 'Invalid', 'Menunggu'];

export function LabResultsPage({ user, onBack, isOnline }: LabResultsPageProps) {
  const [labResults, setLabResults] = useState<LabResult[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredResults, setFilteredResults] = useState<LabResult[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newResult, setNewResult] = useState<NewLabResult>({
    caseId: '',
    patientName: '',
    specimenType: '',
    collectionDate: '',
    examinationDate: '',
    testType: '',
    result: '',
    laboratory: '',
    notes: ''
  });

  useEffect(() => {
    const mockResults: LabResult[] = [
      {
        id: '1',
        caseId: 'CR-001',
        patientName: 'Ahmad Santoso',
        specimenType: 'Darah',
        collectionDate: '2024-01-15',
        examinationDate: '2024-01-16',
        testType: 'IgM',
        result: 'Positif',
        laboratory: 'Lab Dinkes Kota',
        notes: 'Titer tinggi, perlu follow up',
        createdAt: '2024-01-16T10:30:00Z',
        synced: true
      },
      {
        id: '2',
        caseId: 'DIP-002',
        patientName: 'Siti Nurhaliza',
        specimenType: 'Swab',
        collectionDate: '2024-01-14',
        examinationDate: '2024-01-15',
        testType: 'Kultur',
        result: 'Negatif',
        laboratory: 'Lab Puskesmas',
        createdAt: '2024-01-15T14:20:00Z',
        synced: false
      },
      {
        id: '3',
        caseId: 'PER-003',
        patientName: 'Budi Prasetyo',
        specimenType: 'Swab',
        collectionDate: '2024-01-13',
        examinationDate: '2024-01-14',
        testType: 'PCR',
        result: 'Menunggu',
        laboratory: 'Lab Regional',
        notes: 'Sampel dalam proses',
        createdAt: '2024-01-13T09:15:00Z',
        synced: false
      }
    ];
    setLabResults(mockResults);
  }, []);

  useEffect(() => {
    const filtered = labResults.filter((result: LabResult) =>
      result.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      result.caseId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      result.laboratory.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredResults(filtered);
  }, [labResults, searchTerm]);

  const handleNewResultChange = (field: keyof NewLabResult, value: string) => {
    setNewResult((prev: NewLabResult) => ({ ...prev, [field]: value }));
  };


  const handleAddResult = () => {
    if (!newResult.caseId || !newResult.patientName || !newResult.specimenType || 
        !newResult.collectionDate || !newResult.testType || !newResult.result) {
      alert('Mohon lengkapi field yang wajib diisi');
      return;
    }

    const result: LabResult = {
      id: Date.now().toString(),
      caseId: newResult.caseId,
      patientName: newResult.patientName,
      specimenType: newResult.specimenType,
      collectionDate: newResult.collectionDate,
      examinationDate: newResult.examinationDate,
      testType: newResult.testType,
      result: newResult.result as LabResult['result'],
      laboratory: newResult.laboratory,
      notes: newResult.notes,
      createdAt: new Date().toISOString(),
      synced: false
    };

    setLabResults((prev: LabResult[]) => [result, ...prev]);
    setNewResult({
      caseId: '',
      patientName: '',
      specimenType: '',
      collectionDate: '',
      examinationDate: '',
      testType: '',
      result: '',
      laboratory: '',
      notes: ''
    });
    setIsAddDialogOpen(false);

    localStorage.setItem(`lab_result_${result.id}`, JSON.stringify(result));
  };

  const handleDeleteResult = (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus hasil lab ini?')) {
      setLabResults((prev: LabResult[]) => prev.filter((r: LabResult) => r.id !== id));
      localStorage.removeItem(`lab_result_${id}`);
    }
  };

  const getResultBadge = (result: LabResult['result']) => {
    switch (result) {
      case 'Positif':
        return (
          <Badge variant="destructive" className="bg-red-100 text-red-800 border-red-200">
            <AlertCircle className="w-3 h-3 mr-1" />
            Positif
          </Badge>
        );
      case 'Negatif':
        return (
          <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-200">
            <CheckCircle2 className="w-3 h-3 mr-1" />
            Negatif
          </Badge>
        );
      case 'Invalid':
        return (
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 border-yellow-200">
            <XCircle className="w-3 h-3 mr-1" />
            Invalid
          </Badge>
        );
      case 'Menunggu':
        return (
          <Badge variant="outline" className="bg-gray-100 text-gray-800 border-gray-200">
            <Clock className="w-3 h-3 mr-1" />
            Menunggu
          </Badge>
        );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-background pt-11">
      <div className={`fixed top-0 left-0 right-0 z-50 px-4 py-2 text-center text-sm ${
        isOnline ? 'bg-primary text-primary-foreground' : 'bg-destructive text-destructive-foreground'
      }`}>
        <div className="flex items-center justify-center gap-2">
          {isOnline ? <Wifi className="w-4 h-4" /> : <WifiOff className="w-4 h-4" />}
          {isOnline ? 'Online - Data akan tersinkronisasi' : 'Offline - Data tersimpan lokal'}
        </div>
      </div>

      <div className="pt-12">
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
                  <FlaskConical className="w-5 h-5" />
                  Hasil Laboratorium
                </h1>
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <Building2 className="w-4 h-4" />
                  {user.puskesmas}
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Cari nama pasien, ID kasus, atau laboratorium..."
                  value={searchTerm}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2">
                <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="spasi-button flex items-center gap-2">
                      <Plus className="w-4 h-4" />
                      Tambah Data
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle className="flex items-center gap-2">
                        <FlaskConical className="w-5 h-5" />
                        Tambah Hasil Lab
                      </DialogTitle>
                      <DialogDescription>
                        Masukkan informasi hasil laboratorium untuk kasus penyakit menular.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-2">
                          <Label htmlFor="caseId">
                            ID Kasus <span className="text-destructive">*</span>
                          </Label>
                          <Input
                            id="caseId"
                            value={newResult.caseId}
                            onChange={(e: ChangeEvent<HTMLInputElement>) => handleNewResultChange('caseId', e.target.value)}
                            placeholder="CR-001"
                            className="spasi-input"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="patientName">
                            Nama Pasien <span className="text-destructive">*</span>
                          </Label>
                          <Input
                            id="patientName"
                            value={newResult.patientName}
                            onChange={(e: ChangeEvent<HTMLInputElement>) => handleNewResultChange('patientName', e.target.value)}
                            placeholder="Ahmad Santoso"
                            className="spasi-input"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-2">
                          <Label>
                            Jenis Spesimen <span className="text-destructive">*</span>
                          </Label>
                          <Select value={newResult.specimenType} onValueChange={(val: string) => handleNewResultChange('specimenType', val)}>
                            <SelectTrigger className="spasi-input">
                              <SelectValue placeholder="Pilih..." />
                            </SelectTrigger>
                            <SelectContent>
                              {specimenTypes.map(type => (
                                <SelectItem key={type} value={type}>{type}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>
                            Jenis Pemeriksaan <span className="text-destructive">*</span>
                          </Label>
                          <Select value={newResult.testType} onValueChange={(val: string) => handleNewResultChange('testType', val)}>
                            <SelectTrigger className="spasi-input">
                              <SelectValue placeholder="Pilih..." />
                            </SelectTrigger>
                            <SelectContent>
                              {testTypes.map(type => (
                                <SelectItem key={type} value={type}>{type}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-2">
                          <Label htmlFor="collectionDate">
                            Tgl Pengambilan <span className="text-destructive">*</span>
                          </Label>
                          <Input
                            id="collectionDate"
                            type="date"
                            value={newResult.collectionDate}
                            onChange={(e: ChangeEvent<HTMLInputElement>) => handleNewResultChange('collectionDate', e.target.value)}
                            className="spasi-input"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="examinationDate">Tgl Pemeriksaan</Label>
                          <Input
                            id="examinationDate"
                            type="date"
                            value={newResult.examinationDate}
                            onChange={(e: ChangeEvent<HTMLInputElement>) => handleNewResultChange('examinationDate', e.target.value)}
                            className="spasi-input"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>
                          Hasil Pemeriksaan <span className="text-destructive">*</span>
                        </Label>
                        <RadioGroup 
                          value={newResult.result}
                          onValueChange={(val: string) => handleNewResultChange('result', val)}
                        >
                          <div className="grid grid-cols-2 gap-2">
                            {resultTypes.map(type => (
                              <div key={type} className="flex items-center space-x-2">
                                <RadioGroupItem value={type} id={`result-${type}`} />
                                <Label htmlFor={`result-${type}`}>{type}</Label>
                              </div>
                            ))}
                          </div>
                        </RadioGroup>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="laboratory">
                          Laboratorium <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          id="laboratory"
                          value={newResult.laboratory}
                          onChange={(e: ChangeEvent<HTMLInputElement>) => handleNewResultChange('laboratory', e.target.value)}
                          placeholder="Lab Dinkes Kota"
                          className="spasi-input"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="notes">Catatan Tambahan</Label>
                        <Textarea
                          id="notes"
                          value={newResult.notes}
                          onChange={(e: ChangeEvent<HTMLTextAreaElement>) => handleNewResultChange('notes', e.target.value)}
                          placeholder="Catatan hasil pemeriksaan..."
                          className="spasi-input min-h-[80px]"
                        />
                      </div>

                      <div className="flex gap-3 pt-4">
                        <Button
                          variant="outline"
                          onClick={() => setIsAddDialogOpen(false)}
                          className="flex-1"
                        >
                          Batal
                        </Button>
                        <Button
                          onClick={handleAddResult}
                          className="flex-1 spasi-button"
                        >
                          <Save className="w-4 h-4 mr-2" />
                          Simpan
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>

                <Button variant="outline" className="flex items-center gap-2">
                  <Upload className="w-4 h-4" />
                  Upload Scan
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="p-4">
          {filteredResults.length === 0 ? (
            <Card className="p-8 text-center">
              <div className="text-muted-foreground">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                  <FlaskConical className="w-8 h-8 opacity-50" />
                </div>
                <p className="text-lg mb-2">Belum ada hasil laboratorium</p>
                <p className="text-sm">Tekan tombol "Tambah Data" untuk menambah hasil lab</p>
              </div>
            </Card>
          ) : (
            <Card>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID Kasus</TableHead>
                      <TableHead>Nama Pasien</TableHead>
                      <TableHead>Spesimen</TableHead>
                      <TableHead>Test</TableHead>
                      <TableHead>Hasil</TableHead>
                      <TableHead>Lab</TableHead>
                      <TableHead>Tgl Ambil</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredResults.map((result: LabResult) => (
                      <TableRow 
                        key={result.id}
                        className={result.result === 'Positif' ? 'bg-red-50 border-red-100' : ''}
                      >
                        <TableCell>
                          <button className="text-primary hover:underline font-medium">
                            {result.caseId}
                          </button>
                        </TableCell>
                        <TableCell className="font-medium">{result.patientName}</TableCell>
                        <TableCell>{result.specimenType}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-xs">
                            {result.testType}
                          </Badge>
                        </TableCell>
                        <TableCell>{getResultBadge(result.result)}</TableCell>
                        <TableCell className="text-sm">{result.laboratory}</TableCell>
                        <TableCell className="text-sm">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3 text-muted-foreground" />
                            {new Date(result.collectionDate).toLocaleDateString('id-ID')}
                          </div>
                        </TableCell>
                        <TableCell>
                          {!result.synced && (
                            <div className="flex items-center gap-1 text-orange-600">
                              <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
                              <span className="text-xs">Belum sync</span>
                            </div>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="p-1 h-8 w-8 hover:bg-blue-50 text-blue-600"
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteResult(result.id)}
                              className="p-1 h-8 w-8 hover:bg-red-50 text-red-600"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </Card>
          )}

          <Card className="mt-6 bg-muted/50">
            <CardContent className="p-4">
              <h3 className="font-medium mb-3 flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Ringkasan Hasil Lab
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white rounded-lg p-3 text-center">
                  <div className="text-lg font-bold text-primary">{labResults.length}</div>
                  <div className="text-xs text-muted-foreground">Total Hasil</div>
                </div>
                <div className="bg-white rounded-lg p-3 text-center">
                  <div className="text-lg font-bold text-red-600">
                    {labResults.filter((r: LabResult) => r.result === 'Positif').length}
                  </div>
                  <div className="text-xs text-muted-foreground">Positif</div>
                </div>
                <div className="bg-white rounded-lg p-3 text-center">
                  <div className="text-lg font-bold text-green-600">
                    {labResults.filter((r: LabResult) => r.result === 'Negatif').length}
                  </div>
                  <div className="text-xs text-muted-foreground">Negatif</div>
                </div>
                <div className="bg-white rounded-lg p-3 text-center">
                  <div className="text-lg font-bold text-orange-600">
                    {labResults.filter((r: LabResult) => !r.synced).length}
                  </div>
                  <div className="text-xs text-muted-foreground">Belum Sync</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
