
// ---
// title: pages/CompanyProfilePage.tsx
// ---
import React, { useState, useEffect, useCallback } from 'react';
import { useApp } from '../hooks/useApp';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '../components/ui/Card';
import Button from '../components/ui/Button';
import { Loader2, Building, FileText, UserCheck, Users, MapPin, Ship, Pencil, FolderArchive, Download, Trash2 } from 'lucide-react';
import { Company, Document } from '../lib/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/Tabs';
import { useLanguage } from '../hooks/useLanguage';
import MemberDialog from '../components/company-profile/MemberDialog';
import AddressDialog from '../components/company-profile/AddressDialog';
import CustomsAgentDialog from '../components/company-profile/CustomsAgentDialog';
import GeneralDataDialog from '../components/company-profile/GeneralDataDialog';
import ProgramsDialog from '../components/company-profile/ProgramsDialog';
import { useAuth } from '../hooks/useAuth';
import DocumentUploadDialog from '../components/company-profile/DocumentUploadDialog';
import { useToast } from '../hooks/useToast';
import { v4 as uuidv4 } from 'uuid';
import ConfirmationDialog from '../components/ui/ConfirmationDialog';

type DialogState = 
    | { type: 'general'; data: Company['general'] }
    | { type: 'programs'; data: Company['programas'] }
    | { type: 'member'; data: Company['miembros'] }
    | { type: 'address'; data: Company['domicilios'] }
    | { type: 'agent'; data: Company['agentesAduanales'] }
    | { type: 'upload' }
    | null;

type DeletionState = 
    | { type: 'document', data: Document }
    | null;

const CompanyProfilePage = () => {
    const { activeCompany, updateCompany, loading } = useApp();
    const { user: currentUser } = useAuth();
    const { t } = useLanguage();
    const { toast } = useToast();
    const [isSaving, setIsSaving] = useState(false);
    const [dialogState, setDialogState] = useState<DialogState>(null);
    const [deletionState, setDeletionState] = useState<DeletionState>(null);

    const canManage = currentUser?.role === 'admin' || currentUser?.role === 'consultor';

    const handleSave = async (updatedData: Partial<Company>) => {
        if (!activeCompany || !canManage) return;
        
        const updatedCompanyProfile = { ...activeCompany, ...updatedData };

        setIsSaving(true);
        try {
            await updateCompany(updatedCompanyProfile);
            setDialogState(null); // Close dialog on successful save
        } catch (error) {
            console.error("Failed to save company profile:", error);
            // Optionally, show an error message to the user in the dialog
        } finally {
            setIsSaving(false);
        }
    };
    
    const handleUploadDocument = async (file: File, category: string) => {
        if (!activeCompany || !canManage) return;

        const newDocument: Document = {
            id: uuidv4(),
            name: file.name,
            url: URL.createObjectURL(file), // Mock URL
            type: file.type,
            size: file.size,
            uploadDate: new Date().toISOString(),
            category: category,
        };
        
        const updatedDocuments = [...(activeCompany.documents || []), newDocument];
        await handleSave({ documents: updatedDocuments });
        toast({ title: "Document Uploaded", description: `${file.name} has been added.`});
    };

    const handleDeleteDocument = async () => {
        if (!activeCompany || !canManage || deletionState?.type !== 'document') return;
        
        const docToDelete = deletionState.data;
        const updatedDocuments = activeCompany.documents?.filter(doc => doc.id !== docToDelete.id) || [];
        await handleSave({ documents: updatedDocuments });
        toast({ title: "Document Deleted", description: `${docToDelete.name} has been removed.`});
        setDeletionState(null);
    };


    if (loading && !activeCompany) {
        return <div className="flex h-full items-center justify-center"><Loader2 className="h-16 w-16 animate-spin text-primary" /></div>;
    }

    if (!activeCompany) {
        return <div className="flex h-full items-center justify-center"><p className="text-muted-foreground">Please select a company to view its profile.</p></div>;
    }
    
    return (
        <div className="max-w-6xl mx-auto space-y-6">
            <div className="flex justify-between items-center">
                <div className="space-y-1">
                    <h1 className="text-2xl font-bold flex items-center gap-2"><Building className="h-6 w-6" /> {activeCompany.name}</h1>
                    <p className="text-muted-foreground">{t('manageCompanyProfile')}</p>
                </div>
            </div>

            <Tabs defaultValue="general">
                <TabsList className="grid w-full grid-cols-3 sm:grid-cols-4 md:grid-cols-6">
                    <TabsTrigger value="general">General</TabsTrigger>
                    <TabsTrigger value="programas">Programas</TabsTrigger>
                    <TabsTrigger value="miembros">Miembros</TabsTrigger>
                    <TabsTrigger value="domicilios">Domicilios</TabsTrigger>
                    <TabsTrigger value="agentes">Agentes Aduanales</TabsTrigger>
                    <TabsTrigger value="documentos">{t('documents')}</TabsTrigger>
                </TabsList>

                {/* TABS CONTENT */}
                <TabsContent value="general">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                             <div>
                                <CardTitle>Información General y Legal</CardTitle>
                                <CardDescription>Datos fiscales, de constitución y del representante legal.</CardDescription>
                            </div>
                            {canManage && (
                                <Button variant="outline" size="sm" onClick={() => setDialogState({ type: 'general', data: activeCompany.general })}>
                                    <Pencil className="h-3 w-3 mr-2"/> Edit General Data
                                </Button>
                            )}
                        </CardHeader>
                        <CardContent className="grid md:grid-cols-3 gap-6 pt-0">
                            <div className="space-y-4">
                                <h4 className="font-semibold text-sm flex items-center gap-2"><FileText className="h-4 w-4"/> Datos Fiscales</h4>
                                <InfoRow label="Razón Social" value={activeCompany.general.datosFiscales.razonSocial} />
                                <InfoRow label="RFC" value={activeCompany.general.datosFiscales.rfc} />
                            </div>
                            <div className="space-y-4">
                                 <h4 className="font-semibold text-sm flex items-center gap-2"><FileText className="h-4 w-4"/> Acta Constitutiva</h4>
                                <InfoRow label="No. de Escritura" value={activeCompany.general.actaConstitutiva.numeroEscritura} />
                                <InfoRow label="Fecha" value={activeCompany.general.actaConstitutiva.fecha} />
                            </div>
                            <div className="space-y-4">
                                 <h4 className="font-semibold text-sm flex items-center gap-2"><UserCheck className="h-4 w-4"/> Representante Legal</h4>
                                <InfoRow label="No. de Escritura del Poder" value={activeCompany.general.representanteLegal.numeroEscrituraPoder} />
                                <InfoRow label="Fecha del Poder" value={activeCompany.general.representanteLegal.fechaPoder} />
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="programas">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle>Programas y Certificaciones</CardTitle>
                                <CardDescription>Información sobre programas de fomento como IMMEX y PROSEC.</CardDescription>
                            </div>
                            {canManage && (
                                <Button variant="outline" size="sm" onClick={() => setDialogState({ type: 'programs', data: activeCompany.programas })}>
                                    <Pencil className="h-3 w-3 mr-2"/> Edit Programs
                                </Button>
                            )}
                        </CardHeader>
                        <CardContent className="grid md:grid-cols-2 gap-6 pt-0">
                            <div className="space-y-4 p-4 rounded-lg bg-muted/50">
                                <h4 className="font-semibold text-sm">Programa IMMEX</h4>
                                {activeCompany.programas.immex ? (
                                    <>
                                        <InfoRow label="No. de Registro" value={activeCompany.programas.immex.numeroRegistro} />
                                        <InfoRow label="Modalidad" value={activeCompany.programas.immex.modalidad} />
                                        <InfoRow label="Fecha de Autorización" value={activeCompany.programas.immex.fechaAutorizacion} />
                                    </>
                                ) : <p className="text-sm text-muted-foreground">No hay datos disponibles.</p>}
                            </div>
                            <div className="space-y-4 p-4 rounded-lg bg-muted/50">
                                <h4 className="font-semibold text-sm">Programa PROSEC</h4>
                                {activeCompany.programas.prosec ? (
                                    <>
                                        <InfoRow label="No. de Registro" value={activeCompany.programas.prosec.numeroRegistro} />
                                        <InfoRow label="Sector" value={activeCompany.programas.prosec.sector} />
                                        <InfoRow label="Fecha de Autorización" value={activeCompany.programas.prosec.fechaAutorizacion} />
                                    </>
                                ) : <p className="text-sm text-muted-foreground">No hay datos disponibles.</p>}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="miembros">
                    <TableCard title="Miembros de la Sociedad" icon={<Users />} onManage={canManage ? () => setDialogState({ type: 'member', data: activeCompany.miembros }) : undefined}>
                        <thead className="bg-muted/50">
                            <tr>
                                <th className="p-3 text-sm font-medium text-left">Nombre</th>
                                <th className="p-3 text-sm font-medium text-left">RFC</th>
                                <th className="p-3 text-sm font-medium text-left">Tipo</th>
                            </tr>
                        </thead>
                        <tbody>
                            {activeCompany.miembros.map((miembro) => (
                                <tr key={miembro.id} className="border-b">
                                    <td className="p-3">{miembro.nombre}</td>
                                    <td className="p-3">{miembro.rfc}</td>
                                    <td className="p-3">{miembro.tipoPersona}</td>
                                </tr>
                            ))}
                        </tbody>
                    </TableCard>
                </TabsContent>
                
                 <TabsContent value="domicilios">
                    <TableCard title="Domicilios de Operación" icon={<MapPin />} onManage={canManage ? () => setDialogState({ type: 'address', data: activeCompany.domicilios }) : undefined}>
                        <thead className="bg-muted/50">
                             <tr>
                                <th className="p-3 text-sm font-medium text-left">Dirección</th>
                                <th className="p-3 text-sm font-medium text-left">Teléfono</th>
                            </tr>
                        </thead>
                        <tbody>
                            {activeCompany.domicilios.map(domicilio => (
                                <tr key={domicilio.id} className="border-b">
                                    <td className="p-3">{domicilio.direccionCompleta}</td>
                                    <td className="p-3">{domicilio.telefono}</td>
                                </tr>
                            ))}
                        </tbody>
                    </TableCard>
                </TabsContent>

                <TabsContent value="agentes">
                    <TableCard title="Agentes Aduanales" icon={<Ship />} onManage={canManage ? () => setDialogState({ type: 'agent', data: activeCompany.agentesAduanales }) : undefined}>
                        <thead className="bg-muted/50">
                            <tr>
                                <th className="p-3 text-sm font-medium text-left">Nombre</th>
                                <th className="p-3 text-sm font-medium text-left">Patente</th>
                            </tr>
                        </thead>
                        <tbody>
                            {activeCompany.agentesAduanales.map(agente => (
                                <tr key={agente.id} className="border-b">
                                    <td className="p-3">{agente.nombre}</td>
                                    <td className="p-3">{agente.numeroPatente}</td>
                                </tr>
                            ))}
                        </tbody>
                    </TableCard>
                </TabsContent>

                <TabsContent value="documentos">
                    <TableCard title={t('documents')} icon={<FolderArchive />} buttonText={t('uploadDocument')} onManage={canManage ? () => setDialogState({ type: 'upload' }) : undefined}>
                         <thead className="bg-muted/50">
                            <tr>
                                <th className="p-3 text-sm font-medium text-left">Nombre del Archivo</th>
                                <th className="p-3 text-sm font-medium text-left hidden sm:table-cell">{t('documentCategory')}</th>
                                <th className="p-3 text-sm font-medium text-left hidden md:table-cell">{t('uploadDate')}</th>
                                <th className="p-3 text-sm font-medium text-left hidden sm:table-cell">{t('fileSize')}</th>
                                <th className="p-3 text-sm font-medium text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {(activeCompany.documents || []).map((doc) => (
                                <tr key={doc.id} className="border-b">
                                    <td className="p-3 font-medium">{doc.name}</td>
                                    <td className="p-3 hidden sm:table-cell">{doc.category}</td>
                                    <td className="p-3 hidden md:table-cell">{new Date(doc.uploadDate).toLocaleDateString()}</td>
                                    <td className="p-3 hidden sm:table-cell">{(doc.size / 1024 / 1024).toFixed(2)} MB</td>
                                    <td className="p-3 text-right">
                                        <a href={doc.url} target="_blank" rel="noopener noreferrer" className="inline-block">
                                            <Button variant="ghost" size="icon" title="Download">
                                                <Download className="h-4 w-4" />
                                            </Button>
                                        </a>
                                        {canManage && (
                                            <Button variant="ghost" size="icon" title="Delete" onClick={() => setDeletionState({ type: 'document', data: doc })}>
                                                <Trash2 className="h-4 w-4 text-destructive" />
                                            </Button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </TableCard>
                </TabsContent>
            </Tabs>

            {/* DIALOGS */}
            {dialogState?.type === 'general' && (
                <GeneralDataDialog 
                    isOpen={true}
                    onClose={() => setDialogState(null)}
                    data={dialogState.data}
                    onSave={(data) => handleSave({ general: data })}
                    isSaving={isSaving}
                />
            )}
             {dialogState?.type === 'programs' && (
                <ProgramsDialog 
                    isOpen={true}
                    onClose={() => setDialogState(null)}
                    data={dialogState.data}
                    onSave={(data) => handleSave({ programas: data })}
                    isSaving={isSaving}
                />
            )}
             {dialogState?.type === 'member' && (
                <MemberDialog 
                    isOpen={true}
                    onClose={() => setDialogState(null)}
                    members={dialogState.data}
                    onSave={(data) => handleSave({ miembros: data })}
                    isSaving={isSaving}
                />
            )}
             {dialogState?.type === 'address' && (
                <AddressDialog 
                    isOpen={true}
                    onClose={() => setDialogState(null)}
                    addresses={dialogState.data}
                    onSave={(data) => handleSave({ domicilios: data })}
                    isSaving={isSaving}
                />
            )}
             {dialogState?.type === 'agent' && (
                <CustomsAgentDialog 
                    isOpen={true}
                    onClose={() => setDialogState(null)}
                    agents={dialogState.data}
                    onSave={(data) => handleSave({ agentesAduanales: data })}
                    isSaving={isSaving}
                />
            )}
            {dialogState?.type === 'upload' && (
                <DocumentUploadDialog
                    isOpen={true}
                    onClose={() => setDialogState(null)}
                    onUpload={handleUploadDocument}
                    isUploading={isSaving}
                />
            )}
            {deletionState?.type === 'document' && (
                 <ConfirmationDialog
                    isOpen={true}
                    onClose={() => setDeletionState(null)}
                    onConfirm={handleDeleteDocument}
                    title="Delete Document"
                    description={`Are you sure you want to delete "${deletionState.data.name}"? This action cannot be undone.`}
                    isConfirming={isSaving}
                />
            )}
        </div>
    );
};

// --- Helper Components ---

const TableCard: React.FC<{ title: string; icon?: React.ReactNode; children: React.ReactNode; onManage?: () => void; buttonText?: string; }> = ({ title, icon, children, onManage, buttonText = "Manage List" }) => (
    <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0">
            <div className="flex items-center gap-2">
                {icon}
                <CardTitle className="text-base font-semibold">{title}</CardTitle>
            </div>
            {onManage && <Button variant="outline" size="sm" onClick={onManage}><Pencil className="h-3 w-3 mr-2"/> {buttonText}</Button>}
        </CardHeader>
        <CardContent>
            <div className="border rounded-lg overflow-hidden">
                <table className="w-full text-sm">{children}</table>
            </div>
        </CardContent>
    </Card>
);

const InfoRow: React.FC<{ label: string; value: string; }> = ({ label, value }) => (
    <div>
        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{label}</label>
        <p className="font-medium text-foreground">{value || '-'}</p>
    </div>
);

export default CompanyProfilePage;
