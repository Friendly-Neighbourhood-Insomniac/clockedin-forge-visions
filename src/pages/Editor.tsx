
import React, { useEffect } from 'react';
import { useChapterTreeStore } from '@/stores/chapterTreeStore';
import { useBookMetadataStore } from '@/stores/bookMetadataStore';
import { useEditorStore } from '@/stores/editorStore';
import DraftailEditor from '@/components/editor/DraftailEditor';
import EditorToolbar from '@/components/editor/EditorToolbar';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus, FileText, Eye, Download } from 'lucide-react';
import { Link } from 'react-router-dom';

const Editor: React.FC = () => {
  const {
    chapters,
    selectedChapterId,
    selectChapter,
    addChapter,
    deleteChapter,
    updateChapter,
    getChapterById
  } = useChapterTreeStore();

  const { metadata, updateMetadata } = useBookMetadataStore();
  const { loadContent, getContentAsRaw } = useEditorStore();

  const selectedChapter = selectedChapterId ? getChapterById(selectedChapterId) : null;

  // Load chapter content when selection changes
  useEffect(() => {
    if (selectedChapter?.content) {
      loadContent(selectedChapter.content);
    }
  }, [selectedChapterId, selectedChapter?.content, loadContent]);

  // Save content when editor state changes
  const handleContentSave = () => {
    if (selectedChapterId) {
      const content = getContentAsRaw();
      updateChapter(selectedChapterId, { content });
    }
  };

  const handleChapterTitleChange = (title: string) => {
    if (selectedChapterId) {
      updateChapter(selectedChapterId, { title });
    }
  };

  const handleAddChapter = () => {
    const newChapterId = addChapter();
    selectChapter(newChapterId);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-amber-900">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(6,182,212,0.05),transparent_50%)]" />
      
      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex-1">
              <Input
                value={metadata.title}
                onChange={(e) => updateMetadata('title', e.target.value)}
                placeholder="Book Title"
                className="text-2xl font-bold bg-transparent border-none text-cyan-100 placeholder-slate-400 p-0 h-auto focus:ring-0 mb-2"
              />
              <Input
                value={metadata.author}
                onChange={(e) => updateMetadata('author', e.target.value)}
                placeholder="Author Name"
                className="text-lg bg-transparent border-none text-slate-300 placeholder-slate-500 p-0 h-auto focus:ring-0"
              />
            </div>
            <div className="flex items-center gap-2 ml-4">
              <Link to="/preview">
                <Button size="sm" className="bg-cyan-600 hover:bg-cyan-700 text-white">
                  <Eye className="w-4 h-4 mr-2" />
                  Preview
                </Button>
              </Link>
              <Link to="/export">
                <Button size="sm" variant="outline" className="border-cyan-400/30 text-slate-300 hover:text-white hover:bg-slate-700">
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
              </Link>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Chapter Sidebar */}
          <div className="lg:col-span-1">
            <Card className="bg-slate-800/50 border-cyan-400/30">
              <CardHeader className="flex flex-row items-center justify-between">
                <h3 className="text-lg font-semibold text-cyan-100">Chapters</h3>
                <Button
                  size="sm"
                  onClick={handleAddChapter}
                  className="bg-cyan-600 hover:bg-cyan-700"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </CardHeader>
              <CardContent className="space-y-2">
                {chapters.length === 0 ? (
                  <div className="text-center text-slate-400 py-8">
                    <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>No chapters yet</p>
                    <p className="text-sm">Click + to add your first chapter</p>
                  </div>
                ) : (
                  chapters.map((chapter) => (
                    <div
                      key={chapter.id}
                      className={`p-3 rounded-lg cursor-pointer transition-colors ${
                        selectedChapterId === chapter.id
                          ? 'bg-cyan-600/20 border border-cyan-400/50'
                          : 'bg-slate-700/50 hover:bg-slate-700'
                      }`}
                      onClick={() => selectChapter(chapter.id)}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-slate-200 truncate">{chapter.title}</span>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (confirm('Delete this chapter?')) {
                              deleteChapter(chapter.id);
                            }
                          }}
                          className="text-red-400 hover:text-red-300 h-6 w-6 p-0"
                        >
                          ×
                        </Button>
                      </div>
                      {chapter.wordCount && (
                        <div className="text-xs text-slate-400 mt-1">
                          {chapter.wordCount} words
                        </div>
                      )}
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </div>

          {/* Editor Area */}
          <div className="lg:col-span-3">
            {selectedChapter ? (
              <div className="space-y-4">
                {/* Chapter Title */}
                <Card className="bg-slate-800/50 border-cyan-400/30">
                  <CardContent className="p-4">
                    <Input
                      value={selectedChapter.title}
                      onChange={(e) => handleChapterTitleChange(e.target.value)}
                      placeholder="Chapter Title"
                      className="text-xl font-bold bg-transparent border-none text-cyan-100 placeholder-slate-400 p-0 h-auto focus:ring-0"
                    />
                  </CardContent>
                </Card>

                {/* Editor Toolbar */}
                <EditorToolbar />

                {/* Draft.js Editor */}
                <DraftailEditor
                  placeholder="Start writing your chapter..."
                  onBlur={handleContentSave}
                />
              </div>
            ) : (
              <Card className="bg-slate-800/50 border-cyan-400/30">
                <CardContent className="flex items-center justify-center py-20">
                  <div className="text-center text-slate-400">
                    <FileText className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p className="text-lg mb-2">Select a chapter to start editing</p>
                    <p className="text-sm">Choose from the sidebar or create a new chapter</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Editor;
