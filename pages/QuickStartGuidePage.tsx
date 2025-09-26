import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../components/ui/Accordion';
import { BookOpen, Building, LayoutDashboard, Sparkles, Users } from 'lucide-react';

const QuickStartGuidePage: React.FC = () => {
    return (
        <div className="space-y-6 max-w-4xl mx-auto">
             <div className="space-y-1">
                <h1 className="text-2xl font-bold flex items-center gap-2"><BookOpen className="h-6 w-6" /> Guía de Inicio Rápido</h1>
                <p className="text-muted-foreground">Bienvenido a CompliancePro. Aquí tienes una guía rápida para empezar.</p>
            </div>
            
            <Card>
                <CardHeader>
                    <CardTitle>Pasos Esenciales</CardTitle>
                    <CardDescription>Sigue estos pasos para configurar tu cuenta y empezar a gestionar el cumplimiento.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Accordion type="single" collapsible className="w-full">
                        <AccordionItem value="item-1">
                            <AccordionTrigger className="text-base">
                                <div className="flex items-center gap-2">
                                    <Building className="h-5 w-5 text-primary" />
                                    <span>Paso 1: Completa el Perfil de la Empresa</span>
                                </div>
                            </AccordionTrigger>
                            <AccordionContent>
                                Ve a la sección de "Perfil de la Empresa". Rellena todos los datos fiscales, programas (IMMEX, PROSEC), y añade los domicilios y agentes aduanales. Esta información es crucial para que el sistema pueda generar reportes precisos y para que el asistente de IA te dé recomendaciones relevantes.
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-2">
                            <AccordionTrigger className="text-base">
                                 <div className="flex items-center gap-2">
                                    <Users className="h-5 w-5 text-primary" />
                                    <span>Paso 2: Invita a tu Equipo</span>
                                </div>
                            </AccordionTrigger>
                            <AccordionContent>
                                En la sección de "Usuarios", puedes invitar a otros miembros de tu equipo. Asigna los roles correspondientes (cliente, consultor, administrador) para controlar el acceso a las diferentes funcionalidades de la plataforma.
                            </AccordionContent>
                        </AccordionItem>
                         <AccordionItem value="item-3">
                            <AccordionTrigger className="text-base">
                                 <div className="flex items-center gap-2">
                                    <LayoutDashboard className="h-5 w-5 text-primary" />
                                    <span>Paso 3: Explora el Dashboard</span>
                                </div>
                            </AccordionTrigger>
                            <AccordionContent>
                                El Dashboard es tu centro de operaciones. Aquí verás un calendario con tus tareas, indicadores clave de rendimiento (KPIs) sobre tus obligaciones, y un feed de noticias de cumplimiento impulsado por IA para mantenerte al día con las últimas regulaciones.
                            </AccordionContent>
                        </AccordionItem>
                         <AccordionItem value="item-4">
                            <AccordionTrigger className="text-base">
                                 <div className="flex items-center gap-2">
                                    <Sparkles className="h-5 w-5 text-primary" />
                                    <span>Paso 4: Usa el Asistente de IA</span>
                                </div>
                            </AccordionTrigger>
                            <AccordionContent>
                                ¿Necesitas crear una tarea rápidamente? Abre el Asistente de IA desde el Dashboard y pídeselo en lenguaje natural. Por ejemplo: "Crea un recordatorio para el pago de impuestos el día 17". El asistente también puede responder preguntas generales sobre cumplimiento.
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </CardContent>
            </Card>
        </div>
    );
};

export default QuickStartGuidePage;
