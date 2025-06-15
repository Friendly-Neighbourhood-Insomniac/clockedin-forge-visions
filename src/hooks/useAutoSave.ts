
import { useEffect, useState, useRef } from 'react';
import { useDebounce } from './useDebounce';

interface UseAutoSaveProps {
  content: string;
  onSave: (content: string) => void;
  delay?: number;
}

export function useAutoSave({ content, onSave, delay = 1000 }: UseAutoSaveProps) {
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const debouncedContent = useDebounce(content, delay);
  const lastSavedContent = useRef<string>('');
  const isSaving = useRef(false);

  useEffect(() => {
    // Skip if content hasn't changed or is empty or we're already saving
    if (!debouncedContent || 
        debouncedContent === lastSavedContent.current || 
        isSaving.current) {
      return;
    }

    isSaving.current = true;
    setSaveStatus('saving');
    
    try {
      onSave(debouncedContent);
      lastSavedContent.current = debouncedContent;
      setSaveStatus('saved');
      
      // Reset to idle after showing saved status
      const timer = setTimeout(() => {
        setSaveStatus('idle');
        isSaving.current = false;
      }, 2000);
      
      return () => {
        clearTimeout(timer);
        isSaving.current = false;
      };
    } catch (error) {
      console.error('Auto-save failed:', error);
      setSaveStatus('error');
      isSaving.current = false;
    }
  }, [debouncedContent, onSave]);

  return { saveStatus, setSaveStatus };
}
