import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose, DialogDescription } from '../ui/Dialog';
import Button from '../ui/Button';
import { Loader2, ShieldCheck, AlertTriangle, CheckCircle } from 'lucide-react';
import { getAIAssistantResponse } from '../../services/geminiService';

interface AIHealthCheckDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

type CheckStatus = 'idle' | 'checking' | 'success' | 'error';

const AIHealthCheckDialog: React.FC<AIHealthCheckDialogProps> = ({ isOpen, onClose }) => {
  const [status, setStatus] = useState<CheckStatus>('idle');
  const [message, setMessage] = useState('');

  const handleRunCheck = async () => {
    setStatus('checking');
    try {
        const response = await getAIAssistantResponse("Health check: say 'ok'", "You are a health check service. Respond with 'ok'.");
        if (response.toLowerCase().includes('ok')) {
            setStatus('success');
            setMessage('AI services are operating normally.');
        } else {
            setStatus('error');
            setMessage(`Received an unexpected response from the AI service: ${response}`);
        }
    } catch (error) {
        setStatus('error');
        setMessage(error instanceof Error ? error.message : 'An unknown error occurred during the health check.');
        console.error("AI Health Check failed:", error);
    }
  };

  const resetState = () => {
      onClose();
      // Delay reset to allow dialog to close smoothly
      setTimeout(() => {
          setStatus('idle');
          setMessage('');
      }, 300);
  };

  return (
    <Dialog isOpen={isOpen} onClose={resetState}>
        <DialogHeader>
            <DialogTitle>AI Service Health Check</DialogTitle>
            <DialogDescription>Verify the connection to the AI assistant service.</DialogDescription>
            <DialogClose onClose={resetState} />
        </DialogHeader>
        <DialogContent className="text-center p-8">
            {status === 'idle' && (
                <>
                    <ShieldCheck className="mx-auto h-16 w-16 text-muted-foreground" />
                    <p className="mt-4 text-muted-foreground">Click the button below to start the health check.</p>
                </>
            )}
            {status === 'checking' && (
                <>
                    <Loader2 className="mx-auto h-16 w-16 animate-spin text-primary" />
                    <p className="mt-4 text-muted-foreground">Pinging AI services...</p>
                </>
            )}
            {status === 'success' && (
                 <>
                    <CheckCircle className="mx-auto h-16 w-16 text-completed" />
                    <p className="mt-4 font-semibold text-completed">Connection Successful</p>
                    <p className="text-sm text-muted-foreground">{message}</p>
                </>
            )}
            {status === 'error' && (
                <>
                    <AlertTriangle className="mx-auto h-16 w-16 text-destructive" />
                    <p className="mt-4 font-semibold text-destructive">Connection Failed</p>
                    <p className="text-sm text-muted-foreground">{message}</p>
                </>
            )}
        </DialogContent>
        <DialogFooter>
            <Button type="button" variant="outline" onClick={resetState}>Close</Button>
            <Button onClick={handleRunCheck} disabled={status === 'checking'}>
                {status === 'checking' ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Checking...
                    </>
                ) : 'Run Health Check'}
            </Button>
        </DialogFooter>
    </Dialog>
  );
};

export default AIHealthCheckDialog;
