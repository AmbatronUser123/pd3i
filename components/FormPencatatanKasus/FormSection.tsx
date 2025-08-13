import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Label } from '../ui/label';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../ui/collapsible';
import { CheckCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { FormSection as FormSectionType } from './constants';
import { FormData } from './utils';
import { FormFieldRenderer } from './FormFieldRenderer';

interface FormSectionProps {
  section: FormSectionType;
  formData: FormData;
  onFieldChange: (fieldId: string, value: any) => void;
  onToggle: (sectionId: string) => void;
}

export function FormSection({ section, formData, onFieldChange, onToggle }: FormSectionProps) {
  return (
    <Card>
      <Collapsible open={section.expanded} onOpenChange={() => onToggle(section.id)}>
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                  <section.icon className="w-4 h-4 text-primary" />
                </div>
                <span>{section.title}</span>
                {section.completed && (
                  <CheckCircle className="w-4 h-4 text-green-600" />
                )}
              </div>
              {section.expanded ? (
                <ChevronUp className="w-5 h-5" />
              ) : (
                <ChevronDown className="w-5 h-5" />
              )}
            </CardTitle>
          </CardHeader>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <CardContent className="pt-0">
            <div className="space-y-4">
              {section.fields.map((field) => (
                <div key={field.id} className="space-y-2">
                  <Label htmlFor={field.id} className="flex items-center gap-1">
                    {field.label}
                    {field.required && <span className="text-destructive">*</span>}
                  </Label>
                  <FormFieldRenderer
                    field={field}
                    value={formData[field.id]}
                    onChange={onFieldChange}
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}
