// @mui
import { DialogProps } from '@mui/material';

// ----------------------------------------------------------------------

export interface ConfirmDialogProps extends Omit<DialogProps, 'title'> {
  title: React.ReactNode;
  content?: React.ReactNode;
  action: React.ReactNode;
  open: boolean;
  onClose: VoidFunction;
}

export interface WhatsAppTemplateDialogProps extends Omit<DialogProps, 'title'> {
  title: React.ReactNode;
  action: React.ReactNode;
  open: boolean;
  onClose: VoidFunction;
  setWhatsAppTemplate: (value: string) => void;
}
