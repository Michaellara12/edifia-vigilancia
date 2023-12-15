// @mui
import { Dialog, Button, DialogTitle, DialogActions, DialogContent } from '@mui/material';
//
import { ConfirmDialogProps } from 'src/components/confirm-dialog/types';
import { hideScrollbarY } from 'src/utils/cssStyles';

// ----------------------------------------------------------------------

export default function FolderDialog({
  title,
  content,
  action,
  open,
  onClose,
  ...other
}: ConfirmDialogProps) {
  return (
    <Dialog fullWidth maxWidth="xs" open={open} onClose={onClose} {...other} >
      <DialogTitle sx={{ pb: 2 }}>{title}</DialogTitle>

      {content && <DialogContent sx={{ typography: 'body2', py: 5, ...hideScrollbarY }}> {content} </DialogContent>}

      <DialogActions>
        {action}

        <Button variant="outlined" color="inherit" onClick={onClose}>
          Cerrar
        </Button>
      </DialogActions>
    </Dialog>
  );
}
