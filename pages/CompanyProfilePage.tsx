import React, { useState, useEffect, useCallback } from 'react';
import { useApp } from '../hooks/useApp';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../components/ui/Card';
import Button from '../components/ui/Button';
import { Loader2, Building, FileText, UserCheck, Users, MapPin, Ship } from 'lucide-react';
import { Company } from '../lib/types';
import Input from '../components/ui/Input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/Tabs';
import { cn } from '../lib/utils';
import set from 'lodash.set';

const CompanyProfilePage = () => {
    const { activeCompany, updateCompany, loading } = useApp();
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [formData, setFormData] = useState<Company | null>(null);

    useEffect(() => {
        if (activeCompany) {
            setFormData(JSON.parse(JSON.stringify(activeCompany))); // Deep copy
        }
    }, [activeCompany]);

    const handleSave = async () => {
        if (!formData) return;
        setIsSaving(true);
        try {
            await updateCompany(formData);
            setIsEditing(false);
        } catch (error) {
            console.error("Failed to save company profile:", error);
        } finally {
            setIsSaving(false);
        }
    };
    
    const handleCancel = () => {
        setIsEditing(false);
        if (activeCompany) {
            setFormData(JSON.parse(JSON.stringify(activeCompany)));
        }
    };
    
    const handleNestedChange = useCallback((path: string, value: any) => {
        setFormData(prevData => {
            if (!prevData) return null;
            const newData = { ...prevData };
            set(newData, path, value);
            return newData;
        });
    }, []);

    if (loading && !activeCompany) {
        return <div className="flex h-full items-center justify-center"><Loader2 className="h-16 w-16 animate-spin text-primary" /></div>;
    }

    if (!activeCompany) {
        return <div className="flex h-full items-center justify-center"><p className="text-muted-foreground">Please select a company to view its profile.</p></div>;
    }
    
    if (!formData) return null; // Should not happen if activeCompany is present

    const general = formData.general;
    const programas = formData.programas;

    return (
        <div className="max-w-6xl mx-auto space-y-6">
            <div className="flex justify-between items-center">
                <div className="space-y-1">
                    <h1 className="text-2xl font-bold flex items-center gap-2"><Building className="h-6 w-6" /> {activeCompany.name}</h1>
                    <p className="text-muted-foreground">Manage the company's profile and compliance information.</p>
                </div>
                 {isEditing ? (
                    <div className="flex gap-2">
                        <Button variant="outline" onClick={handleCancel} disabled={isSaving}>Cancel</Button>
                        <Button onClick={handleSave} disabled={isSaving}>
                            {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Save Changes
                        </Button>
                    </div>
                ) : (
                    <Button variant="outline" onClick={() => setIsEditing(true)}>Edit Profile</Button>
                )}
            </div>

            <Tabs defaultValue="general">
                <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 md:grid-cols-5">
                    <TabsTrigger value="general">General</TabsTrigger>
                    <TabsTrigger value="programas">Programas</TabsTrigger>
                    <TabsTrigger value="miembros">Miembros</TabsTrigger>
                    <TabsTrigger value="domicilios">Domicilios</TabsTrigger>
                    <TabsTrigger value="agentes">Agentes Aduanales</TabsTrigger>
                </TabsList>

                {/* GENERAL TAB */}
                <TabsContent value="general" className="grid md:grid-cols-3 gap-6">
                    <ProfileCard title="Datos Fiscales" icon={<FileText/>}>
                        <InfoRow label="Razón Social" value={general.datosFiscales.razonSocial} path="general.datosFiscales.razonSocial" isEditing={isEditing} onChange={handleNestedChange} />
                        <InfoRow label="RFC" value={general.datosFiscales.rfc} path="general.datosFiscales.rfc" isEditing={isEditing} onChange={handleNestedChange} />
                        <InfoRow label="Actividad Económica" value={general.datosFiscales.actividadEconomica} path="general.datosFiscales.actividadEconomica" isEditing={isEditing} onChange={handleNestedChange} />
                        <InfoRow label="Teléfono" value={general.datosFiscales.telefono} path="general.datosFiscales.telefono" isEditing={isEditing} onChange={handleNestedChange} />
                        <InfoRow label="Domicilio Fiscal" value={general.datosFiscales.domicilioFiscal} path="general.datosFiscales.domicilioFiscal" isEditing={isEditing} onChange={handleNestedChange} />
                    </ProfileCard>
                    <ProfileCard title="Acta Constitutiva" icon={<FileText/>}>
                        <InfoRow label="No. de Escritura" value={general.actaConstitutiva.numeroEscritura} path="general.actaConstitutiva.numeroEscritura" isEditing={isEditing} onChange={handleNestedChange} />
                        <InfoRow label="Fecha" value={general.actaConstitutiva.fecha} path="general.actaConstitutiva.fecha" type="date" isEditing={isEditing} onChange={handleNestedChange} />
                        <InfoRow label="Nombre Fedatario Público" value={general.actaConstitutiva.nombreFedatario} path="general.actaConstitutiva.nombreFedatario" isEditing={isEditing} onChange={handleNestedChange} />
                    </ProfileCard>
                    <ProfileCard title="Representante Legal" icon={<UserCheck/>}>
                        <InfoRow label="No. de Escritura del Poder" value={general.representanteLegal.numeroEscrituraPoder} path="general.representanteLegal.numeroEscrituraPoder" isEditing={isEditing} onChange={handleNestedChange} />
                        <InfoRow label="Fecha del Poder" value={general.representanteLegal.fechaPoder} path="general.representanteLegal.fechaPoder" type="date" isEditing={isEditing} onChange={handleNestedChange} />
                        <InfoRow label="Nombre Fedatario Público" value={general.representanteLegal.nombreFedatario} path="general.representanteLegal.nombreFedatario" isEditing={isEditing} onChange={handleNestedChange} />
                    </ProfileCard>
                </TabsContent>

                {/* PROGRAMAS TAB */}
                <TabsContent value="programas" className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <ProfileCard title="Programa IMMEX" hasData={!!programas.immex}>
                        {programas.immex && <>
                          <InfoRow label="No. de Registro" value={programas.immex.numeroRegistro} path="programas.immex.numeroRegistro" isEditing={isEditing} onChange={handleNestedChange} />
                          <InfoRow label="Modalidad" value={programas.immex.modalidad} path="programas.immex.modalidad" isEditing={isEditing} onChange={handleNestedChange} />
                          <InfoRow label="Fecha de Autorización" value={programas.immex.fechaAutorizacion} path="programas.immex.fechaAutorizacion" type="date" isEditing={isEditing} onChange={handleNestedChange} />
                        </>}
                    </ProfileCard>
                    <ProfileCard title="Programa PROSEC" hasData={!!programas.prosec}>
                         {programas.prosec && <>
                           <InfoRow label="No. de Registro" value={programas.prosec.numeroRegistro} path="programas.prosec.numeroRegistro" isEditing={isEditing} onChange={handleNestedChange} />
                           <InfoRow label="Sector" value={programas.prosec.sector} path="programas.prosec.sector" isEditing={isEditing} onChange={handleNestedChange} />
                           <InfoRow label="Fecha de Autorización" value={programas.prosec.fechaAutorizacion} path="programas.prosec.fechaAutorizacion" type="date" isEditing={isEditing} onChange={handleNestedChange} />
                         </>}
                    </ProfileCard>
                     <ProfileCard title="Certificación IVA y IEPS" hasData={!!programas.certificacionIVAYIEPS}>
                         {programas.certificacionIVAYIEPS && <>
                           <InfoRow label="Folio" value={programas.certificacionIVAYIEPS.folio} path="programas.certificacionIVAYIEPS.folio" isEditing={isEditing} onChange={handleNestedChange} />
                           <InfoRow label="Rubro" value={programas.certificacionIVAYIEPS.rubro} path="programas.certificacionIVAYIEPS.rubro" isEditing={isEditing} onChange={handleNestedChange} />
                           <InfoRow label="Resolución" value={programas.certificacionIVAYIEPS.resolucion} path="programas.certificacionIVAYIEPS.resolucion" isEditing={isEditing} onChange={handleNestedChange} />
                           <InfoRow label="Próxima Renovación" value={programas.certificacionIVAYIEPS.proximaRenovacion} path="programas.certificacionIVAYIEPS.proximaRenovacion" type="date" isEditing={isEditing} onChange={handleNestedChange} />
                         </>}
                    </ProfileCard>
                     <ProfileCard title="Padrón de Importadores" hasData={!!programas.padronImportadores}>
                         {programas.padronImportadores && <>
                           <InfoRow label="Folio" value={programas.padronImportadores.folio} path="programas.padronImportadores.folio" isEditing={isEditing} onChange={handleNestedChange} />
                           <InfoRow label="Fecha de Registro" value={programas.padronImportadores.fechaRegistro} path="programas.padronImportadores.fechaRegistro" type="date" isEditing={isEditing} onChange={handleNestedChange} />
                           <InfoRow label="Sector" value={programas.padronImportadores.sector} path="programas.padronImportadores.sector" isEditing={isEditing} onChange={handleNestedChange} />
                         </>}
                    </ProfileCard>
                </TabsContent>

                {/* MIEMBROS TAB */}
                <TabsContent value="miembros">
                    <TableCard title="Miembros de la Sociedad" icon={<Users />}>
                        <thead className="bg-muted/50">
                            <tr>
                                <th className="p-3 text-sm font-medium text-left">Nombre / Razón Social</th>
                                <th className="p-3 text-sm font-medium text-left">RFC</th>
                                <th className="p-3 text-sm font-medium text-left">Tipo</th>
                                <th className="p-3 text-sm font-medium text-left">Carácter</th>
                                <th className="p-3 text-sm font-medium text-left">Nacionalidad</th>
                                <th className="p-3 text-sm font-medium text-left">Tributa en México</th>
                            </tr>
                        </thead>
                        <tbody>
                            {formData.miembros.map((miembro, index) => (
                                <tr key={miembro.id} className="border-b">
                                    <td className="p-3">{miembro.nombre}</td>
                                    <td className="p-3">{miembro.rfc}</td>
                                    <td className="p-3">{miembro.tipoPersona}</td>
                                    <td className="p-3">{miembro.caracter}</td>
                                    <td className="p-3">{miembro.nacionalidad}</td>
                                    <td className="p-3">{miembro.tributaEnMexico ? 'Sí' : 'No'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </TableCard>
                </TabsContent>
                
                {/* DOMICILIOS TAB */}
                 <TabsContent value="domicilios">
                    <TableCard title="Domicilios de Operación" icon={<MapPin />}>
                        <thead className="bg-muted/50">
                            <tr>
                                <th className="p-3 text-sm font-medium text-left">Dirección Completa</th>
                                <th className="p-3 text-sm font-medium text-left">Teléfono</th>
                                <th className="p-3 text-sm font-medium text-left">Programa Vinculado</th>
                            </tr>
                        </thead>
                        <tbody>
                            {formData.domicilios.map(domicilio => (
                                <tr key={domicilio.id} className="border-b">
                                    <td className="p-3">{domicilio.direccionCompleta}</td>
                                    <td className="p-3">{domicilio.telefono}</td>
                                    <td className="p-3">{domicilio.programaVinculado}</td>
                                </tr>
                            ))}
                        </tbody>
                    </TableCard>
                </TabsContent>

                {/* AGENTES ADUANALES TAB */}
                <TabsContent value="agentes">
                    <TableCard title="Agentes Aduanales" icon={<Ship />}>
                        <thead className="bg-muted/50">
                            <tr>
                                <th className="p-3 text-sm font-medium text-left">Nombre Agente / Agencia</th>
                                <th className="p-3 text-sm font-medium text-left">No. Patente</th>
                                <th className="p-3 text-sm font-medium text-left">Estado del Encargo</th>
                            </tr>
                        </thead>
                        <tbody>
                            {formData.agentesAduanales.map(agente => (
                                <tr key={agente.id} className="border-b">
                                    <td className="p-3">{agente.nombre}</td>
                                    <td className="p-3">{agente.numeroPatente}</td>
                                    <td className="p-3">{agente.estadoEncargo}</td>
                                </tr>
                            ))}
                        </tbody>
                    </TableCard>
                </TabsContent>

            </Tabs>
        </div>
    );
};

// --- Helper Components ---

const ProfileCard: React.FC<{ title: string; icon?: React.ReactNode; children: React.ReactNode; hasData?: boolean }> = ({ title, icon, children, hasData = true }) => (
    <Card>
        <CardHeader className="flex flex-row items-center gap-2 space-y-0">
            {icon}
            <CardTitle className="text-base font-semibold">{title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
            {hasData ? children : <p className="text-muted-foreground">No hay datos disponibles.</p>}
        </CardContent>
    </Card>
);

const TableCard: React.FC<{ title: string; icon?: React.ReactNode; children: React.ReactNode }> = ({ title, icon, children }) => (
    <Card>
        <CardHeader className="flex flex-row items-center gap-2 space-y-0">
            {icon}
            <CardTitle className="text-base font-semibold">{title}</CardTitle>
        </CardHeader>
        <CardContent>
            <div className="border rounded-lg overflow-hidden">
                <table className="w-full text-sm">{children}</table>
            </div>
        </CardContent>
    </Card>
);

interface InfoRowProps {
    label: string;
    value: string;
    isEditing: boolean;
    path: string;
    type?: string;
    onChange: (path: string, value: string) => void;
}

const InfoRow: React.FC<InfoRowProps> = ({ label, value, isEditing, path, type = 'text', onChange }) => {
    return (
        <div>
            <label className="text-xs font-medium text-muted-foreground">{label}</label>
            {isEditing ? (
                <Input 
                    type={type} 
                    value={value || ''} 
                    onChange={e => onChange(path, e.target.value)} 
                    className="h-9 mt-1" 
                />
            ) : (
                <p className="font-medium text-foreground">{value || '-'}</p>
            )}
        </div>
    );
};

export default CompanyProfilePage;
