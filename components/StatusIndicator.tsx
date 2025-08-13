import { Wifi, WifiOff } from 'lucide-react';

interface StatusIndicatorProps {
  isOnline: boolean;
  className?: string;
}

export function StatusIndicator({ isOnline, className = "" }: StatusIndicatorProps) {
  return (
    <div className={`px-4 py-2 text-sm ${className}`}>
      <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-md ${
        isOnline 
          ? 'bg-primary/10 text-primary border border-primary/20' 
          : 'bg-destructive/10 text-destructive border border-destructive/20'
      }`}>
        {isOnline ? (
          <>
            <Wifi className="w-4 h-4" />
            <span>Status: Online – Data akan tersinkron otomatis</span>
          </>
        ) : (
          <>
            <WifiOff className="w-4 h-4" />
            <span>Status: Offline – Data tersimpan lokal</span>
          </>
        )}
      </div>
    </div>
  );
}
