import React, { useState, useRef } from 'react';
import { useApp } from '../hooks/useApp';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import Button from '../components/ui/Button';
import { Loader2, Building, Pencil, Users, MapPin, Briefcase, FileText, Upload, GanttChartSquare, Package, Home } from 'lucide-react';
import GeneralDataDialog from '../components/company-profile/GeneralDataDialog';
import ProgramsDialog from '../components/company-profile/ProgramsDialog';
import MemberDialog from '../components/company-profile/MemberDialog';
import AddressDialog from '../components/company-profile/AddressDialog';
import CustomsAgentDialog from '../components/company-profile/CustomsAgentDialog';
import DocumentUploadDialog from '../components/company-profile/DocumentUploadDialog';
import { Company } from '../lib/types';
import { useToast } from '../hooks/useToast';
import { useLanguage } from '../hooks/useLanguage';

const CompanyProfilePage: React.FC = () => {
    const { activeCompany, updateCompany, loading } = useApp();
    const { t } = useLanguage();
    const { toast } = useToast();
    const [dialog, setDialog] = useState<string | null>(null);
    const [selectedItem, setSelectedItem] = useState<any>(null);
    const [isUploading, setIsUploading] = useState(false);

    // Refs for smooth scrolling
    const generalRef = useRef<HTMLDivElement>(null);
    const programsRef = useRef<HTMLDivElement>(null);
    const membersRef = useRef<HTMLDivElement>(null);
    const addressesRef = useRef<HTMLDivElement>(null);
    const agentsRef = useRef<HTMLDivElement>(null);
    const documentsRef = useRef<HTMLDivElement>(null);

    const navSections = [
        { label: t('profileNavGeneral'), ref: generalRef, icon: Building },
        { label: t('profileNavPrograms'), ref: programsRef, icon: Package },
        { label: t('profileNavMembers'), ref: membersRef, icon: Users },
        { label: t('profileNavAddresses'), ref: addressesRef, icon: Home },
        { label: t('profileNavAgents'), ref: agentsRef, icon: Briefcase },
        { label: t('profileNavDocuments'), ref: documentsRef, icon: FileText },
    ];

    const scrollToSection = (ref: React.RefObject<HTMLDivElement>) => {
        ref.current?.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
        });
    };


    const handleOpenDialog = (name: string, item?: any) => {
        setSelectedItem(item);
        setDialog(name);
    };

    const handleCloseDialog = () => {
        setDialog(null);
        setSelectedItem(null);
    };

    const handleDocumentUpload = async (file: File, category: string) => {
        if (!activeCompany) return;
        setIsUploading(true);
        // This is a mock upload. In a real app, you'd upload to cloud storage.
        await new Promise(res => setTimeout(res, 1500));
        
        const newDocument = {
            id: `doc-${Date.now()}`,
            name: file.name,
            url: URL.createObjectURL(file), // Temporary URL
            type: file.type,
            size: file.size,
            uploadDate: new Date().toISOString(),
            category: category,
        };
        const updatedCompany: Company = {
            ...activeCompany,
            documents: [...(activeCompany.documents || []), newDocument],
        };
        await updateCompany(updatedCompany);
        setIsUploading(false);
        handleCloseDialog();
        toast({ title: 'Documento Subido', description: `${file.name} ha sido añadido.` });
    };


    if (loading || !activeCompany) {
        return <div className="flex h-full items-center justify-center"><Loader2 className="h-16 w-16 animate-spin text-primary" /></div>;
    }

    const { general, programas, miembros, domicilios, agentesAduanales, documents } = activeCompany;

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold flex items-center gap-2">
                <GanttChartSquare className="h-6 w-6" /> {activeCompany.name} - {t('sidebarCompanyProfile')}
            </h1>

            {/* Quick Navigation */}
            <Card>
                <CardContent className="p-4">
                    <div className="flex flex-wrap gap-2">
                        {navSections.map(section => (
                            <Button key={section.label} variant="ghost" onClick={() => scrollToSection(section.ref)}>
                                <section.icon className="mr-2 h-4 w-4" />
                                {section.label}
                            </Button>
                        ))}
                    </div>
                </CardContent>
            </Card>
            
            {/* General Data */}
            <Card ref={generalRef} id="general">
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>{t('profileNavGeneral')}</CardTitle>
                    <Button variant="outline" size="sm" onClick={() => handleOpenDialog('general')}><Pencil className="mr-2 h-4 w-4" /> {t('edit')}</Button>
                </CardHeader>
                <CardContent className="grid md:grid-cols-2 gap-4 text-sm">
                    <div><strong>{t('razonSocial')}:</strong> {general.datosFiscales.razonSocial}</div>
                    <div><strong>RFC:</strong> {general.datosFiscales.rfc}</div>
                    <div><strong>{t('phone')}:</strong> {general.datosFiscales.telefono}</div>
                    <div className="md:col-span-2"><strong>{t('domicilioFiscal')}:</strong> {general.datosFiscales.domicilioFiscal}</div>
                </CardContent>
            </Card>
            
            {/* Programs */}
             <Card ref={programsRef} id="programas">
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>{t('profileNavPrograms')} (IMMEX, PROSEC, etc.)</CardTitle>
                    <Button variant="outline" size="sm" onClick={() => handleOpenDialog('programs')}><Pencil className="mr-2 h-4 w-4" /> {t('edit')}</Button>
                </CardHeader>
                <CardContent className="text-sm space-y-2">
                   {programas.immex && <p><strong>IMMEX:</strong> {programas.immex.numeroRegistro} ({programas.immex.modalidad})</p>}
                   {programas.prosec && <p><strong>PROSEC:</strong> {programas.prosec.numeroRegistro} (Sector: {programas.prosec.sector})</p>}
                   {!programas.immex && !programas.prosec && <p className="text-muted-foreground">{t('noProgramsRegistered')}</p>}
                </CardContent>
            </Card>

            {/* Members */}
             <Card ref={membersRef} id="miembros">
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="flex items-center gap-2"><Users className="h-5 w-5" /> {t('profileNavMembers')}</CardTitle>
                    <Button variant="outline" size="sm" onClick={() => handleOpenDialog('member')}><Pencil className="mr-2 h-4 w-4" /> {t('manage')}</Button>
                </CardHeader>
                <CardContent>
                    <ul className="list-disc list-inside text-sm">
                        {miembros.map(m => <li key={m.id}>{m.nombre} (RFC: {m.rfc})</li>)}
                    </ul>
                </CardContent>
            </Card>

            <div className="grid md:grid-cols-2 gap-6">
                 {/* Domiciles */}
                 <Card ref={addressesRef} id="domicilios">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle className="flex items-center gap-2"><Home className="h-5 w-5" /> {t('profileNavAddresses')}</CardTitle>
                        <Button variant="outline" size="sm" onClick={() => handleOpenDialog('address')}><Pencil className="mr-2 h-4 w-4" /> {t('manage')}</Button>
                    </CardHeader>
                    <CardContent>
                        <ul className="list-disc list-inside text-sm">
                            {domicilios.map(d => <li key={d.id}>{d.direccionCompleta}</li>)}
                        </ul>
                    </CardContent>
                </Card>

                 {/* Customs Agents */}
                 <Card ref={agentsRef} id="agentes">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle className="flex items-center gap-2"><Briefcase className="h-5 w-5" /> {t('profileNavAgents')}</CardTitle>
                        <Button variant="outline" size="sm" onClick={() => handleOpenDialog('agent')}><Pencil className="mr-2 h-4 w-4" /> {t('manage')}</Button>
                    </CardHeader>
                    <CardContent>
                         <ul className="list-disc list-inside text-sm">
                            {agentesAduanales.map(a => <li key={a.id}>{a.nombre} (Patente: {a.numeroPatente})</li>)}
                        </ul>
                    </CardContent>
                </Card>
            </div>
            
            {/* Documents */}
            <Card ref={documentsRef} id="documentos">
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="flex items-center gap-2"><FileText className="h-5 w-5" /> {t('profileNavDocuments')}</CardTitle>
                    <Button variant="outline" size="sm" onClick={() => handleOpenDialog('upload')}><Upload className="mr-2 h-4 w-4" /> {t('upload')}</Button>
                </CardHeader>
                <CardContent>
                     <ul className="space-y-2">
                        {(documents || []).map(doc => (
                            <li key={doc.id} className="text-sm flex justify-between items-center p-2 rounded hover:bg-accent">
                                <a href={doc.url} target="_blank" rel="noreferrer" className="text-primary hover:underline">{doc.name}</a>
                                <span className="text-muted-foreground text-xs">{doc.category} - {(doc.size/1024).toFixed(1)} KB</span>
                            </li>
                        ))}
                         {(!documents || documents.length === 0) && <p className="text-muted-foreground text-sm text-center py-4">{t('noDocumentsUploaded')}</p>}
                    </ul>
                </CardContent>
            </Card>

            {/* Dialogs */}
            {dialog === 'general' && <GeneralDataDialog isOpen={true} onClose={handleCloseDialog} company={activeCompany} />}
            {dialog === 'programs' && <ProgramsDialog isOpen={true} onClose={handleCloseDialog} company={activeCompany} />}
            {dialog === 'member' && <MemberDialog isOpen={true} onClose={handleCloseDialog} company={activeCompany} />}
            {dialog === 'address' && <AddressDialog isOpen={true} onClose={handleCloseDialog} company={activeCompany} />}
            {dialog === 'agent' && <CustomsAgentDialog isOpen={true} onClose={handleCloseDialog} company={activeCompany} />}
            {dialog === 'upload' && <DocumentUploadDialog isOpen={true} onClose={handleCloseDialog} onUpload={handleDocumentUpload} isUploading={isUploading} />}

        </div>
    );
};

export default CompanyProfilePage;