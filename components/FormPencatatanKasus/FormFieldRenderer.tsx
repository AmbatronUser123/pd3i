import { useState, useEffect } from 'react';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Calendar } from '../ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';
import { CalendarIcon, HelpCircle, Asterisk } from 'lucide-react';
import { FormField } from './constants';
import { format } from 'date-fns';
import { id as idLocale } from 'date-fns/locale';

interface FormFieldRendererProps {
  field: FormField;
  value: any;
  onChange: (value: any) => void;
  formData: Record<string, any>;
  error?: string;
}

export function FormFieldRenderer({ 
  field, 
  value, 
  onChange, 
  formData, 
  error 
}: FormFieldRendererProps) {
  const [date, setDate] = useState<Date | undefined>(
    value ? new Date(value) : undefined
  );

  // Check if field should be shown based on dependencies
  const shouldShow = () => {
    if (!field.dependsOn) return true;
    
    const dependentValue = formData[field.dependsOn];
    
    // Handle different dependency scenarios
    switch (field.dependsOn) {
      case 'Kasus_KLB':
        return dependentValue === 'Ya';
      
      case 'Demam':
        return dependentValue === 'Ya' && field.id === 'Tanggal_mulai_demam';
      
      case 'Ruam_makulopopular':
        return dependentValue === 'Ya' && field.id === 'Tanggal_mulai_rash';
      
      case 'Adenopathy':
        return dependentValue === 'Ya' && field.id === 'Lokasi_Adenopathy';
      
      case 'Arthralgia':
        return dependentValue === 'Ya' && field.id === 'Bagian_Sendi_Arthralgia';
      
      case 'Kehamilan':
        return dependentValue === 'Ya' && field.id === 'Umur_kehamilan';
      
      case 'Lainnya':
        return dependentValue === 'Ya' && field.id === 'Sebutkan_gejala_lainnya';
      
      case 'Apakah_kasus_dirawat_di_RS':
        return dependentValue === 'Ya';
      
      case 'Imunisasi_campak_MR_9_bulan':
      case 'Imunisasi_campak_MR_18_bulan':
      case 'Imunisasi_campak_MR_kelas_1_SD':
      case 'Pernah_MMR_sebelumnya':
      case 'Pernah_MR_kampanye':
        return dependentValue === 'Ya' || dependentValue === 'Tidak';
      
      case 'Ada_anggota_sakit_sama':
        return dependentValue === 'Ya' && field.id === 'Jumlah';
      
      case 'Berpergian_1_bulan_terakhir':
        return dependentValue === 'Ya';
      
      case 'Spesimen_darah_diambil':
        return dependentValue === 'Ya';
      
      case 'Spesimen_lain_diambil':
        return dependentValue === 'Ya';
      
      default:
        return dependentValue === 'Ya';
    }
  };

  // Auto-calculate age when birth date changes
  useEffect(() => {
    if (field.autoCalculate && field.id === 'Umur' && formData.Tanggal_lahir) {
      const birthDate = new Date(formData.Tanggal_lahir);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age = age - 1;
      }
      
      if (age >= 0) {
        onChange(age.toString());
      }
    }
  }, [formData.Tanggal_lahir, field.autoCalculate, field.id, onChange]);

  if (!shouldShow()) {
    return null;
  }

  const handleDateChange = (selectedDate: Date | undefined) => {
    setDate(selectedDate);
    if (selectedDate) {
      onChange(format(selectedDate, 'yyyy-MM-dd'));
    } else {
      onChange('');
    }
  };

  const renderField = () => {
    switch (field.type) {
      case 'text':
        return (
          <Input
            id={field.id}
            name={field.id}
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder={field.placeholder}
            className={`spasi-input ${error ? 'border-destructive focus:ring-destructive' : ''}`}
          />
        );

      case 'tel':
        return (
          <Input
            id={field.id}
            name={field.id}
            type="tel"
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder={field.placeholder}
            className={`spasi-input ${error ? 'border-destructive focus:ring-destructive' : ''}`}
          />
        );

      case 'number':
        return (
          <Input
            id={field.id}
            name={field.id}
            type="number"
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder={field.placeholder}
            className={`spasi-input ${error ? 'border-destructive focus:ring-destructive' : ''}`}
            min="0"
          />
        );

      case 'textarea':
        return (
          <Textarea
            id={field.id}
            name={field.id}
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder={field.placeholder}
            rows={3}
            className={`spasi-input resize-none ${error ? 'border-destructive focus:ring-destructive' : ''}`}
          />
        );

      case 'select':
        return (
          <Select value={value || ''} onValueChange={onChange}>
            <SelectTrigger id={field.id} name={field.id} className={`spasi-input ${error ? 'border-destructive focus:ring-destructive' : ''}`}>
              <SelectValue placeholder="Pilih..." />
            </SelectTrigger>
            <SelectContent>
              {field.options?.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      case 'radio':
        return (
          <RadioGroup 
            value={value || ''} 
            onValueChange={onChange}
            className="flex flex-wrap gap-4"
          >
            {field.options?.map((option) => (
              <div key={option} className="flex items-center space-x-2">
                <RadioGroupItem 
                  value={option} 
                  id={`${field.id}-${option}`}
                  name={field.id}
                  className="min-w-[20px] min-h-[20px]"
                />
                <Label 
                  htmlFor={`${field.id}-${option}`}
                  className="cursor-pointer text-sm font-normal"
                >
                  {option}
                </Label>
              </div>
            ))}
          </RadioGroup>
        );

      case 'date':
        return (
          <Popover>
            <PopoverTrigger asChild>
              <Button
                id={field.id}
                name={field.id}
                variant="outline"
                className={`spasi-input justify-start text-left font-normal ${
                  error ? 'border-destructive focus:ring-destructive' : ''
                } ${!value ? 'text-muted-foreground' : ''}`}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {value ? format(new Date(value), 'dd MMMM yyyy', { locale: idLocale }) : 'Pilih tanggal'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={date}
                onSelect={handleDateChange}
                disabled={(date) => date > new Date() || date < new Date('1900-01-01')}
                initialFocus
                locale={idLocale}
              />
            </PopoverContent>
          </Popover>
        );

      case 'readonly':
        return (
          <Input
            id={field.id}
            name={field.id}
            value={value || ''}
            readOnly
            disabled
            className="spasi-input bg-muted cursor-not-allowed"
            placeholder={field.autoCalculate ? 'Akan dihitung otomatis' : ''}
          />
        );

      default:
        return (
          <Input
            id={field.id}
            name={field.id}
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder={field.placeholder}
            className={`spasi-input ${error ? 'border-destructive focus:ring-destructive' : ''}`}
          />
        );
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Label htmlFor={field.id} className="text-sm font-medium flex items-center gap-1">
          {field.label}
          {field.required && (
            <Asterisk className="w-3 h-3 text-destructive" />
          )}
        </Label>
        
        {field.tooltip && (
          <Tooltip>
            <TooltipTrigger asChild>
              <HelpCircle className="w-4 h-4 text-muted-foreground cursor-help" />
            </TooltipTrigger>
            <TooltipContent>
              <p className="max-w-xs text-sm">{field.tooltip}</p>
            </TooltipContent>
          </Tooltip>
        )}
      </div>
      
      {renderField()}
      
      {error && (
        <p className="text-xs text-destructive mt-1">{error}</p>
      )}
    </div>
  );
}
