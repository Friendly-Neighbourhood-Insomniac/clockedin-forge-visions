
import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Image, Upload } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface EnhancedImageUploadProps {
  onImageInsert: (imageUrl: string, metadata?: { width?: string; height?: string; alt?: string }) => void;
}

const EnhancedImageUpload: React.FC<EnhancedImageUploadProps> = ({ onImageInsert }) => {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast({
          title: "File too large",
          description: "Please select an image smaller than 5MB.",
          variant: "destructive",
        });
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string;
        
        // Create a temporary image to get dimensions
        const img = new Image();
        img.onload = () => {
          const maxWidth = 600;
          const aspectRatio = img.height / img.width;
          const width = Math.min(img.width, maxWidth);
          const height = width * aspectRatio;
          
          onImageInsert(imageUrl, {
            width: `${width}px`,
            height: `${height}px`,
            alt: file.name.replace(/\.[^/.]+$/, '')
          });
        };
        img.src = imageUrl;
        
        toast({
          title: "Image uploaded",
          description: "Image has been inserted. Click to edit size and position.",
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <>
      <Button
        onClick={triggerFileInput}
        size="sm"
        variant="ghost"
        className="text-slate-300 hover:text-white hover:bg-slate-700"
        title="Upload Image"
      >
        <Image className="w-4 h-4" />
      </Button>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className="hidden"
      />
    </>
  );
};

export default EnhancedImageUpload;
