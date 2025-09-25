import React, { useState, useEffect, useCallback } from 'react';
import { useApp } from '../hooks/useApp';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import Button from '../components/ui/Button';
import { Loader2, Building, FileText, UserCheck, Users, MapPin, Ship, Pencil } from 'lucide-react';
import { Company } from '../lib/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/Tabs';
import { useLanguage } from '../hooks/useLanguage';
import MemberDialog from '../components/company-profile/MemberDialog';
import AddressDialog from '../components/company-profile/AddressDialog';
import CustomsAgentDialog from '../components/company-profile/CustomsAgentDialog';
import GeneralDataDialog from '../components/company-profile/GeneralDataDialog';
import ProgramsDialog from '../components/company-profile/ProgramsDialog';

type DialogState = 
    | { type: 'general'; data: Company['general'] }
    | { type: 'programs'; data: Company['programas'] }
    | { type: 'member'; data: Company['miembros'] }
    | { type: 'address'; data: Company['domicilios'] }
    | { type: 'agent'; data: Company['agentesAduanales'] }
    | null;

const CompanyProfilePage = () => {
    const { activeCompany, updateCompany, loading } = useApp();
    const { t } = useLanguage();
    const [isSaving, setIsSaving] = useState(false);
    const [dialogState, setDialogState] = useState<DialogState>(null);

    const handleSave = async (updatedData: Partial<Company>) => {
        if (!activeCompany) return;
        
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
                <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 md:grid-cols-5">
                    <TabsTrigger value="general">General</TabsTrigger>
                    <TabsTrigger value="programas">Programas</TabsTrigger>
                    <TabsTrigger value="miembros">Miembros</TabsTrigger>
                    <TabsTrigger value="domicilios">Domicilios</TabsTrigger>
                    <TabsTrigger value="agentes">Agentes Aduanales</TabsTrigger>
                </TabsList>

                {/* TABS CONTENT */}
                <TabsContent value="general" className="grid md:grid-cols-3 gap-6">
                    <ProfileCard title="Datos Fiscales" icon={<FileText/>} onManage={() => setDialogState({ type: 'general', data: activeCompany.general })}>
                        <InfoRow label="Razón Social" value={activeCompany.general.datosFiscales.razonSocial} />
                        <InfoRow label="RFC" value={activeCompany.general.datosFiscales.rfc} />
                    </ProfileCard>
                    <ProfileCard title="Acta Constitutiva" icon={<FileText/>} onManage={() => setDialogState({ type: 'general', data: activeCompany.general })}>
                        <InfoRow label="No. de Escritura" value={activeCompany.general.actaConstitutiva.numeroEscritura} />
                        <InfoRow label="Fecha" value={activeCompany.general.actaConstitutiva.fecha} />
                    </ProfileCard>
                    <ProfileCard title="Representante Legal" icon={<UserCheck/>} onManage={() => setDialogState({ type: 'general', data: activeCompany.general })}>
                         <InfoRow label="No. de Escritura del Poder" value={activeCompany.general.representanteLegal.numeroEscrituraPoder} />
                        <InfoRow label="Fecha del Poder" value={activeCompany.general.representanteLegal.fechaPoder} />
                    </ProfileCard>
                </TabsContent>

                <TabsContent value="programas" className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                     <ProfileCard title="Programa IMMEX" hasData={!!activeCompany.programas.immex} onManage={() => setDialogState({ type: 'programs', data: activeCompany.programas })}>
                        {activeCompany.programas.immex && <InfoRow label="No. de Registro" value={activeCompany.programas.immex.numeroRegistro} />}
                    </ProfileCard>
                     <ProfileCard title="Programa PROSEC" hasData={!!activeCompany.programas.prosec} onManage={() => setDialogState({ type: 'programs', data: activeCompany.programas })}>
                        {activeCompany.programas.prosec && <InfoRow label="No. de Registro" value={activeCompany.programas.prosec.numeroRegistro} />}
                    </ProfileCard>
                </TabsContent>

                <TabsContent value="miembros">
                    <TableCard title="Miembros de la Sociedad" icon={<Users />} onManage={() => setDialogState({ type: 'member', data: activeCompany.miembros })}>
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
                    <TableCard title="Domicilios de Operación" icon={<MapPin />} onManage={() => setDialogState({ type: 'address', data: activeCompany.domicilios })}>
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
                    <TableCard title="Agentes Aduanales" icon={<Ship />} onManage={() => setDialogState({ type: 'agent', data: activeCompany.agentesAduanales })}>
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
        </div>
    );
};

// --- Helper Components ---
const ProfileCard: React.FC<{ title: string; icon?: React.ReactNode; children: React.ReactNode; hasData?: boolean; onManage?: () => void }> = ({ title, icon, children, hasData = true, onManage }) => (
    <Card className="flex flex-col">
        <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0">
            <div className="flex items-center gap-2">
                {icon}
                <CardTitle className="text-base font-semibold">{title}</CardTitle>
            </div>
             {onManage && <Button variant="ghost" size="sm" onClick={onManage}><Pencil className="h-3 w-3 mr-1"/> Manage</Button>}
        </CardHeader>
        <CardContent className="space-y-4 text-sm flex-1">
            {hasData ? children : <p className="text-muted-foreground">No hay datos disponibles.</p>}
        </CardContent>
    </Card>
);

const TableCard: React.FC<{ title: string; icon?: React.ReactNode; children: React.ReactNode; onManage?: () => void; }> = ({ title, icon, children, onManage }) => (
    <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0">
            <div className="flex items-center gap-2">
                {icon}
                <CardTitle className="text-base font-semibold">{title}</CardTitle>
            </div>
            {onManage && <Button variant="outline" size="sm" onClick={onManage}><Pencil className="h-3 w-3 mr-2"/> Manage List</Button>}
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
        <label className="text-xs font-medium text-muted-foreground">{label}</label>
        <p className="font-medium text-foreground">{value || '-'}</p>
    </div>
);

export default CompanyProfilePage;