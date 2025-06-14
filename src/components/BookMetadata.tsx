
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface BookMetadataProps {
  metadata: {
    title: string;
    author: string;
    description: string;
    genre: string;
    isbn: string;
    publisher: string;
    publishDate: string;
    language: string;
    keywords: string;
  };
  onMetadataChange: (field: string, value: string) => void;
}

const BookMetadata: React.FC<BookMetadataProps> = ({ metadata, onMetadataChange }) => {
  return (
    <Card className="bg-slate-800/50 border-cyan-400/30">
      <CardHeader>
        <CardTitle className="text-cyan-100">Book Metadata</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="title" className="text-slate-300">Title</Label>
            <Input
              id="title"
              value={metadata.title}
              onChange={(e) => onMetadataChange('title', e.target.value)}
              className="bg-slate-700/50 border-slate-600 text-white"
            />
          </div>
          <div>
            <Label htmlFor="author" className="text-slate-300">Author</Label>
            <Input
              id="author"
              value={metadata.author}
              onChange={(e) => onMetadataChange('author', e.target.value)}
              className="bg-slate-700/50 border-slate-600 text-white"
            />
          </div>
        </div>
        
        <div>
          <Label htmlFor="description" className="text-slate-300">Description</Label>
          <Textarea
            id="description"
            value={metadata.description}
            onChange={(e) => onMetadataChange('description', e.target.value)}
            className="bg-slate-700/50 border-slate-600 text-white"
            rows={3}
          />
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="genre" className="text-slate-300">Genre</Label>
            <Select value={metadata.genre} onValueChange={(value) => onMetadataChange('genre', value)}>
              <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white">
                <SelectValue placeholder="Select genre" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="fiction">Fiction</SelectItem>
                <SelectItem value="non-fiction">Non-Fiction</SelectItem>
                <SelectItem value="mystery">Mystery</SelectItem>
                <SelectItem value="romance">Romance</SelectItem>
                <SelectItem value="sci-fi">Science Fiction</SelectItem>
                <SelectItem value="fantasy">Fantasy</SelectItem>
                <SelectItem value="biography">Biography</SelectItem>
                <SelectItem value="self-help">Self-Help</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="isbn" className="text-slate-300">ISBN</Label>
            <Input
              id="isbn"
              value={metadata.isbn}
              onChange={(e) => onMetadataChange('isbn', e.target.value)}
              className="bg-slate-700/50 border-slate-600 text-white"
              placeholder="978-0-123456-78-9"
            />
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="publisher" className="text-slate-300">Publisher</Label>
            <Input
              id="publisher"
              value={metadata.publisher}
              onChange={(e) => onMetadataChange('publisher', e.target.value)}
              className="bg-slate-700/50 border-slate-600 text-white"
            />
          </div>
          <div>
            <Label htmlFor="publishDate" className="text-slate-300">Publish Date</Label>
            <Input
              id="publishDate"
              type="date"
              value={metadata.publishDate}
              onChange={(e) => onMetadataChange('publishDate', e.target.value)}
              className="bg-slate-700/50 border-slate-600 text-white"
            />
          </div>
          <div>
            <Label htmlFor="language" className="text-slate-300">Language</Label>
            <Select value={metadata.language} onValueChange={(value) => onMetadataChange('language', value)}>
              <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white">
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="es">Spanish</SelectItem>
                <SelectItem value="fr">French</SelectItem>
                <SelectItem value="de">German</SelectItem>
                <SelectItem value="it">Italian</SelectItem>
                <SelectItem value="pt">Portuguese</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <Label htmlFor="keywords" className="text-slate-300">Keywords (comma-separated)</Label>
          <Input
            id="keywords"
            value={metadata.keywords}
            onChange={(e) => onMetadataChange('keywords', e.target.value)}
            className="bg-slate-700/50 border-slate-600 text-white"
            placeholder="fantasy, adventure, magic, quest"
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default BookMetadata;
