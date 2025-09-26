import React, { useState, useMemo, useEffect } from 'react';
import { useApp } from '../hooks/useApp';
import { useAuth } from '../hooks/useAuth';
import { useLanguage } from '../hooks/useLanguage';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { Loader2, BookOpen, PlusCircle, Search, Download, Trash2, Sparkles, AlertTriangle } from 'lucide-react';
import { ComplianceDocument } from '../lib/types';
import LibraryUploadDialog from '../components/compliance-library/LibraryUploadDialog';
import ConfirmationDialog from '../components/ui/ConfirmationDialog';
import { useToast } from '../hooks/useToast';

const ComplianceLibraryPage = () => {
    const { complianceDocuments, deleteComplianceDocument: deleteDocFromContext } = useApp();
    const { user } = useAuth();
    const { t } = useLanguage();
    const { toast } = useToast();

    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [isUploadOpen, setUploadOpen] = useState(false);
    const [docToDelete, setDocToDelete] = useState<ComplianceDocument | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const canManage = user?.role === 'admin' || user?.role === 'consultor';

    useEffect(() => {
        if (complianceDocuments) {
            setLoading(false);
        }
    }, [complianceDocuments]);

    const categories = useMemo(() => 
        ['All', ...Array.from(new Set(complianceDocuments.map(d => d.category)))]
    , [complianceDocuments]);

    const filteredDocuments = useMemo(() => {
        // Sanitize search term: split into words, filter out empty strings
        const searchTerms = searchTerm.toLowerCase().split(' ').filter(term => term.length > 0);

        return complianceDocuments
            .filter(doc => {
                // First, filter by category
                const categoryMatch = selectedCategory === 'All' || doc.category === selectedCategory;
                if (!categoryMatch) {
                    return false;
                }

                // If no search term, return all docs in the selected category
                if (searchTerms.length === 0) {
                    return true;
                }

                // Combine all searchable fields into a single string for easier searching
                const searchableText = [
                    doc.title,
                    doc.description,
                    doc.aiSummary || ''
                ].join(' ').toLowerCase();

                // "Fuzzy" search: check if every word from the search term exists in the text
                return searchTerms.every(term => searchableText.includes(term));
            })
            .sort((a, b) => new Date(b.publicationDate).getTime() - new Date(a.publicationDate).getTime());
    }, [complianceDocuments, searchTerm, selectedCategory]);

    const handleDelete = async () => {
        if (!docToDelete || !canManage) return;
        setIsDeleting(true);
        try {
            await deleteDocFromContext(docToDelete.id);
            toast({ title: "Document Deleted", description: `"${docToDelete.title}" has been removed from the library.` });
            setDocToDelete(null);
        } catch (error) {
            toast({ variant: "destructive", title: "Error", description: "Failed to delete the document." });
        } finally {
            setIsDeleting(false);
        }
    };

    if (loading) {
        return <div className="flex h-full items-center justify-center"><Loader2 className="h-16 w-16 animate-spin text-primary" /></div>;
    }

    return (
        <>
            <div className="space-y-6">
                <div className="flex justify-between items-center flex-wrap gap-4">
                    <div className="space-y-1">
                        <h1 className="text-2xl font-bold flex items-center gap-2"><BookOpen className="h-6 w-6" /> {t('complianceLibrary')}</h1>
                        <p className="text-muted-foreground">{t('complianceLibraryDesc')}</p>
                    </div>
                    {canManage && (
                        <Button onClick={() => setUploadOpen(true)}>
                            <PlusCircle className="mr-2 h-4 w-4" />
                            {t('uploadLegalDocument')}
                        </Button>
                    )}
                </div>

                <Card>
                    <CardHeader>
                        <div className="flex justify-between items-center flex-wrap gap-4">
                            <div className="relative flex-1 min-w-[200px]">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input 
                                    placeholder="Search documents..." 
                                    className="pl-10"
                                    value={searchTerm}
                                    onChange={e => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <div className="flex items-center gap-2 flex-wrap">
                                {categories.map(category => (
                                    <Button 
                                        key={category}
                                        variant={selectedCategory === category ? 'default' : 'outline'}
                                        size="sm"
                                        onClick={() => setSelectedCategory(category)}
                                    >
                                        {category}
                                    </Button>
                                ))}
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {filteredDocuments.length > 0 ? filteredDocuments.map(doc => (
                                <DocumentCard key={doc.id} doc={doc} canManage={canManage} onDeleteClick={() => setDocToDelete(doc)} />
                            )) : (
                                <div className="text-center py-12">
                                    <p className="text-muted-foreground">No documents found matching your criteria.</p>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
            <LibraryUploadDialog isOpen={isUploadOpen} onClose={() => setUploadOpen(false)} />
            {docToDelete && (
                <ConfirmationDialog 
                    isOpen={!!docToDelete}
                    onClose={() => setDocToDelete(null)}
                    onConfirm={handleDelete}
                    title="Delete Document"
                    description={`Are you sure you want to permanently delete "${docToDelete.title}"?`}
                    isConfirming={isDeleting}
                />
            )}
        </>
    );
};

const DocumentCard: React.FC<{ doc: ComplianceDocument, canManage: boolean, onDeleteClick: () => void }> = ({ doc, canManage, onDeleteClick }) => {
    return (
        <div className="border rounded-lg p-4 flex flex-col sm:flex-row gap-4 hover:bg-accent/50 transition-colors">
            <div className="flex-1">
                <div className="flex justify-between items-start">
                    <div>
                        <span className="text-xs font-semibold uppercase text-primary bg-primary/10 px-2 py-1 rounded-full">{doc.category}</span>
                        <h3 className="text-lg font-semibold mt-1">{doc.title}</h3>
                        <p className="text-sm text-muted-foreground">{doc.description}</p>
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0">
                         <a href={doc.fileUrl} target="_blank" rel="noopener noreferrer">
                            <Button variant="ghost" size="icon" title="Download Document">
                                <Download className="h-4 w-4" />
                            </Button>
                        </a>
                        {canManage && (
                             <Button variant="ghost" size="icon" title="Delete Document" onClick={onDeleteClick}>
                                <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                        )}
                    </div>
                </div>

                {doc.aiSummary && (
                    <div className="mt-3 p-3 rounded-md bg-background border">
                        <h4 className="font-semibold text-sm flex items-center gap-1.5"><Sparkles className="h-4 w-4 text-yellow-500" /> AI Summary</h4>
                        <div className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap mt-2 text-muted-foreground">
                            {doc.aiSummary}
                        </div>
                    </div>
                )}
                 {!doc.aiSummary && (
                    <div className="mt-3 p-3 rounded-md bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-300 flex items-center gap-2 text-sm">
                        <AlertTriangle className="h-4 w-4" />
                        No AI summary available for this document.
                    </div>
                )}
            </div>
        </div>
    );
};

export default ComplianceLibraryPage;