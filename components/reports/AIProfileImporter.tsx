import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import { UploadCloud, File, AlertTriangle, Loader2 } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useToast } from '../../hooks/useToast';
import { useApp } from '../../hooks/useApp';
import { extractCompanyDataFromDocument } from '../../services/geminiService';
import Progress from '../ui/Progress';

type Status = 'idle' | 'uploading' | 'processing' | 'error';
const statusMessages: Record<Exclude<Status, 'idle' | 'error'>, string> = {
    uploading: "Reading file...",
    processing: "AI is analyzing the document...",
};

const AIProfileImporter: React.FC = () => {
    const [status, setStatus] = useState<Status>('idle');
    const [progress, setProgress] = useState(0);
    const [error, setError] = useState<string | null>(null);
    const { toast } = useToast();
    const navigate = useNavigate();
    const { setImportedCompanyData, activeCompany } = useApp();

    const processFile = async (file: File) => {
        if (!activeCompany) {
            setError("No active company selected. Please ensure you are in a company's workspace.");
            setStatus('error');
            return;
        }

        setStatus('uploading');
        setError(null);
        setProgress(30);

        try {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = async () => {
                const base64String = (reader.result as string).split(',')[1];
                if (!base64String) {
                    throw new Error("Failed to read file.");
                }

                setProgress(60);
                setStatus('processing');
                
                const extractedData = await extractCompanyDataFromDocument({
                    base64: base64String,
                    mimeType: file.type,
                });
                
                setProgress(100);
                setImportedCompanyData(extractedData);
                toast({
                    title: "Analysis Complete",
                    description: "Review the extracted data before saving.",
                });
                navigate('/import-review');
            };
            reader.onerror = () => {
                throw new Error("Could not read the selected file.");
            };
        } catch (err) {
            console.error("File processing error:", err);
            const errorMessage = err instanceof Error ? err.message : "An unknown error occurred.";
            setError(`Failed to process document. ${errorMessage}`);
            setStatus('error');
            toast({
                variant: 'destructive',
                title: "Processing Failed",
                description: errorMessage,
            });
            setProgress(0);
        }
    };

    const onDrop = useCallback((acceptedFiles: File[]) => {
        if (acceptedFiles.length > 0) {
            processFile(acceptedFiles[0]);
        } else {
            toast({
                variant: 'destructive',
                title: "Invalid File",
                description: "The selected file is not supported. Please upload a PDF, DOCX, or XLSX file.",
            });
        }
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'application/pdf': ['.pdf'],
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
        },
        multiple: false,
    });

    if (status === 'uploading' || status === 'processing') {
        return (
            <div className="text-center p-8 border-2 border-dashed rounded-lg">
                <Loader2 className="mx-auto h-12 w-12 animate-spin text-primary mb-4" />
                <h3 className="text-lg font-semibold">{statusMessages[status]}</h3>
                <p className="text-muted-foreground text-sm">This may take a few moments...</p>
                <Progress value={progress} className="w-full max-w-sm mx-auto mt-4" />
            </div>
        )
    }
    
    if (status === 'error') {
         return (
            <div className="text-center p-8 border-2 border-dashed border-destructive/50 bg-destructive/10 rounded-lg">
                <AlertTriangle className="mx-auto h-12 w-12 text-destructive mb-4" />
                <h3 className="text-lg font-semibold text-destructive">An Error Occurred</h3>
                <p className="text-destructive/80 text-sm mb-4">{error}</p>
                <button onClick={() => setStatus('idle')} className="text-sm font-semibold text-primary hover:underline">
                    Try Again
                </button>
            </div>
        )
    }

    return (
        <div
            {...getRootProps()}
            className={cn(
                "p-8 border-2 border-dashed rounded-lg text-center cursor-pointer transition-colors",
                isDragActive ? 'border-primary bg-primary/10' : 'border-border hover:border-primary/50'
            )}
        >
            <input {...getInputProps()} />
            <div className="mx-auto h-12 w-12 rounded-full bg-secondary flex items-center justify-center mb-4">
                 <UploadCloud className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold">
                {isDragActive ? "Drop the file here..." : "Click to upload or drag & drop"}
            </h3>
            <p className="text-muted-foreground text-sm">
                PDF, DOCX, or XLSX accepted.
            </p>
        </div>
    );
};

export default AIProfileImporter;
