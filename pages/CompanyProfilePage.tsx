import React, { useState } from 'react';
import { useApp } from '../hooks/useApp';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import Button from '../components/ui/Button';
import { Building, Edit, Loader2 } from 'lucide-react';
import GeneralDataDialog from '../components/company-profile/GeneralDataDialog';
import ProgramsDialog from '../components/company-profile/ProgramsDialog';
import AddressDialog from '../components/company-profile/AddressDialog';
import MemberDialog from '../components/company-profile/MemberDialog';
import CustomsAgentDialog from '../components/company-profile/CustomsAgentDialog';

const CompanyProfilePage: React.FC = () => {
    const { activeCompany, loading } = useApp();
    const [dialogOpen, setDialogOpen] = useState<string | null>(null);

    if (loading || !activeCompany) {
        return <div className="flex h-full items-center justify-center"><Loader2 className="h-16 w-16 animate-spin text-primary" /></div>;
    }

    const sections = [
        { key: 'general', title: 'Datos Generales', component: GeneralDataDialog },
        { key: 'programs', title: 'Programas y Certificaciones', component: ProgramsDialog },
        { key: 'addresses', title: 'Domicilios Registrados', component: AddressDialog },
        { key: 'members', title: 'Miembros y Socios', component: MemberDialog },
        { key: 'agents', title: 'Agentes Aduanales', component: CustomsAgentDialog },
    ];

    const renderDialog = () => {
        const section = sections.find(s => s.key === dialogOpen);
        if (!section) return null;
        const DialogComponent = section.component;
        return <DialogComponent isOpen={true} onClose={() => setDialogOpen(null)} company={activeCompany} />;
    };

    return (
        <>
            <div className="space-y-6">
                <div className="space-y-1">
                    <h1 className="text-2xl font-bold flex items-center gap-2"><Building className="h-6 w-6" /> Perfil de la Empresa</h1>
                    <p className="text-muted-foreground">Administra la información clave de tu empresa.</p>
                </div>

                {sections.map(section => (
                     <Card key={section.key}>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div className="space-y-1">
                                <CardTitle>{section.title}</CardTitle>
                            </div>
                            <Button variant="outline" size="sm" onClick={() => setDialogOpen(section.key)}>
                                <Edit className="mr-2 h-4 w-4" /> Editar
                            </Button>
                        </CardHeader>
                        <CardContent>
                            {/* Simplified content view. Full details in dialogs. */}
                            <div className="text-sm text-muted-foreground">
                                {section.key === 'general' && `RFC: ${activeCompany.general.datosFiscales.rfc}`}
                                {section.key === 'programs' && `IMMEX: ${activeCompany.programas.immex?.numeroRegistro || 'N/A'}`}
                                {section.key === 'addresses' && `${activeCompany.domicilios.length} domicilio(s) registrado(s)`}
                                {section.key === 'members' && `${activeCompany.miembros.length} miembro(s) registrado(s)`}
                                {section.key === 'agents' && `${activeCompany.agentesAduanales.length} agente(s) aduanal(es)`}
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
            {renderDialog()}
        </>
    );
};

export default CompanyProfilePage;
