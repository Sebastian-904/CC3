import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/Card';
import { Loader2, UploadCloud, Sparkles } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useApp } from '../../hooks/useApp';
import { extractCompanyDataFromDocument } from '../../services/geminiService';
import { useToast } from '../../hooks/useToast';

function fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve((reader.result as string).split(',')[1]);
        reader.onerror = error => reject(error);
    });
}

const AIProfileImporter: React.FC = () => {
    const { setImportedCompanyData } = useApp();
    const { toast } = useToast();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    const onDrop = useCallback(async (acceptedFiles: File[]) => {
        if (acceptedFiles.length === 0) return;
        
        const file = acceptedFiles[0];
        setIsLoading(true);

        try {
            const base64 = await fileToBase64(file);
            const extractedData = await extractCompanyDataFromDocument({ base64, mimeType: file.type });
            setImportedCompanyData(extractedData);
            navigate('/import-review');
        } catch (error) {
             toast({
                variant: "destructive",
                title: "Extraction Failed",
                description: error instanceof Error ? error.message : "An unknown error occurred.",
            });
        } finally {
            setIsLoading(false);
        }

    }, [setImportedCompanyData, navigate, toast]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        multiple: false,
        accept: { 'application/pdf': ['.pdf'] }
    });

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-yellow-500" />
                    AI Company Profile Importer
                </CardTitle>
                <CardDescription>
                    Upload a company document (e.g., Acta Constitutiva) to automatically extract and populate the company profile.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div
                    {...getRootProps()}
                    className={cn(
                        "p-8 border-2 border-dashed rounded-lg text-center cursor-pointer transition-colors",
                        isDragActive ? 'border-primary bg-primary/10' : 'border-border hover:border-primary/50',
                        isLoading && 'cursor-wait'
                    )}
                >
                    <input {...getInputProps()} disabled={isLoading} />
                    {isLoading ? (
                        <>
                            <Loader2 className="mx-auto h-12 w-12 animate-spin text-primary" />
                            <p className="mt-4 font-semibold">AI is analyzing your document...</p>
                            <p className="text-sm text-muted-foreground">This may take a moment.</p>
                        </>
                    ) : (
                        <>
                            <UploadCloud className="mx-auto h-12 w-12 text-muted-foreground" />
                            <p className="mt-2 font-semibold">Drag & drop a document here, or click to select</p>
                            <p className="text-xs text-muted-foreground">PDF documents only</p>
                        </>
                    )}
                </div>
            </CardContent>
        </Card>
    );
};

export default AIProfileImporter;
