import React from 'react';
import { Dialog, DialogTitle, DialogFooter, DialogDescription } from './Dialog';
import Button from './Button';
import { Loader2, AlertTriangle } from 'lucide-react';

interface ConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  isConfirming?: boolean;
}

const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = 'Delete',
  cancelText = 'Cancel',
  isConfirming = false,
}) => {
  return (
    <Dialog isOpen={isOpen} onClose={onClose}>
      <div className="p-6">
        <div className="sm:flex sm:items-start">
          <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-destructive/10 sm:mx-0 sm:h-10 sm:w-10">
            <AlertTriangle className="h-6 w-6 text-destructive" aria-hidden="true" />
          </div>
          <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription className="mt-2">{description}</DialogDescription>
          </div>
        </div>
      </div>
      <DialogFooter>
        <Button type="button" variant="outline" onClick={onClose} disabled={isConfirming}>
          {cancelText}
        </Button>
        <Button type="button" variant="destructive" onClick={onConfirm} disabled={isConfirming}>
          {isConfirming && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {confirmText}
        </Button>
      </DialogFooter>
    </Dialog>
  );
};

export default ConfirmationDialog;
