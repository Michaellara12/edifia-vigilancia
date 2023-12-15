// @mui
import { DialogProps } from '@mui/material';

// ----------------------------------------------------------------------

export interface ConversationsSummaryDialogProps extends Omit<DialogProps, 'title'> {
  title: React.ReactNode;
  content?: React.ReactNode;
  open: boolean;
  onClose: VoidFunction;
}

export interface CustomDialogProps extends Omit<DialogProps, 'title'> {
  title: React.ReactNode;
  content?: React.ReactNode;
  open: boolean;
  onClose: VoidFunction;
}