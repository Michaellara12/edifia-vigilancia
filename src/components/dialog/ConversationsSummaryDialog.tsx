// @mui
import { Dialog, Button, DialogTitle, DialogActions, DialogContent } from '@mui/material';
//
import { hideScrollbarY } from 'src/utils/cssStyles';
// types
import { ConversationsSummaryDialogProps } from './types';

// ----------------------------------------------------------------------

export default function ConversationsSummaryDialog({
  title,
  content,
  open,
  onClose,
  ...other
}: ConversationsSummaryDialogProps) {
  return (
    <Dialog fullWidth maxWidth="md" open={open} onClose={onClose} {...other}>
      <DialogTitle sx={{ pb: 2 }}>{title}</DialogTitle>
      {content && <DialogContent sx={{ typography: 'body2', ...hideScrollbarY }}> {content} </DialogContent>}
      <DialogActions>
        <Button variant="outlined" color="inherit" onClick={onClose}>
          Cerrar
        </Button>
      </DialogActions>
    </Dialog>
  );
}
