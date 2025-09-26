import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose, DialogDescription } from './ui/Dialog';
import Button from './ui/Button';
import Input from './ui/Input';
import { Textarea } from './ui/Textarea';
import { Loader2, Send } from 'lucide-react';
import { useToast } from '../hooks/useToast';

interface ShareViaEmailDialogProps {
  isOpen: boolean;
  onClose: () => void;
  documentTitle: string;
}

const ShareViaEmailDialog: React.FC<ShareViaEmailDialogProps> = ({ isOpen, onClose, documentTitle }) => {
    const { toast } = useToast();
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState(`Please find the attached report: ${documentTitle}`);
    const [isSending, setIsSending] = useState(false);

    const handleSend = async () => {
        setIsSending(true);
        // Simulate sending email
        await new Promise(resolve => setTimeout(resolve, 1500));
        setIsSending(false);
        toast({
            title: "Email Sent",
            description: `The report has been sent to ${email}.`,
        });
        onClose();
    };

    return (
        <Dialog isOpen={isOpen} onClose={onClose}>
            <DialogHeader>
                <DialogTitle>Share Report via Email</DialogTitle>
                <DialogDescription>
                    Send a link to the "{documentTitle}" report.
                </DialogDescription>
                <DialogClose onClose={onClose} />
            </DialogHeader>
            <DialogContent className="space-y-4">
                <div className="space-y-1">
                    <label htmlFor="email">Recipient's Email</label>
                    <Input id="email" type="email" placeholder="recipient@example.com" value={email} onChange={e => setEmail(e.target.value)} />
                </div>
                 <div className="space-y-1">
                    <label htmlFor="message">Message (optional)</label>
                    <Textarea id="message" value={message} onChange={e => setMessage(e.target.value)} rows={4} />
                </div>
            </DialogContent>
            <DialogFooter>
                <Button variant="outline" onClick={onClose}>Cancel</Button>
                <Button onClick={handleSend} disabled={isSending || !email}>
                    {isSending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
                    Send
                </Button>
            </DialogFooter>
        </Dialog>
    );
};

export default ShareViaEmailDialog;
