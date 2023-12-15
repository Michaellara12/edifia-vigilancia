// @mui
import { 
    Dialog, 
    Button, 
    DialogTitle, 
    DialogContent,
    Stack,
    Typography,
    DialogActions
  } from '@mui/material';
  //
  import { hideScrollbarY } from 'src/utils/cssStyles';
  // types
  import { CustomDialogProps } from './types';
  
  // ----------------------------------------------------------------------
  
  export default function ActivateNotificationsDialog({
    title,
    open,
    onClose
  }: CustomDialogProps) {
  
    return (
      <Dialog fullWidth maxWidth="xs" open={open} onClose={onClose}>
        <DialogTitle sx={{ pb: 2 }}>{title}</DialogTitle>
          <DialogContent sx={{ typography: 'body2', ...hideScrollbarY }}>
            <Stack gap={1}>

              <Typography variant='body2'>
                Para grabar mensajes de voz, WhatsApp necesita acceso al micrófono de la computadora. Haz clic en el icono
                de la barra de la URL de tu navegador y elige "Permitir siempre que chat.noman.com.co acceda al micrófono".
              </Typography>

              <Typography variant='body2'>
                ** Una vez hayas habilitado las notificaciones por favor haz click en activar notificaciones 
                nuevamente para agregar este dispositivo.
              </Typography>
            </Stack>
          </DialogContent>
        <DialogActions>
          <Button variant="outlined" color="inherit" onClick={onClose}>
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
  