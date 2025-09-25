import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../hooks/useApp';
import { AIExtractedCompany, Company } from '../lib/types';
import Button from '../components/ui/Button';
import { Loader2, FileCheck, AlertTriangle, Sparkles, Info } from 'lucide-react';
import { useToast } from '../hooks/useToast';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '../components/ui/Card';
import { Label } from '../components/ui/Label';
import Input from '../components/ui/Input';
import { Popover, PopoverContent, PopoverTrigger } from '../components/ui/Popover';
import set from 'lodash.set';

const ImportReviewPage: React.FC = () => {
    const { importedCompanyData, setImportedCompanyData, activeCompany, updateCompany } = useApp();
    const navigate = useNavigate();
    const { toast } = useToast();

    const [reviewData, setReviewData] = useState<AIExtractedCompany | null>(importedCompanyData);
    const [isSaving, setIsSaving] = useState(false);
    const [activeTab, setActiveTab] = useState('general');

    useEffect(() => {
        if (!importedCompanyData) {
            // If user lands here without data (e.g., page refresh), redirect them.
            navigate('/reports');
        }
    }, [importedCompanyData, navigate]);

    if (!reviewData || !activeCompany) {
        return (
            <div className="flex h-full items-center justify-center">
                <Loader2 className="h-16 w-16 animate-spin text-primary" />
            </div>
        );
    }
    
    const handleCancel = () => {
        setImportedCompanyData(null);
        navigate('/reports');
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            // Convert AIExtractedCompany to Company by stripping metadata
            const finalCompanyData: Company = {
                ...activeCompany,
                name: reviewData.name.value,
                general: {
                    datosFiscales: {
                        razonSocial: reviewData.general.datosFiscales.razonSocial.value,
                        rfc: reviewData.general.datosFiscales.rfc.value,
                        telefono: reviewData.general.datosFiscales.telefono.value,
                        domicilioFiscal: reviewData.general.datosFiscales.domicilioFiscal.value,
                    },
                    actaConstitutiva: {
                        numeroEscritura: reviewData.general.actaConstitutiva.numeroEscritura.value,
                        fecha: reviewData.general.actaConstitutiva.fecha.value,
                        nombreFedatario: reviewData.general.actaConstitutiva.nombreFedatario.value,
                    },
                     representanteLegal: {
                        numeroEscrituraPoder: reviewData.general.representanteLegal.numeroEscrituraPoder.value,
                        fechaPoder: reviewData.general.representanteLegal.fechaPoder.value,
                        nombreFedatario: reviewData.general.representanteLegal.nombreFedatario.value,
                    }
                },
                programas: {
                    immex: reviewData.programas.immex ? {
                        numeroRegistro: reviewData.programas.immex.numeroRegistro.value,
                        modalidad: reviewData.programas.immex.modalidad.value,
                        fechaAutorizacion: reviewData.programas.immex.fechaAutorizacion.value,
                    } : undefined,
                     prosec: reviewData.programas.prosec ? {
                        numeroRegistro: reviewData.programas.prosec.numeroRegistro.value,
                        sector: reviewData.programas.prosec.sector.value,
                        fechaAutorizacion: reviewData.programas.prosec.fechaAutorizacion.value,
                    } : undefined,
                },
                 // For now, we are not handling lists in this simplified example
                miembros: activeCompany.miembros,
                domicilios: activeCompany.domicilios,
                agentesAduanales: activeCompany.agentesAduanales,
            };
            
            await updateCompany(finalCompanyData);
            
            toast({
                title: "Profile Updated",
                description: `The profile for ${finalCompanyData.name} has been updated with the imported data.`,
            });
            
            setImportedCompanyData(null);
            navigate('/company-profile');

        } catch (error) {
            console.error("Failed to save company data:", error);
            toast({
                variant: 'destructive',
                title: "Save Failed",
                description: "Could not save the company profile. Please try again.",
            });
        } finally {
            setIsSaving(false);
        }
    };
    
    const handleFieldChange = (path: string, value: string) => {
        const updatedData = JSON.parse(JSON.stringify(reviewData));
        set(updatedData, `${path}.value`, value);
        setReviewData(updatedData);
    };

    const tabs = [
        { id: 'general', label: 'General' },
        { id: 'programas', label: 'Programas' },
        // { id: 'miembros', label: 'Miembros' },
        // { id: 'domicilios', label: 'Domicilios' },
        // { id: 'agentes', label: 'Agentes' },
    ];

    return (
        <div className="max-w-6xl mx-auto space-y-6">
            <div className="space-y-1">
                <h1 className="text-2xl font-bold flex items-center gap-2"><FileCheck className="h-6 w-6" /> Review AI-Extracted Data</h1>
                <p className="text-muted-foreground">Verify the information extracted by the AI. Edit any fields as needed before saving.</p>
            </div>
            
            <Card className="bg-amber-50 border-amber-200 dark:bg-amber-900/20 dark:border-amber-800">
                <CardContent className="p-4 flex items-start gap-3">
                    <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400 mt-1" />
                    <div>
                        <h3 className="font-semibold text-amber-800 dark:text-amber-300">Important</h3>
                        <p className="text-sm text-amber-700 dark:text-amber-400">
                            AI-extracted data may contain inaccuracies. Please carefully review every field before saving to the company profile.
                        </p>
                    </div>
                </CardContent>
            </Card>

             <Card>
                <CardHeader>
                    <CardTitle>Company Name</CardTitle>
                </CardHeader>
                 <CardContent>
                    <ReviewField 
                        label="Company Legal Name" 
                        path="name"
                        data={reviewData.name} 
                        onChange={handleFieldChange} 
                    />
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="md:col-span-1">
                    <Card>
                        <CardContent className="p-2">
                             <nav className="flex flex-col space-y-1">
                                {tabs.map(tab => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`px-3 py-2 text-sm font-medium rounded-md text-left ${
                                            activeTab === tab.id ? 'bg-accent text-primary' : 'hover:bg-accent/50'
                                        }`}
                                    >
                                        {tab.label}
                                    </button>
                                ))}
                            </nav>
                        </CardContent>
                    </Card>
                </div>

                <div className="md:col-span-3">
                    {activeTab === 'general' && (
                        <div className="space-y-6">
                             <Card>
                                <CardHeader><CardTitle>Datos Fiscales</CardTitle></CardHeader>
                                <CardContent className="space-y-4">
                                     <ReviewField label="Razón Social" path="general.datosFiscales.razonSocial" data={reviewData.general.datosFiscales.razonSocial} onChange={handleFieldChange} />
                                     <ReviewField label="RFC" path="general.datosFiscales.rfc" data={reviewData.general.datosFiscales.rfc} onChange={handleFieldChange} />
                                     <ReviewField label="Teléfono" path="general.datosFiscales.telefono" data={reviewData.general.datosFiscales.telefono} onChange={handleFieldChange} />
                                     <ReviewField label="Domicilio Fiscal" path="general.datosFiscales.domicilioFiscal" data={reviewData.general.datosFiscales.domicilioFiscal} onChange={handleFieldChange} />
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader><CardTitle>Acta Constitutiva</CardTitle></CardHeader>
                                <CardContent className="space-y-4">
                                    <ReviewField label="No. de Escritura" path="general.actaConstitutiva.numeroEscritura" data={reviewData.general.actaConstitutiva.numeroEscritura} onChange={handleFieldChange} />
                                    <ReviewField label="Fecha" path="general.actaConstitutiva.fecha" data={reviewData.general.actaConstitutiva.fecha} onChange={handleFieldChange} type="date" />
                                </CardContent>
                            </Card>
                        </div>
                    )}
                     {activeTab === 'programas' && (
                         <div className="space-y-6">
                             <Card>
                                <CardHeader><CardTitle>Programa IMMEX</CardTitle></CardHeader>
                                <CardContent className="space-y-4">
                                    {reviewData.programas.immex ? (
                                        <>
                                            <ReviewField label="No. de Registro" path="programas.immex.numeroRegistro" data={reviewData.programas.immex.numeroRegistro} onChange={handleFieldChange} />
                                            <ReviewField label="Modalidad" path="programas.immex.modalidad" data={reviewData.programas.immex.modalidad} onChange={handleFieldChange} />
                                            <ReviewField label="Fecha de Autorización" path="programas.immex.fechaAutorizacion" data={reviewData.programas.immex.fechaAutorizacion} onChange={handleFieldChange} type="date" />
                                        </>
                                    ) : <p className="text-muted-foreground text-sm">No data found for IMMEX program.</p>}
                                </CardContent>
                            </Card>
                             <Card>
                                <CardHeader><CardTitle>Programa PROSEC</CardTitle></CardHeader>
                                <CardContent className="space-y-4">
                                    {reviewData.programas.prosec ? (
                                        <>
                                             <ReviewField label="No. de Registro" path="programas.prosec.numeroRegistro" data={reviewData.programas.prosec.numeroRegistro} onChange={handleFieldChange} />
                                             <ReviewField label="Sector" path="programas.prosec.sector" data={reviewData.programas.prosec.sector} onChange={handleFieldChange} />
                                        </>
                                    ) : <p className="text-muted-foreground text-sm">No data found for PROSEC program.</p>}
                                </CardContent>
                            </Card>
                         </div>
                    )}
                </div>
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t">
                <Button variant="outline" onClick={handleCancel} disabled={isSaving}>Cancel</Button>
                <Button onClick={handleSave} disabled={isSaving}>
                    {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Confirm and Save Profile
                </Button>
            </div>
        </div>
    );
};


// --- Helper Components ---

interface ReviewFieldProps {
    label: string;
    path: string;
    data: { value: string; confidence: number; source: string; };
    onChange: (path: string, value: string) => void;
    type?: string;
}

const ConfidenceBadge: React.FC<{ confidence: number }> = ({ confidence }) => {
    const percentage = Math.round(confidence * 100);
    const getConfidenceColor = () => {
        if (percentage > 90) return 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300';
        if (percentage > 70) return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300';
        return 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300';
    };

    return (
        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getConfidenceColor()}`}>
            {percentage}% Confident
        </span>
    );
};

const ReviewField: React.FC<ReviewFieldProps> = ({ label, path, data, onChange, type = 'text' }) => {
    const id = path.replace(/\./g, '-');
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-1">
            <Label htmlFor={id} className="flex items-center gap-2">
                {label}
            </Label>
            <div className="flex items-center gap-2">
                 <ConfidenceBadge confidence={data.confidence} />
                <Popover
                    trigger={
                        <button type="button" className="text-muted-foreground hover:text-primary">
                            <Info className="h-4 w-4" />
                            <span className="sr-only">View Source</span>
                        </button>
                    }
                >
                    <div className="space-y-2">
                        <h4 className="font-medium text-sm leading-none">AI Source Snippet</h4>
                        <p className="text-xs text-muted-foreground italic border-l-2 pl-2">
                            "{data.source || 'No source text found.'}"
                        </p>
                    </div>
                </Popover>
            </div>
            <div className="md:col-span-2">
                <Input 
                    id={id} 
                    type={type}
                    value={data.value} 
                    onChange={e => onChange(path, e.target.value)}
                />
            </div>
        </div>
    );
};

export default ImportReviewPage;
