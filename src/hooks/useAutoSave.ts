
import { useEffect, useState } from 'react';
import { useDebounce } from './useDebounce';

interface UseAutoSaveProps {
  content: string;
  onSave: (content: string) => void;
  delay?: number;
}

export function useAutoSave({ content, onSave, delay = 1000 }: UseAutoSaveProps) {
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const debouncedContent = useDebounce(content, delay);

  useEffect(() => {
    if (debouncedContent && saveStatus !== 'saving') {
      setSaveStatus('saving');
      
      try {
        onSave(debouncedContent);
        setSaveStatus('saved');
        
        // Reset to idle after showing saved status
        const timer = setTimeout(() => setSaveStatus('idle'), 2000);
        return () => clearTimeout(timer);
      } catch (error) {
        console.error('Auto-save failed:', error);
        setSaveStatus('error');
      }
    }
  }, [debouncedContent, onSave, saveStatus]);

  return { saveStatus, setSaveStatus };
}
