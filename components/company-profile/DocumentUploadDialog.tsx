
// ---
// title: components/company-profile/DocumentUploadDialog.tsx
// ---
import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose, DialogDescription } from '../ui/Dialog';
import Button from '../ui/Button';
import { Loader2, UploadCloud, File as FileIcon } from 'lucide-react';
import { cn } from '../../lib/utils';
import Select from '../ui/Select';
import { useLanguage } from '../../hooks/useLanguage';

interface DocumentUploadDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (file: File, category: string) => Promise<void>;
  isUploading: boolean;
}

const documentCategories = [
    "Fiscal", "Legal", "Acta Constitutiva", "Poder Notarial",
    "IMMEX", "PROSEC", "Certificación IVA/IEPS", "OEA", "NOMs", "Contratos", "Otros"
];

const DocumentUploadDialog: React.FC<DocumentUploadDialogProps> = ({ isOpen, onClose, onUpload, isUploading }) => {
  const { t } = useLanguage();
  const [file, setFile] = useState<File | null>(null);
  const [category, setCategory] = useState<string>(documentCategories[0]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    accept: {
        'application/pdf': ['.pdf'],
        'application/msword': ['.doc'],
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
        'application/vnd.ms-excel': ['.xls'],
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
        'image/*': ['.jpeg', '.jpg', '.png', '.gif']
    }
  });
  
  const handleUpload = async () => {
    if (!file || !category) return;
    await onUpload(file, category);
    // Reset state after upload
    setFile(null);
    setCategory(documentCategories[0]);
  };
  
  // Reset state when dialog is closed
  const handleClose = () => {
      if (isUploading) return;
      setFile(null);
      setCategory(documentCategories[0]);
      onClose();
  }

  return (
    <Dialog isOpen={isOpen} onClose={handleClose}>
        <DialogHeader>
            <DialogTitle>{t('uploadDocument')}</DialogTitle>
            <DialogDescription>Selecciona un archivo y asígnale una categoría.</DialogDescription>
            <DialogClose onClose={handleClose} />
        </DialogHeader>
        <DialogContent className="space-y-4">
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
                    <p className="mt-2 font-semibold">Arrastra y suelta un archivo aquí, o haz clic para seleccionar</p>
                    <p className="text-xs text-muted-foreground">PDF, DOCX, XLSX, JPG, PNG, etc.</p>
                </div>
            ) : (
                <div className="flex items-center gap-3 p-4 border rounded-lg">
                    <FileIcon className="h-8 w-8 text-primary" />
                    <div className="flex-1">
                        <p className="font-semibold truncate">{file.name}</p>
                        <p className="text-xs text-muted-foreground">
                            {(file.size / 1024 / 1024).toFixed(2)} MB - {file.type}
                        </p>
                    </div>
                </div>
            )}
             <div>
                <label htmlFor="category" className="text-sm font-medium">{t('documentCategory')}</label>
                <Select id="category" value={category} onChange={e => setCategory(e.target.value)} className="mt-1">
                    {documentCategories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                    ))}
                </Select>
            </div>
        </DialogContent>
        <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose} disabled={isUploading}>Cancelar</Button>
            <Button onClick={handleUpload} disabled={isUploading || !file}>
                {isUploading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isUploading ? 'Subiendo...' : 'Subir Archivo'}
            </Button>
        </DialogFooter>
    </Dialog>
  );
};

export default DocumentUploadDialog;
