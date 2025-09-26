import React, { useState } from 'react';
import { Dialog, DialogHeader, DialogTitle, DialogDescription, DialogContent, DialogFooter, DialogClose } from '../ui/Dialog';
import Button from '../ui/Button';
import { Loader2, Sparkles, AlertTriangle, CheckCircle } from 'lucide-react';

interface AIHealthCheckDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const AIHealthCheckDialog: React.FC<AIHealthCheckDialogProps> = ({ isOpen, onClose }) => {
    const [status, setStatus] = useState<'idle' | 'running' | 'complete' | 'error'>('idle');
    const [results, setResults] = useState<string[]>([]);

    const handleRunCheck = async () => {
        setStatus('running');
        setResults([]);
        // Simulate an AI check
        await new Promise(res => setTimeout(res, 2000));
        setResults([
            'All IMMEX documentation appears to be up to date.',
            'Potential risk found: PROSEC authorization expires in 90 days.',
            'Recommendation: Schedule a review of customs agent contracts.',
        ]);
        setStatus('complete');
    };

    const handleClose = () => {
        setStatus('idle');
        onClose();
    };

    return (
        <Dialog isOpen={isOpen} onClose={handleClose}>
            <DialogHeader>
                <DialogTitle className="flex items-center gap-2"><Sparkles className="text-yellow-500" /> AI Compliance Health Check</DialogTitle>
                <DialogDescription>Let AI analyze your company profile for potential compliance risks and recommendations.</DialogDescription>
                <DialogClose onClose={handleClose} />
            </DialogHeader>
            <DialogContent className="min-h-[200px]">
                {status === 'idle' && (
                    <div className="text-center p-8">
                        <p>Click "Run Check" to start the analysis.</p>
                    </div>
                )}
                {status === 'running' && (
                    <div className="text-center p-8">
                        <Loader2 className="h-12 w-12 mx-auto animate-spin text-primary" />
                        <p className="mt-4 text-muted-foreground">Analyzing your compliance data...</p>
                    </div>
                )}
                 {status === 'complete' && (
                    <div className="space-y-3">
                        <h3 className="font-semibold flex items-center gap-2"><CheckCircle className="h-5 w-5 text-completed" /> Analysis Complete</h3>
                        <ul className="list-disc list-inside text-sm space-y-2">
                           {results.map((res, i) => <li key={i}>{res}</li>)}
                        </ul>
                    </div>
                )}
                 {status === 'error' && (
                     <div className="text-center p-8 text-destructive">
                        <AlertTriangle className="h-12 w-12 mx-auto" />
                        <p className="mt-4 font-semibold">An error occurred during the analysis.</p>
                    </div>
                 )}
            </DialogContent>
            <DialogFooter>
                <Button variant="outline" onClick={handleClose}>Close</Button>
                <Button onClick={handleRunCheck} disabled={status === 'running'}>
                    {status === 'running' ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                    {status === 'complete' ? 'Run Again' : 'Run Check'}
                </Button>
            </DialogFooter>
        </Dialog>
    );
};

export default AIHealthCheckDialog;
