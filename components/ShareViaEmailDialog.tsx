import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose, DialogDescription } from './ui/Dialog';
import Button from './ui/Button';
import Input from './ui/Input';
import { Loader2, Send } from 'lucide-react';
import { useToast } from '../hooks/useToast';

interface ShareViaEmailDialogProps {
  isOpen: boolean;
  onClose: () => void;
  documentTitle: string;
}

const ShareViaEmailDialog: React.FC<ShareViaEmailDialogProps> = ({ isOpen, onClose, documentTitle }) => {
  const [email, setEmail] = useState('');
  const [isSending, setIsSending] = useState(false);
  const { toast } = useToast();

  const handleSend = async () => {
    if (!email) return;
    setIsSending(true);
    // Simulate sending email
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSending(false);
    toast({
      title: "Document Sent",
      description: `"${documentTitle}" has been sent to ${email}.`
    });
    onClose();
    setEmail('');
  };

  return (
    <Dialog isOpen={isOpen} onClose={onClose}>
        <DialogHeader>
            <DialogTitle>Share via Email</DialogTitle>
            <DialogDescription>Send "{documentTitle}" to a colleague.</DialogDescription>
            <DialogClose onClose={onClose} />
        </DialogHeader>
        <DialogContent>
            <div className="space-y-2">
                <label htmlFor="email-share" className="text-sm font-medium">Recipient's Email</label>
                <Input
                    id="email-share"
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
            </div>
        </DialogContent>
        <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={isSending}>Cancel</Button>
            <Button onClick={handleSend} disabled={isSending || !email}>
                {isSending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
                Send
            </Button>
        </DialogFooter>
    </Dialog>
  );
};

export default ShareViaEmailDialog;
