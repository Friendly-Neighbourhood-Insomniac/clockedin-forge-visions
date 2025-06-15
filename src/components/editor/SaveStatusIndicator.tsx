
import React from 'react';
import { Check, AlertCircle, Loader2 } from 'lucide-react';

interface SaveStatusIndicatorProps {
  status: 'idle' | 'saving' | 'saved' | 'error';
}

const SaveStatusIndicator: React.FC<SaveStatusIndicatorProps> = ({ status }) => {
  const getStatusConfig = () => {
    switch (status) {
      case 'saving':
        return {
          icon: Loader2,
          text: 'Saving...',
          className: 'text-blue-500 animate-spin'
        };
      case 'saved':
        return {
          icon: Check,
          text: 'Saved',
          className: 'text-green-500'
        };
      case 'error':
        return {
          icon: AlertCircle,
          text: 'Save failed',
          className: 'text-red-500'
        };
      default:
        return null;
    }
  };

  const config = getStatusConfig();
  if (!config) return null;

  const Icon = config.icon;

  return (
    <div className="flex items-center gap-2 text-sm text-slate-400">
      <Icon className={`h-4 w-4 ${config.className}`} />
      <span className={config.className}>{config.text}</span>
    </div>
  );
};

export default SaveStatusIndicator;
