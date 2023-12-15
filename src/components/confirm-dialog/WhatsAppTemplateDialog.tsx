import { ChangeEvent } from 'react';
// @mui
import { 
  Dialog, 
  Button, 
  DialogTitle, 
  DialogActions, 
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  DialogContent,
  DialogContentText 
} from '@mui/material';
//
import { WhatsAppTemplateDialogProps } from './types';

// ----------------------------------------------------------------------

export default function WhatsAppTemplateDialog({
  title,
  action,
  open,
  onClose,
  setWhatsAppTemplate,
  ...other
}: WhatsAppTemplateDialogProps) {

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setWhatsAppTemplate((event.target as HTMLInputElement).value);
    console.log(event.target.value);
  };

  return (
    <Dialog fullWidth maxWidth="xs" open={open} onClose={onClose} {...other}>
      <DialogTitle sx={{ pb: 2 }}>{title}</DialogTitle>

      <DialogContent>

        <DialogContentText variant='caption' sx={{ mb: 2 }} >
          Usa las plantillas de WhatsApp cuando quieras iniciar una conversación con un usuario con el que no hayas hablado en las últimas 24 horas.
          Espera a que el usuario responda el mensaje antes de continuar la conversación.
          Recuerda que cada conversación que inicie va a tener un costo de $0.0125 USD que se verá reflejado en tu cuenta de WhatsApp Business.
          ** Estos son costos y reglas que impone Meta por el uso de la API de WhatsApp.
        </DialogContentText>

        <FormControl>
            <RadioGroup
              aria-labelledby="demo-controlled-radio-buttons-group"
              name="controlled-radio-buttons-group"
              onChange={handleChange}
            >
              <FormControlLabel 
                value="basic-template" 
                control={<Radio />} 
                label="¡Hola! 👋 ¿Cómo has estado? Te escribo porque deseo retomar nuestra conversación" 
              />
            </RadioGroup>
        </FormControl>
      </DialogContent>

      <DialogActions>
        <Button 
          variant="outlined" 
          color="inherit" 
          onClick={onClose}
        >
          Cancelar
        </Button>
        
        {action}
      </DialogActions>
    </Dialog>
  );
}
