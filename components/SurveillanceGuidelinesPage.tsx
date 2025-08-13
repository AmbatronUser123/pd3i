import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';
import { Badge } from './ui/badge';
import { 
  ArrowLeft, 
  FileText,
  AlertTriangle,
  Clock,
  FlaskConical,
  ClipboardList,
  Phone,
  ExternalLink,
  Download,
  Globe,
  Heart,
  Thermometer,
  Waves,
  Wifi,
  WifiOff
} from 'lucide-react';

interface SurveillanceGuidelinesPageProps {
  onBack: () => void;
  isOnline: boolean;
}

interface GuidelineSection {
  id: string;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  content: string[];
}

interface DiseaseGuideline {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  sections: GuidelineSection[];
  pdfLink?: string;
}

const diseases: DiseaseGuideline[] = [
  {
    id: 'campak-rubela',
    name: 'Campak-Rubela',
    icon: Heart,
    color: 'text-red-600',
    pdfLink: '/docs/pedoman-campak-rubela.pdf',
    sections: [
      {
        id: 'definition',
        title: 'Definisi Kasus WHO',
        icon: FileText,
        content: [
          'Suspek: Demam >38°C dengan ruam makulopapular generalisata + batuk/pilek/mata merah',
          'Probable: Kasus suspek + epidemiologis terkait kasus konfirm lab atau KLB',
          'Konfirm: Kasus suspek/probable + lab IgM positif atau link epidemiologis terkonfirmasi'
        ]
      },
      {
        id: 'mandatory-actions',
        title: 'Tindakan Wajib',
        icon: Clock,
        content: [
          'Day-1: Lapor ke Dinkes dalam 24 jam, isolasi pasien, investigasi awal',
          'Day-2: Ambil spesimen darah (5-28 hari onset), investigasi kontak erat',
          'Day-3-7: Pelacakan kontak, imunisasi outbreak response jika diperlukan',
          'Day-14: Follow up kontak, evaluasi efektivitas respons'
        ]
      },
      {
        id: 'klb-criteria',
        title: 'Kriteria KLB',
        icon: AlertTriangle,
        content: [
          '≥1 kasus konfirm lab dalam 1 desa/kelurahan dalam 4 minggu',
          '≥5 kasus suspek dalam 1 desa/kelurahan dalam 4 minggu',
          '≥1 kasus meninggal akibat komplikasi dalam 4 minggu',
          'Peningkatan kasus >3x lipat dibanding periode sama tahun sebelumnya'
        ]
      },
      {
        id: 'specimen',
        title: 'Jenis & Waktu Pengambilan Spesimen',
        icon: FlaskConical,
        content: [
          'Darah untuk IgM: 5-28 hari setelah onset ruam (optimal 7-21 hari)',
          'Swab tenggorok + urin: 0-7 hari onset untuk isolasi virus (PCR)',
          'Volume minimum: 3-5 ml serum, simpan -20°C maksimal 1 minggu',
          'Kirim dalam cold chain ke Lab Dinkes Provinsi/Litbangkes'
        ]
      },
      {
        id: 'forms',
        title: 'Formulir yang Harus Diisi',
        icon: ClipboardList,
        content: [
          'MR-01: Formulir pencatatan kasus individual (dalam 24 jam)',
          'MR-04: Formulir investigasi kasus (dalam 48 jam)',
          'Formulir 05: Pelaporan mingguan rutin ke Dinkes',
          'Form lab: Formulir pengiriman spesimen + hasil laboratorium'
        ]
      },
      {
        id: 'contacts',
        title: 'Kontak Penting',
        icon: Phone,
        content: [
          'Dinkes Kota/Kab: 021-xxx-xxxx (H24 surveillance)',
          'Dinkes Provinsi: 021-xxx-xxxx (lab rujukan)',
          'Hotline KLB Kemenkes: 119 ext.9 (24 jam)',
          'Lab rujukan terdekat: Lab Dinkes / RSUD setempat'
        ]
      }
    ]
  },
  {
    id: 'difteri',
    name: 'Difteri',
    icon: Thermometer,
    color: 'text-orange-600',
    pdfLink: '/docs/pedoman-difteri.pdf',
    sections: [
      {
        id: 'definition',
        title: 'Definisi Kasus WHO',
        icon: FileText,
        content: [
          'Suspek: Sakit tenggorokan + pseudomembran putih keabu-abuan di tonsil/faring/hidung',
          'Probable: Kasus suspek + epidemiologis terkait atau klinis khas',
          'Konfirm: Isolasi C. diphtheriae dari kultur atau PCR positif'
        ]
      },
      {
        id: 'mandatory-actions',
        title: 'Tindakan Wajib',
        icon: Clock,
        content: [
          'Day-1: Lapor segera, isolasi pasien, berikan antitoksin + antibiotik',
          'Day-2: Ambil spesimen kultur, investigasi kontak erat, profilaksis',
          'Day-3-7: Kultur follow-up, imunisasi kontak, survei cakupan DPT',
          'Day-14: Evaluasi kontak, strengthening program imunisasi rutin'
        ]
      },
      {
        id: 'klb-criteria',
        title: 'Kriteria KLB',
        icon: AlertTriangle,
        content: [
          '≥1 kasus konfirm dalam 1 wilayah kerja Puskesmas',
          'Cluster ≥3 kasus suspek dalam 1 keluarga/institusi',
          'Case Fatality Rate >10% dalam outbreak',
          'Peningkatan kasus signifikan pada area dengan cakupan DPT rendah'
        ]
      },
      {
        id: 'specimen',
        title: 'Jenis & Waktu Pengambilan Spesimen',
        icon: FlaskConical,
        content: [
          'Swab tenggorok/hidung: sebelum antibiotik atau maksimal 24 jam setelah',
          'Media transport: Loeffler/blood agar, simpan suhu ruang',
          'Kirim segera ke lab dalam 24 jam atau maksimal 48 jam',
          'Kultur follow-up: 24 jam setelah selesai antibiotik, 2 kali berturut'
        ]
      },
      {
        id: 'forms',
        title: 'Formulir yang Harus Diisi',
        icon: ClipboardList,
        content: [
          'Form W2: Formulir individual difteri (segera)',
          'Form investigasi: Riwayat imunisasi, kontak erat, lingkungan',
          'Form lab: Pengiriman spesimen kultur + hasil',
          'Laporan outbreak: Jika memenuhi kriteria KLB'
        ]
      },
      {
        id: 'contacts',
        title: 'Kontak Penting',
        icon: Phone,
        content: [
          'Dinkes Kota/Kab: Emergency response team',
          'RSUD terdekat: Ketersediaan antitoksin difteri',
          'Lab Dinkes: Kultur dan identifikasi C. diphtheriae',
          'Hotline Kemenkes: 119 ext.9 (konsultasi klinis)'
        ]
      }
    ]
  },
  {
    id: 'pertusis',
    name: 'Pertusis',
    icon: Waves,
    color: 'text-blue-600',
    pdfLink: '/docs/pedoman-pertusis.pdf',
    sections: [
      {
        id: 'definition',
        title: 'Definisi Kasus WHO',
        icon: FileText,
        content: [
          'Suspek: Batuk >2 minggu dengan bunyi whoop/muntah pasca batuk atau apneu pada bayi',
          'Probable: Kasus suspek + kontak dengan kasus konfirm dalam 3 minggu',
          'Konfirm: Isolasi B. pertussis atau PCR positif atau peningkatan titer antibodi'
        ]
      },
      {
        id: 'mandatory-actions',
        title: 'Tindakan Wajib',
        icon: Clock,
        content: [
          'Day-1: Lapor dalam 24 jam, isolasi 5 hari pertama antibiotik',
          'Day-2: Ambil spesimen nasofaring, investigasi kontak erat',
          'Day-3-7: Profilaksis kontak berisiko tinggi, survei cakupan DPT',
          'Day-14-21: Follow up kontak, evaluasi transmisi'
        ]
      },
      {
        id: 'klb-criteria',
        title: 'Kriteria KLB',
        icon: AlertTriangle,
        content: [
          '≥2 kasus terkait epidemiologis dalam 1 institusi/keluarga',
          'Peningkatan kasus >50% dibanding baseline dalam 4 minggu',
          'Cluster pada kelompok berisiko: bayi <1 tahun, ibu hamil',
          'Attack rate tinggi pada institusi (sekolah, daycare)'
        ]
      },
      {
        id: 'specimen',
        title: 'Jenis & Waktu Pengambilan Spesimen',
        icon: FlaskConical,
        content: [
          'Nasofaring swab: 0-21 hari onset (optimal 0-14 hari) untuk PCR/kultur',
          'Serum paired: fase akut dan konvalesen (2-4 minggu kemudian)',
          'Media transport: Regan-Lowe atau Bordet-Gengou, kirim segera',
          'PCR lebih sensitif dari kultur, terutama pada kasus dengan riwayat antibiotik'
        ]
      },
      {
        id: 'forms',
        title: 'Formulir yang Harus Diisi',
        icon: ClipboardList,
        content: [
          'Form surveillance pertusis: Data demografi + klinis',
          'Form investigasi: Riwayat imunisasi, kontak erat, paparan',
          'Form lab: Spesimen PCR/kultur + hasil',
          'Laporan outbreak: Jika cluster dalam institusi'
        ]
      },
      {
        id: 'contacts',
        title: 'Kontak Penting',
        icon: Phone,
        content: [
          'Dinkes: Tim investigasi outbreak',
          'Lab rujukan: PCR B. pertussis',
          'Pediatri RSUD: Tatalaksana bayi dengan pertusis',
          'Dinas Pendidikan: Koordinasi outbreak di sekolah'
        ]
      }
    ]
  }
];

export function SurveillanceGuidelinesPage({ onBack, isOnline }: SurveillanceGuidelinesPageProps) {
  const [selectedDisease, setSelectedDisease] = useState('campak-rubela');

  const currentDisease = diseases.find(d => d.id === selectedDisease) || diseases[0];

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
                  <FileText className="w-5 h-5" />
                  Pedoman Surveilans
                </h1>
                <p className="text-sm text-muted-foreground">Panduan surveilans penyakit menular LP3I</p>
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="guidelines-disease" className="block text-sm font-medium">Pilih Penyakit</label>
              <Select value={selectedDisease} onValueChange={setSelectedDisease}>
                <SelectTrigger id="guidelines-disease" aria-labelledby="guidelines-disease">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {diseases.map(disease => (
                    <SelectItem key={disease.id} value={disease.id}>
                      <div className="flex items-center gap-2">
                        <disease.icon className={`w-4 h-4 ${disease.color}`} />
                        {disease.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="p-4">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <currentDisease.icon className={`w-6 h-6 ${currentDisease.color}`} />
                  </div>
                  <div>
                    <h2 className="text-xl">{currentDisease.name}</h2>
                    <p className="text-sm text-muted-foreground">Pedoman Surveilans & Investigasi</p>
                  </div>
                </div>
                {currentDisease.pdfLink && (
                  <Button variant="outline" size="sm" className="flex items-center gap-2">
                    <Download className="w-4 h-4" />
                    PDF Lengkap
                  </Button>
                )}
              </CardTitle>
            </CardHeader>
          </Card>

          <Card>
            <CardContent className="p-0">
              <Accordion type="multiple" className="w-full">
                {currentDisease.sections.map((section, index) => (
                  <AccordionItem key={section.id} value={section.id} className="border-b last:border-b-0">
                    <AccordionTrigger className="px-6 py-4 hover:bg-muted/50">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                          <section.icon className="w-4 h-4 text-primary" />
                        </div>
                        <div className="text-left">
                          <h3 className="font-medium">{section.title}</h3>
                          <Badge variant="outline" className="text-xs">
                            {index + 1} dari {currentDisease.sections.length}
                          </Badge>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-6 pb-6">
                      <div className="space-y-3">
                        {section.content.map((item, itemIndex) => (
                          <div key={itemIndex} className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg">
                            <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                            <p className="text-sm leading-relaxed">{item}</p>
                          </div>
                        ))}
                      </div>

                      {section.id === 'contacts' && (
                        <div className="mt-4 p-4 bg-accent/10 border border-accent/20 rounded-lg">
                          <div className="flex items-center gap-2 mb-2">
                            <Phone className="w-4 h-4 text-accent" />
                            <span className="font-medium text-accent">Akses Cepat</span>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            <Button variant="outline" size="sm" className="text-xs">
                              <Phone className="w-3 h-3 mr-1" />
                              Call Center
                            </Button>
                            <Button variant="outline" size="sm" className="text-xs">
                              <Globe className="w-3 h-3 mr-1" />
                              Website Dinkes
                            </Button>
                            <Button variant="outline" size="sm" className="text-xs">
                              <ExternalLink className="w-3 h-3 mr-1" />
                              Form Online
                            </Button>
                          </div>
                        </div>
                      )}

                      {section.id === 'forms' && (
                        <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                          <div className="flex items-center gap-2 mb-2">
                            <ClipboardList className="w-4 h-4 text-green-600" />
                            <span className="font-medium text-green-600">Download Formulir</span>
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <Button variant="outline" size="sm" className="text-xs justify-start">
                              <Download className="w-3 h-3 mr-1" />
                              Form MR-01
                            </Button>
                            <Button variant="outline" size="sm" className="text-xs justify-start">
                              <Download className="w-3 h-3 mr-1" />
                              Form Investigasi
                            </Button>
                          </div>
                        </div>
                      )}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>

          <Card className="mt-6 bg-muted/50">
            <CardContent className="p-4">
              <h3 className="font-medium mb-3 flex items-center gap-2">
                <Globe className="w-5 h-5" />
                Sumber Daya Tambahan
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <Button variant="outline" className="justify-start h-auto p-3">
                  <div className="text-left">
                    <div className="font-medium text-sm">Manual Surveilans</div>
                    <div className="text-xs text-muted-foreground">Pedoman lengkap Kemenkes</div>
                  </div>
                </Button>
                <Button variant="outline" className="justify-start h-auto p-3">
                  <div className="text-left">
                    <div className="font-medium text-sm">Training Modules</div>
                    <div className="text-xs text-muted-foreground">E-learning surveillance</div>
                  </div>
                </Button>
                <Button variant="outline" className="justify-start h-auto p-3">
                  <div className="text-left">
                    <div className="font-medium text-sm">WHO Guidelines</div>
                    <div className="text-xs text-muted-foreground">International standards</div>
                  </div>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
