import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/Card';
import Button from '../ui/Button';
import { RefreshCw, Loader2, AlertTriangle, Newspaper, Link, PlusCircle } from 'lucide-react';
import { useApp } from '../../hooks/useApp';
import { getComplianceNews } from '../../services/geminiService';
import { useLanguage } from '../../hooks/useLanguage';

interface NewsItem {
    summary: string;
    sources: { uri: string; title: string }[];
}

interface ComplianceNewsFeedProps {
    onCreateTask: (task: { title: string, description: string }) => void;
}

const ComplianceNewsFeed: React.FC<ComplianceNewsFeedProps> = ({ onCreateTask }) => {
    const { activeCompany } = useApp();
    const { t } = useLanguage();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [news, setNews] = useState<NewsItem | null>(null);

    const handleFetchNews = async () => {
        if (!activeCompany) return;
        setIsLoading(true);
        setError(null);
        setNews(null);

        try {
            const companyProfile = {
                sector: activeCompany.programas?.prosec?.sector,
                programs: Object.keys(activeCompany.programas).filter(p => !!(activeCompany.programas as any)[p])
            };
            const result = await getComplianceNews(companyProfile);
            setNews(result);
        } catch (err) {
            setError(err instanceof Error ? err.message : "An unknown error occurred.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle className="flex items-center gap-2"><Newspaper className="h-5 w-5" /> {t('complianceNewsFeed')}</CardTitle>
                    <CardDescription>{t('complianceNewsFeedDesc')}</CardDescription>
                </div>
                <Button variant="outline" size="sm" onClick={handleFetchNews} disabled={isLoading}>
                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <RefreshCw className="mr-2 h-4 w-4" />}
                    {t('refresh')}
                </Button>
            </CardHeader>
            <CardContent>
                {isLoading && (
                    <div className="text-center py-8">
                        <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
                        <p className="mt-2 text-muted-foreground">{t('searchingUpdates')}</p>
                    </div>
                )}
                {error && (
                    <div className="text-center py-8 text-destructive bg-destructive/10 rounded-lg">
                        <AlertTriangle className="mx-auto h-8 w-8" />
                        <p className="mt-2 font-semibold">{t('fetchNewsError')}</p>
                        <p className="text-sm">{error}</p>
                    </div>
                )}
                {!isLoading && !error && !news && (
                    <div className="text-center py-8">
                        <Newspaper className="mx-auto h-8 w-8 text-muted-foreground" />
                        <p className="mt-2 text-muted-foreground">{t('promptForNews')}</p>
                    </div>
                )}
                {news && (
                    <div className="space-y-4 animate-in fade-in-0">
                        <div className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap">{news.summary}</div>

                        {news.sources.length > 0 && (
                            <div>
                                <h4 className="font-semibold text-sm mb-2">{t('sources')}:</h4>
                                <div className="flex flex-wrap gap-2">
                                    {news.sources.map((source, index) => (
                                        <a
                                            key={index}
                                            href={source.uri}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-1.5 bg-secondary text-secondary-foreground hover:bg-secondary/80 px-2 py-1 rounded-md text-xs"
                                        >
                                            <Link className="h-3 w-3" />
                                            <span className="truncate max-w-xs">{source.title}</span>
                                        </a>
                                    ))}
                                </div>
                            </div>
                        )}
                        <div className="pt-2 border-t">
                            <Button size="sm" variant="secondary" onClick={() => onCreateTask({ title: t('reviewComplianceUpdate'), description: news.summary })}>
                                <PlusCircle className="mr-2 h-4 w-4" /> {t('createTaskFromUpdate')}
                            </Button>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export default ComplianceNewsFeed;
