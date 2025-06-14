
import React from 'react';
import { Button } from '@/components/ui/button';
import { ImagePlus } from 'lucide-react';

interface EnhancedImageUploadProps {
  onImageInsert: (imageUrl: string, metadata?: { width?: string; height?: string; alt?: string }) => void;
}

const EnhancedImageUpload: React.FC<EnhancedImageUploadProps> = ({ onImageInsert }) => {
  const handleImageUpload = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        console.log('File selected:', file.name);
        const reader = new FileReader();
        reader.onload = (event) => {
          const imageUrl = event.target?.result as string;
          console.log('Image loaded, calling onImageInsert');
          onImageInsert(imageUrl, { alt: file.name });
        };
        reader.readAsDataURL(file);
      }
    };
    
    input.click();
  };

  return (
    <Button
      onClick={handleImageUpload}
      size="sm"
      variant="ghost"
      className="text-slate-300 hover:text-white hover:bg-slate-700"
      title="Upload Image"
    >
      <ImagePlus className="w-4 h-4" />
    </Button>
  );
};

export default EnhancedImageUpload;
