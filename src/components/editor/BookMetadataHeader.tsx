
import React from 'react';
import { Input } from '@/components/ui/input';

interface BookMetadataHeaderProps {
  title: string;
  author: string;
  onTitleChange: (title: string) => void;
  onAuthorChange: (author: string) => void;
}

const BookMetadataHeader: React.FC<BookMetadataHeaderProps> = ({
  title,
  author,
  onTitleChange,
  onAuthorChange
}) => {
  return (
    <div className="flex-1">
      <Input
        value={title}
        onChange={(e) => onTitleChange(e.target.value)}
        placeholder="Book Title"
        className="text-2xl font-bold bg-transparent border-none text-cyan-100 placeholder-slate-400 p-0 h-auto focus:ring-0 mb-2"
      />
      <Input
        value={author}
        onChange={(e) => onAuthorChange(e.target.value)}
        placeholder="Author Name"
        className="text-lg bg-transparent border-none text-slate-300 placeholder-slate-500 p-0 h-auto focus:ring-0"
      />
    </div>
  );
};

export default BookMetadataHeader;
