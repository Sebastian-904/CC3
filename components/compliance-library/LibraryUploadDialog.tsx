import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose, DialogDescription } from '../ui/Dialog';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Switch from '../ui/Switch';
import { Label } from '../ui/Label';
import { Loader2, UploadCloud, File as FileIcon, Sparkles } from 'lucide-react';
import { cn } from '../../lib/utils';
import Select from '../ui/Select';
import { useLanguage } from '../../hooks/useLanguage';
import { useApp } from '../../hooks/useApp';
import { useToast } from '../../hooks/useToast';
import { ComplianceDocument } from '../../lib/types';
import { summarizeLegalDocument } from '../../services/geminiService';

interface LibraryUploadDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const documentCategories: ComplianceDocument['category'][] = [
    'Ley', 'Reglamento', 'Decreto', 'Acuerdo', 'RGCE', 'Criterio', 'Otro'
];

const LibraryUploadDialog: React.FC<LibraryUploadDialogProps> = ({ isOpen, onClose }) => {
  const { t } = useLanguage();
  const { addNewComplianceDocument } = useApp();
  const { toast } = useToast();

  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [publicationDate, setPublicationDate] = useState(new Date().toISOString().split('T')[0]);
  const [category, setCategory] = useState<ComplianceDocument['category']>(documentCategories[0]);
  const [generateSummary, setGenerateSummary] = useState(true);
  const [status, setStatus] = useState<'idle' | 'summarizing' | 'saving'>('idle');

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
      // Pre-fill title from filename
      setTitle(acceptedFiles[0].name.replace(/\.[^/.]+$/, "").replace(/_/g, " "));
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    accept: {
        'application/pdf': ['.pdf'],
        'application/msword': ['.doc'],
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
    }
  });
  
  const resetState = () => {
      setFile(null);
      setTitle('');
      setDescription('');
      setPublicationDate(new Date().toISOString().split('T')[0]);
      setCategory(documentCategories[0]);
      setGenerateSummary(true);
      setStatus('idle');
  }

  const handleClose = () => {
      if (status !== 'idle') return;
      resetState();
      onClose();
  }

  const handleUpload = async () => {
    if (!file || !title || !category || !publicationDate) return;
    
    let summary: string | undefined = undefined;
    
    try {
        if (generateSummary) {
            setStatus('summarizing');
            const reader = new FileReader();
            reader.readAsDataURL(file);
            await new Promise<void>((resolve, reject) => {
                reader.onload = async () => {
                    try {
                        const base64String = (reader.result as string).split(',')[1];
                        summary = await summarizeLegalDocument({ base64: base64String, mimeType: file.type });
                        resolve();
                    } catch (e) {
                        reject(e);
                    }
                };
                reader.onerror = (error) => reject(error);
            });
        }
        
        setStatus('saving');
        const newDoc: Omit<ComplianceDocument, 'id' | 'uploadDate'> = {
            title,
            description,
            category,
            publicationDate,
            fileName: file.name,
            fileUrl: URL.createObjectURL(file), // Mock URL
            fileType: file.type,
            fileSize: file.size,
            aiSummary: summary,
        };

        await addNewComplianceDocument(newDoc);
        toast({ title: "Document Uploaded", description: `"${title}" has been added to the library.` });
        handleClose();
    } catch (error) {
        console.error("Upload failed:", error);
        toast({ variant: "destructive", title: "Upload Failed", description: error instanceof Error ? error.message : "An unknown error occurred." });
        setStatus('idle');
    }
  };

  const isUploading = status !== 'idle';
  const statusMessage = status === 'summarizing' ? 'AI is generating summary...' : 'Saving document...';

  return (
    <Dialog isOpen={isOpen} onClose={handleClose}>
        <DialogHeader>
            <DialogTitle>{t('uploadLegalDocument')}</DialogTitle>
            <DialogDescription>{t('complianceLibraryDesc')}</DialogDescription>
            <DialogClose onClose={handleClose} />
        </DialogHeader>
        <DialogContent className="space-y-4 max-h-[80vh] overflow-y-auto">
             {!file ? (
                <div
                    {...getRootProps()}
                    className={cn(
                        "p-8 border-2 border-dashed rounded-lg text-center cursor-pointer transition-colors",
                        isDragActive ? 'border-primary bg-primary/10' : 'border-border hover:border-primary/50'
                    )}
                >
                    <input {...getInputProps()} />
                    <UploadCloud className="mx-auto h-12 w-12 text-muted-foreground" />
                    <p className="mt-2 font-semibold">Drag & drop a file here, or click to select</p>
                    <p className="text-xs text-muted-foreground">PDF, DOC, DOCX</p>
                </div>
            ) : (
                 <div className="flex items-center gap-3 p-4 border rounded-lg">
                    <FileIcon className="h-8 w-8 text-primary" />
                    <div className="flex-1">
                        <p className="font-semibold truncate">{file.name}</p>
                    </div>
                     <Button variant="link" size="sm" className="h-auto p-0" onClick={() => setFile(null)}>Change file</Button>
                </div>
            )}
            
            <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input id="title" value={title} onChange={e => setTitle(e.target.value)} disabled={isUploading} />
            </div>
             <div className="space-y-2">
                <Label htmlFor="description">Short Description</Label>
                <Input id="description" value={description} onChange={e => setDescription(e.target.value)} disabled={isUploading} />
            </div>
             <div className="grid grid-cols-2 gap-4">
                 <div className="space-y-2">
                    <Label htmlFor="publicationDate">{t('publicationDate')}</Label>
                    <Input id="publicationDate" type="date" value={publicationDate} onChange={e => setPublicationDate(e.target.value)} disabled={isUploading} />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="category">{t('documentCategory')}</Label>
                    <Select id="category" value={category} onChange={e => setCategory(e.target.value as any)} disabled={isUploading}>
                        {documentCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                    </Select>
                </div>
            </div>
            
            <div className="flex items-center justify-between p-3 border rounded-lg bg-secondary/50">
                 <div className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-yellow-500" />
                    <div>
                        <Label htmlFor="gen-summary" className="font-semibold">{t('generateAISummary')}</Label>
                        <p className="text-xs text-muted-foreground">{t('generateAISummaryDesc')}</p>
                    </div>
                </div>
                <Switch id="gen-summary" checked={generateSummary} onCheckedChange={setGenerateSummary} disabled={isUploading} />
            </div>

        </DialogContent>
        <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose} disabled={isUploading}>Cancel</Button>
            <Button onClick={handleUpload} disabled={isUploading || !file}>
                {isUploading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isUploading ? statusMessage : 'Upload & Save'}
            </Button>
        </DialogFooter>
    </Dialog>
  );
};

export default LibraryUploadDialog;
