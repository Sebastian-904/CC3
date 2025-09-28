import React, { useState } from 'react';
import { useApp } from '../hooks/useApp';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import Button from '../components/ui/Button';
import { Building, Edit, Loader2 } from 'lucide-react';
import GeneralDataDialog from '../components/company-profile/GeneralDataDialog';
import ProgramsDialog from '../components/company-profile/ProgramsDialog';
import AddressDialog from '../components/company-profile/AddressDialog';
import MemberDialog from '../components/company-profile/MemberDialog';
import CustomsAgentDialog from '../components/company-profile/CustomsAgentDialog';
import Anexo24Dialog from '../components/company-profile/Anexo24Dialog';
import PadronesDialog from '../components/company-profile/PadronesDialog';

const CompanyProfilePage: React.FC = () => {
    const { activeCompany, loading } = useApp();
    const [dialogOpen, setDialogOpen] = useState<string | null>(null);

    if (loading || !activeCompany) {
        return <div className="flex h-full items-center justify-center"><Loader2 className="h-16 w-16 animate-spin text-primary" /></div>;
    }

    const sections = [
        { key: 'general', title: 'Datos Generales', component: GeneralDataDialog },
        { key: 'programs', title: 'Programas y Certificaciones', component: ProgramsDialog },
        { key: 'anexo24', title: 'Anexo 24', component: Anexo24Dialog },
        { key: 'padrones', title: 'Padrones de Importadores', component: PadronesDialog },
        { key: 'addresses', title: 'Domicilios de Operación', component: AddressDialog },
        { key: 'members', title: 'Miembros y Socios', component: MemberDialog },
        { key: 'agents', title: 'Encargos Conferidos Dados de Alta', component: CustomsAgentDialog },
    ];

    const renderDialog = () => {
        const section = sections.find(s => s.key === dialogOpen);
        if (!section) return null;
        const DialogComponent = section.component;
        return <DialogComponent isOpen={true} onClose={() => setDialogOpen(null)} company={activeCompany} />;
    };
    
    const renderSummary = (key: string) => {
        switch (key) {
            case 'general':
                return (
                    <div className="text-sm text-muted-foreground space-y-1">
                        <p><strong>RFC:</strong> {activeCompany.general.datosFiscales.rfc}</p>
                        <p className="truncate"><strong>Domicilio Fiscal:</strong> {activeCompany.general.datosFiscales.domicilioFiscal}</p>
                    </div>
                );
            case 'programs':
                 const immex = activeCompany.programas.immex;
                 const prosec = activeCompany.programas.prosec;
                return (
                    <div className="text-sm text-muted-foreground space-y-1">
                        {immex && <p><strong>IMMEX:</strong> {immex.numeroRegistro} ({immex.domiciliosAutorizados.length} domicilio(s))</p>}
                        {prosec && <p><strong>PROSEC:</strong> {prosec.numeroRegistro} ({prosec.domiciliosAutorizados.length} domicilio(s))</p>}
                        {!immex && !prosec && <p>No hay programas registrados.</p>}
                    </div>
                );
            case 'anexo24':
                 return (
                    <div className="text-sm text-muted-foreground space-y-1">
                        <p><strong>Proveedor:</strong> {activeCompany.anexo24?.empresa || 'N/A'}</p>
                        <p><strong>Versión:</strong> {activeCompany.anexo24?.version || 'N/A'}</p>
                    </div>
                 );
            case 'padrones':
                 return (
                     <div className="text-sm text-muted-foreground space-y-1">
                        <p><strong>Padrón General:</strong> {activeCompany.padrones?.importadores.activo ? 'Activo' : 'Inactivo'}</p>
                        <p><strong>Padrones Sectoriales:</strong> {activeCompany.padrones?.sectoriales.length || 0}</p>
                    </div>
                 );
            case 'addresses': return <div className="text-sm text-muted-foreground">{`${activeCompany.domicilios.length} domicilio(s) registrado(s)`}</div>;
            case 'members': return <div className="text-sm text-muted-foreground">{`${activeCompany.miembros.length} miembro(s) registrado(s)`}</div>;
            case 'agents': return <div className="text-sm text-muted-foreground">{`${activeCompany.agentesAduanales.length} agente(s) aduanal(es)`}</div>;
            default: return null;
        }
    }


    return (
        <>
            <div className="space-y-4">
                <div className="space-y-1">
                    <h1 className="text-2xl font-bold flex items-center gap-2"><Building className="h-6 w-6" /> Perfil de la Empresa</h1>
                    <p className="text-muted-foreground">Administra la información clave de tu empresa.</p>
                </div>

                <Card>
                    <CardContent className="p-2">
                        <nav className="flex flex-wrap gap-x-4 gap-y-2">
                            {sections.map(section => (
                                <a key={section.key} href={`#${section.key}`} className="px-2 py-1 text-sm font-medium text-muted-foreground hover:text-primary hover:bg-accent rounded-md transition-colors">
                                    {section.title}
                                </a>
                            ))}
                        </nav>
                    </CardContent>
                </Card>

                {sections.map(section => (
                     <Card key={section.key} id={section.key}>
                        <CardHeader className="flex flex-row items-start justify-between">
                            <div className="space-y-1">
                                <CardTitle>{section.title}</CardTitle>
                            </div>
                            <Button variant="outline" size="sm" onClick={() => setDialogOpen(section.key)}>
                                <Edit className="mr-2 h-4 w-4" /> Editar
                            </Button>
                        </CardHeader>
                        <CardContent>
                           {renderSummary(section.key)}
                        </CardContent>
                    </Card>
                ))}
            </div>
            {renderDialog()}
        </>
    );
};

export default CompanyProfilePage;