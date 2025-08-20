import { Button } from '../ui/button';
import { Progress } from '../ui/progress';
import { ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { FormSection } from './constants';

interface MultiStepNavigationProps {
  sections: FormSection[];
  currentStep: number;
  onStepChange: (step: number) => void;
  onNext: () => void;
  onPrevious: () => void;
  canProceed: boolean;
}

export function MultiStepNavigation({
  sections,
  currentStep,
  onStepChange,
  onNext,
  onPrevious,
  canProceed: _canProceed
}: MultiStepNavigationProps) {
  const progress = ((currentStep + 1) / sections.length) * 100;
  const currentSection = sections[currentStep];
  
  return (
    <div className="bg-card border-b border-border sticky top-12 z-40">
      <div className="p-4">
        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex justify-between text-sm text-muted-foreground mb-2">
            <span>Langkah {currentStep + 1} dari {sections.length}</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Current Section Info */}
        <div className="mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              {currentSection && (
                <currentSection.icon className="w-5 h-5 text-primary" />
              )}
            </div>
            <div>
              <h2 className="font-medium">{currentSection?.title}</h2>
              {currentSection?.description && (
                <p className="text-sm text-muted-foreground">{currentSection.description}</p>
              )}
            </div>
          </div>
        </div>

        {/* Step Navigator */}
        <div className="flex items-center gap-3 justify-between md:justify-start flex-wrap">
          <Button
            variant="outline"
            size="sm"
            onClick={onPrevious}
            disabled={currentStep === 0}
            className="flex items-center gap-2"
          >
            <ChevronLeft className="w-4 h-4" />
            Sebelumnya
          </Button>

          {/* Step Indicators */}
          <div className="flex items-center gap-1">
            {sections.map((section, index) => (
              <button
                key={section.id}
                onClick={() => onStepChange(index)}
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs transition-colors ${
                  index === currentStep
                    ? 'bg-primary text-primary-foreground'
                    : section.completed
                    ? 'bg-primary/20 text-primary'
                    : 'bg-muted text-muted-foreground'
                }`}
                disabled={index > currentStep && !section.completed}
              >
                {section.completed ? (
                  <Check className="w-4 h-4" />
                ) : (
                  index + 1
                )}
              </button>
            ))}
          </div>

          <Button
            size="sm"
            onClick={onNext}
            disabled={currentStep === sections.length - 1}
            className="flex items-center gap-2"
          >
            Selanjutnya
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
