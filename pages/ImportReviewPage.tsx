
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../hooks/useApp';
import { AIExtractedCompany, Company } from '../lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { Loader2, Check, Sparkles } from 'lucide-react';
import { useToast } from '../hooks/useToast';
import Badge from '../components/ui/Badge';

const ConfidenceBadge: React.FC<{ confidence: number }> = ({ confidence }) => {
    const level = confidence > 0.8 ? 'completed' : confidence > 0.5 ? 'pending' : 'destructive';
    return <Badge variant={level}>{(confidence * 100).toFixed(0)}%</Badge>;
};

const ImportReviewPage: React.FC = () => {
    const { importedCompanyData, activeCompany, updateCompany, setImportedCompanyData } = useApp();
    const navigate = useNavigate();
    const { toast } = useToast();
    const [isSaving, setIsSaving] = useState(false);
    
    // Create a mutable copy for editing
    const [editableData, setEditableData] = useState<AIExtractedCompany | null>(importedCompanyData);

    useEffect(() => {
        if (!importedCompanyData) {
            navigate('/reports'); // Redirect if no data to review
        }
    }, [importedCompanyData, navigate]);
    
    const handleSave = async () => {
        if (!editableData || !activeCompany) return;

        setIsSaving(true);
        // This is a simplified merge. A real app would have a more complex logic.
        const updatedCompany: Company = {
            ...activeCompany,
            name: editableData.name.value || activeCompany.name,
            general: {
                ...activeCompany.general,
                datosFiscales: {
                    ...activeCompany.general.datosFiscales,
                    razonSocial: editableData.general.datosFiscales.razonSocial.value || activeCompany.general.datosFiscales.razonSocial,
                    rfc: editableData.general.datosFiscales.rfc.value || activeCompany.general.datosFiscales.rfc,
                }
            }
        };

        try {
            await updateCompany(updatedCompany);
            toast({ title: "Import Successful", description: "Company profile has been updated with the extracted data." });
            setImportedCompanyData(null);
            navigate('/company-profile');
        } catch {
            toast({ variant: 'destructive', title: "Error", description: "Failed to save company data." });
        } finally {
            setIsSaving(false);
        }
    };
    
    const handleFieldChange = (path: string, value: string) => {
        const keys = path.split('.');
        setEditableData(prev => {
            if (!prev) return null;
            const newData = JSON.parse(JSON.stringify(prev)); // Deep copy
            let current: any = newData;
            for (let i = 0; i < keys.length - 1; i++) {
                current = current[keys[i]];
            }
            current[keys[keys.length - 1]].value = value;
            return newData;
        });
    };

    if (!editableData) {
        return <div className="flex h-full items-center justify-center"><Loader2 className="h-16 w-16 animate-spin text-primary" /></div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold flex items-center gap-2"><Sparkles className="h-6 w-6 text-yellow-500" /> Review Extracted Data</h1>
                    <p className="text-muted-foreground">Please review and confirm the information extracted by the AI before saving.</p>
                </div>
                 <Button onClick={handleSave} disabled={isSaving}>
                    {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Check className="mr-2 h-4 w-4" />}
                    Confirm & Save
                </Button>
            </div>
            
            <Card>
                <CardHeader>
                    <CardTitle>General Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {/* FIX: Use Object.keys for type-safe iteration over the fields. */}
                    {(Object.keys(editableData.general.datosFiscales) as Array<keyof typeof editableData.general.datosFiscales>).map((key) => {
                        const data = editableData.general.datosFiscales[key];
                        if (!data) return null;
                        // FIX: Explicitly convert key to a string to prevent errors with .replace() and template literals.
                        const keyAsString = String(key);
                        return (
                            <div key={keyAsString} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                                <label className="font-medium text-sm capitalize">{keyAsString.replace(/([A-Z])/g, ' $1')}</label>
                                <div className="md:col-span-2 flex items-center gap-4">
                                <Input value={data.value} onChange={(e) => handleFieldChange(`general.datosFiscales.${keyAsString}`, e.target.value)} />
                                <ConfidenceBadge confidence={data.confidence} />
                                </div>
                            </div>
                        );
                    })}
                </CardContent>
            </Card>
            
             {/* Add more cards for other sections like `programas`, `miembros` etc. */}

        </div>
    );
};

export default ImportReviewPage;
