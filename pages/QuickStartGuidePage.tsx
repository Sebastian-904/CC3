import React from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '../components/ui/Card';
import { HelpCircle } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useLanguage } from '../hooks/useLanguage';

const QuickStartGuidePage: React.FC = () => {
    const { user } = useAuth();
    const { t } = useLanguage();

    const GuideSection: React.FC<{ title: string, description: string, children: React.ReactNode }> = ({ title, description, children }) => (
        <Card>
            <CardHeader>
                <CardTitle>{title}</CardTitle>
                <CardDescription>{description}</CardDescription>
            </CardHeader>
            <CardContent className="prose prose-sm dark:prose-invert max-w-none">
                {children}
            </CardContent>
        </Card>
    );

    const ConsultantGuide = () => (
        <>
            <GuideSection title={t('consultantGuideTitle')} description={t('quickStartWelcome')}>
                <p>{t('consultantGuide1')}</p>
            </GuideSection>
            <GuideSection title="2. Perfil de Empresa y IA" description="">
                <p>{t('consultantGuide2')}</p>
            </GuideSection>
            <GuideSection title="3. Biblioteca de Cumplimiento" description="">
                <p>{t('consultantGuide3')}</p>
            </GuideSection>
            <GuideSection title="4. Gestión de Usuarios" description="">
                <p>{t('consultantGuide4')}</p>
            </GuideSection>
        </>
    );

    const ClientGuide = () => (
        <>
            <GuideSection title={t('clientGuideTitle')} description={t('quickStartWelcome')}>
                <p>{t('clientGuide1')}</p>
            </GuideSection>
            <GuideSection title="2. Revisa tu Perfil de Empresa" description="">
                <p>{t('clientGuide2')}</p>
            </GuideSection>
            <GuideSection title="3. Consulta la Biblioteca" description="">
                <p>{t('clientGuide3')}</p>
            </GuideSection>
        </>
    );

    return (
        <div className="space-y-6">
            <div className="space-y-1">
                <h1 className="text-2xl font-bold flex items-center gap-2">
                    <HelpCircle className="h-6 w-6" /> {t('quickStartTitle')}
                </h1>
                <p className="text-muted-foreground">{t('quickStartDesc')}</p>
            </div>
            {user?.role === 'cliente' ? <ClientGuide /> : <ConsultantGuide />}
        </div>
    );
};

export default QuickStartGuidePage;